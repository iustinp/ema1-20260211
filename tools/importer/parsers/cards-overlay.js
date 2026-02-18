/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-overlay variant.
 * Base block: cards. Source: https://academy.worldbank.org/en/home
 * Selector: .lp-sticky-card-grid
 *
 * Block library structure (cards, container, 3 columns):
 *   Row 1: block name
 *   Each subsequent row: card (label) | image | text (heading + description + CTA)
 *
 * xwalk model fields (card):
 *   - image (reference) → column 2
 *   - text (richtext) → column 3
 *   Skip: classes
 *
 * Source DOM (.lp-sticky-card-grid):
 *   - .lp-sticky-card → each card
 *     - .lp-sticky-card-img img → card image
 *     - .lp-sticky-card-content h3 → card heading
 *     - .lp-sticky-card-content p → card description
 */
export default function parse(element, { document }) {
  const cards = element.querySelectorAll('.lp-sticky-card');
  const cells = [];

  cards.forEach((card) => {
    const img = card.querySelector('.lp-sticky-card-img img, .lp-sticky-card-img picture');
    const heading = card.querySelector('.lp-sticky-card-content h3');
    const description = card.querySelector('.lp-sticky-card-content p');

    // Column 1: item label
    const label = 'card';

    // Column 2: image with field hint
    const imageFrag = document.createDocumentFragment();
    imageFrag.appendChild(document.createComment(' field:image '));
    if (img) imageFrag.appendChild(img);

    // Column 3: text content with field hint
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:text '));
    if (heading) textFrag.appendChild(heading);
    if (description) textFrag.appendChild(description);

    cells.push([label, imageFrag, textFrag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-overlay', cells });
  element.replaceWith(block);
}
