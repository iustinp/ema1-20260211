/* eslint-disable */
/* global WebImporter */

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/worldbank-cleanup.js';
import sectionsTransformer from './transformers/worldbank-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'impact-program',
  description: 'Impact program page template showcasing a specific World Bank Academy thematic program with details, outcomes, and related resources',
  urls: [
    'https://academy.worldbank.org/en/our-programs/by-theme/jobs-for-the-poor',
  ],
  blocks: [],
  sections: [
    {
      id: 'section-1',
      name: 'Page Title and Banner',
      selector: '.par.parsys > .supergrid',
      style: null,
      blocks: [],
      defaultContent: [
        '.lp__heading_v1 h1',
        '.redesign_image .lp__image_components img',
      ],
    },
    {
      id: 'section-2',
      name: 'Body Content',
      selector: '.redesign_static_content article.lp__body_content',
      style: null,
      blocks: [],
      defaultContent: [
        'article.lp__body_content',
      ],
    },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook.
 * @param {string} hookName - 'beforeTransform' or 'afterTransform'
 * @param {Element} element - The DOM element to transform
 * @param {Object} payload - { document, url, html, params }
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    // 1. Execute beforeTransform (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. No blocks to parse — this template is all default content

    // 3. Execute afterTransform (final cleanup + section breaks)
    executeTransformers('afterTransform', main, payload);

    // 4. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 5. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: [],
      },
    }];
  },
};
