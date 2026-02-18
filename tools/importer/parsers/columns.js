/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns block (icon columns variant).
 * Base block: columns. Source: https://academy.worldbank.org/en/how-we-work
 * Selector: .academy_list_navigation
 *
 * Block library structure (columns):
 *   Row 1: block name "Columns"
 *   Row 2: col1 | col2 | col3 | col4
 *   Each column: icon image + title heading + description paragraph
 *
 * Source DOM (.academy_list_navigation):
 *   - .lp__listnav_icon_cta → each column
 *     - .lp__listnav_icon_cta_top img → icon image
 *     - .lp__listnav_icon_cta_title span:first-child → title text
 *     - .lp__listnav_icon_cta_bottom p → description text
 */
export default function parse(element, { document }) {
  const columns = element.querySelectorAll('.lp__listnav_icon_cta');
  if (!columns.length) return;

  const row = [];

  columns.forEach((col) => {
    const img = col.querySelector('.lp__listnav_icon_cta_top img');
    const titleSpan = col.querySelector('.lp__listnav_icon_cta_title span:first-child');
    const descP = col.querySelector('.lp__listnav_icon_cta_bottom p');

    const frag = document.createDocumentFragment();

    if (img) {
      const p = document.createElement('p');
      p.appendChild(img);
      frag.appendChild(p);
    }

    if (titleSpan) {
      const h3 = document.createElement('h3');
      h3.textContent = titleSpan.textContent.trim();
      frag.appendChild(h3);
    }

    if (descP) {
      frag.appendChild(descP);
    }

    row.push(frag);
  });

  const cells = [row];
  const block = WebImporter.Blocks.createBlock(document, { name: 'Columns', cells });
  element.replaceWith(block);
}
