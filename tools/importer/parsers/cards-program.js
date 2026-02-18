/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-program variant.
 * Base block: cards. Source: https://academy.worldbank.org/en/home
 * Selector: .academySliderComp .sticky-column
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
 * Source DOM (.academySliderComp .sticky-column):
 *   - .lp-aca-card → each card
 *     - .lp-aca-card-img img → card image
 *     - .lp-aca-card-tag → optional tag (e.g., "New for 2025")
 *     - .lp-aca-card-title a → card title with link
 *     - .lp-aca-card-description → card description
 *     - .lp-aca-card-link → CTA link(s)
 */
export default function parse(element, { document }) {
  const cards = element.querySelectorAll('.lp-aca-card');
  const cells = [];

  cards.forEach((card) => {
    const img = card.querySelector('.lp-aca-card-img img, .lp-aca-card-img picture');
    const tag = card.querySelector('.lp-aca-card-tag');
    const titleLink = card.querySelector('.lp-aca-card-title a, h3.lp-aca-card-title a');
    const description = card.querySelector('.lp-aca-card-description');
    const ctaLinks = card.querySelectorAll('.lp-aca-card-link');

    // Column 1: item label
    const label = 'card';

    // Column 2: image with field hint
    const imageFrag = document.createDocumentFragment();
    imageFrag.appendChild(document.createComment(' field:image '));
    if (img) imageFrag.appendChild(img);

    // Column 3: text content with field hint
    // Combine tag, title, description, and CTA links into richtext
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:text '));

    if (tag) {
      const tagP = document.createElement('p');
      tagP.textContent = tag.textContent.trim();
      textFrag.appendChild(tagP);
    }

    if (titleLink) {
      const h3 = document.createElement('h3');
      h3.appendChild(titleLink);
      textFrag.appendChild(h3);
    }

    if (description) {
      const descP = document.createElement('p');
      descP.textContent = description.textContent.trim();
      textFrag.appendChild(descP);
    }

    ctaLinks.forEach((link) => {
      const p = document.createElement('p');
      p.appendChild(link);
      textFrag.appendChild(p);
    });

    cells.push([label, imageFrag, textFrag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-program', cells });
  element.replaceWith(block);
}
