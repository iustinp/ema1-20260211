/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroVideoParser from './parsers/hero-video.js';
import cardsOverlayParser from './parsers/cards-overlay.js';
import cardsProgramParser from './parsers/cards-program.js';
import carouselProgramParser from './parsers/carousel-program.js';
import formFinderParser from './parsers/form-finder.js';
import tabsProgramParser from './parsers/tabs-program.js';

// TRANSFORMER IMPORTS
import worldbankCleanupTransformer from './transformers/worldbank-cleanup.js';
import worldbankSectionsTransformer from './transformers/worldbank-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-video': heroVideoParser,
  'cards-overlay': cardsOverlayParser,
  'cards-program': cardsProgramParser,
  'carousel-program': carouselProgramParser,
  'form-finder': formFinderParser,
  'tabs-program': tabsProgramParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  worldbankCleanupTransformer,
  worldbankSectionsTransformer,
];

// PAGE TEMPLATE CONFIGURATION (embedded from page-templates.json)
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'World Bank Academy homepage with hero, featured courses, programs, and promotional sections',
  urls: [
    'https://academy.worldbank.org/en/home',
  ],
  blocks: [
    {
      name: 'hero-video',
      instances: ['section.video-banner'],
    },
    {
      name: 'cards-overlay',
      instances: ['.lp-sticky-card-grid'],
    },
    {
      name: 'cards-program',
      instances: ['.academySliderComp .sticky-column'],
    },
    {
      name: 'tabs-program',
      instances: ['.lp__tab'],
    },
    {
      name: 'carousel-program',
      instances: ['.academy-carousel'],
    },
    {
      name: 'form-finder',
      instances: ['section.lp-find-program'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero Banner',
      selector: 'section.video-banner',
      style: null,
      blocks: ['hero-video'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Value Proposition Cards',
      selector: 'section.sticky-section#one-center',
      style: null,
      blocks: ['cards-overlay'],
      defaultContent: ['.sticky-content h2', '.sticky-content a.btn'],
    },
    {
      id: 'section-3',
      name: 'Program Types',
      selector: '.academySliderComp',
      style: null,
      blocks: ['cards-program'],
      defaultContent: ['.lp-aca-heading h2'],
    },
    {
      id: 'section-4',
      name: 'Impact Programs Carousel',
      selector: '.tui_full_row_swiper',
      style: null,
      blocks: ['carousel-program'],
      defaultContent: ['.lp-aca-heading h2', '.lp-aca-heading p'],
    },
    {
      id: 'section-5',
      name: 'Find Your Program',
      selector: 'section.lp-find-program',
      style: null,
      blocks: ['form-finder'],
      defaultContent: [],
    },
    {
      id: 'section-6',
      name: 'Programs for All',
      selector: ['.tui_full_row_swiper:nth-of-type(2)', '.supergrid:has(.lp__tab)'],
      style: null,
      blocks: ['tabs-program'],
      defaultContent: ['.lp-aca-heading h2', '.lp-aca-heading .lp-body-text-medium'],
    },
  ],
};

/**
 * Execute all page transformers for a specific hook.
 * @param {string} hookName - 'beforeTransform' or 'afterTransform'
 * @param {Element} element - The DOM element to transform
 * @param {Object} payload - The payload containing { document, url, html, params }
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration.
 * @param {Document} document - The DOM document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} Array of block instances found on the page
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
