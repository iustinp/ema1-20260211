/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: World Bank Academy sections.
 * Adds section breaks (<hr>) between sections based on template definitions.
 * Runs in afterTransform only, uses payload.template.sections.
 * All selectors from page-templates.json (verified against captured DOM).
 */
const H = { after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName !== H.after) return;

  const { template } = payload || {};
  if (!template || !template.sections || template.sections.length < 2) return;

  const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document: element };
  const doc = document || element.ownerDocument;

  // Process sections in reverse order to avoid shifting DOM positions
  const sections = [...template.sections].reverse();

  sections.forEach((section, reverseIndex) => {
    const originalIndex = template.sections.length - 1 - reverseIndex;

    // Skip first section — no <hr> before the first section
    if (originalIndex === 0) return;

    // Find the section element using selector(s)
    const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
    let sectionEl = null;

    for (const sel of selectors) {
      sectionEl = element.querySelector(sel);
      if (sectionEl) break;
    }

    if (!sectionEl) return;

    // Insert <hr> before this section
    const hr = doc.createElement('hr');
    sectionEl.before(hr);

    // Add section-metadata block if section has a style
    if (section.style) {
      const metaBlock = WebImporter.Blocks.createBlock(doc, {
        name: 'Section Metadata',
        cells: [['style', section.style]],
      });
      // Insert section-metadata after the section's last child (before next hr)
      sectionEl.after(metaBlock);
    }
  });
}
