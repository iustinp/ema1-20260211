/* eslint-disable */
/* global WebImporter */

/**
 * Parser for form-finder variant.
 * Base block: form. Source: https://academy.worldbank.org/en/home
 * Selector: section.lp-find-program
 *
 * Block library structure (form, simple block, 1 row with N columns):
 *   Row 1: block name
 *   Row 2: col1 = reference (aem-content path) | col2 = action URL
 *
 * xwalk model fields (form-finder):
 *   - reference (aem-content) → column 1: content reference path
 *   - action (text) → column 2: action URL
 *   Skip: classes
 *
 * Source DOM (section.lp-find-program):
 *   - h2 → "Find your program" (default content, placed before block)
 *   - .finder-container → contains 3 custom-dropdown elements + go-button
 *   - .go-button → submit button
 */
export default function parse(element, { document }) {
  const heading = element.querySelector('h2');

  // Move the heading before the block as default content
  if (heading) {
    element.before(heading);
  }

  // Column 1: reference (aem-content expects a path, not inline content)
  const refFrag = document.createDocumentFragment();
  refFrag.appendChild(document.createComment(' field:reference '));

  // Column 2: action URL
  const actionFrag = document.createDocumentFragment();
  actionFrag.appendChild(document.createComment(' field:action '));
  const actionP = document.createElement('p');
  actionP.textContent = 'https://academy.worldbank.org/en/our-programs';
  actionFrag.appendChild(actionP);

  // Single row with 2 columns (1 column per model field)
  const cells = [
    [refFrag, actionFrag],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'form-finder', cells });
  element.replaceWith(block);
}
