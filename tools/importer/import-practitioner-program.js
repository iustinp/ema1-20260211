/* eslint-disable */
/* global WebImporter */

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/worldbank-cleanup.js';
import sectionsTransformer from './transformers/worldbank-sections.js';

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'practitioner-program',
  description: 'Practitioner program course page with hero banner, course metadata grid, and overview content',
  urls: [
    'https://academy.worldbank.org/en/people/education/literacy-policy',
  ],
  blocks: [],
  sections: [
    {
      id: 'section-1',
      name: 'Hero and Course Details',
      selector: '.par.parsys > .supergrid:first-child',
      style: null,
      blocks: [],
      defaultContent: [
        '.eventdetail__title',
        '.eventdetail__description',
        '.eventdetail_enroll_btn',
        '.eventdetail__image img',
        '.eventdetail_banner_bottom_content',
      ],
    },
    {
      id: 'section-2',
      name: 'Overview',
      selector: '.par.parsys > .supergrid:nth-child(2)',
      style: null,
      blocks: [],
      defaultContent: [
        '.lp__heading_v1 h2',
        '.redesign_static_content',
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
