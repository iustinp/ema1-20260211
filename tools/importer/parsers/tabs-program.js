/* eslint-disable */
/* global WebImporter */

/**
 * Parser for tabs-program variant.
 * Base block: tabs. Source: https://academy.worldbank.org/en/home
 * Selector: .lp__tab
 *
 * IMPORTANT: This parser must run BEFORE carousel-program in the import script,
 * because tab panels contain .academy-carousel elements. If carousel-program
 * runs first, it replaces those carousels and the tab content is lost.
 *
 * Block library structure (tabs, container, 4 columns per item):
 *   Row 1: block name
 *   Each subsequent row: one card (tab | title | image | description)
 *   Cards are grouped by their tab value in the block JS.
 *
 * xwalk model fields (tabs-program-item):
 *   - tab (text) → column 1: tab group label (e.g. "People")
 *   - title (text) → column 2: card title (e.g. "Education")
 *   - image (reference) → column 3: card image
 *   - description (richtext) → column 4: card description
 *
 * Source DOM (.lp__tab):
 *   - .lp__tablist li a → tab labels (People, Planet, Prosperity, etc.)
 *   - .lp__tabcontent > div.tab_wbr → tab content panels
 *     - Each panel contains .academy-carousel with .swiper-slide cards
 *       - .lp-aca-card-img img → card image
 *       - .lp-aca-card-title a → card title with link
 *       - .lp-aca-card-description → card description
 */
export default function parse(element, { document }) {
  const tabLinks = element.querySelectorAll('.lp__tablist li a');
  const tabPanels = element.querySelectorAll('.lp__tabcontent > div.tab_wbr, .lp__tabcontent > div[id^="tab-"]');
  const cells = [];

  tabLinks.forEach((tabLink, index) => {
    const tabLabel = tabLink.textContent.trim();
    const panel = tabPanels[index];
    if (!panel) return;

    const cards = panel.querySelectorAll('.lp-aca-card');

    cards.forEach((card) => {
      // Column 1: tab group label
      const tabFrag = document.createDocumentFragment();
      const tabP = document.createElement('p');
      tabP.textContent = tabLabel;
      tabFrag.appendChild(tabP);

      // Column 2: card title
      const titleFrag = document.createDocumentFragment();
      const cardTitleEl = card.querySelector('.lp-aca-card-title a, h3.lp-aca-card-title a');
      if (cardTitleEl) {
        const titleP = document.createElement('p');
        const link = document.createElement('a');
        link.href = cardTitleEl.href || cardTitleEl.getAttribute('href') || '';
        link.textContent = cardTitleEl.textContent.trim();
        titleP.appendChild(link);
        titleFrag.appendChild(titleP);
      }

      // Column 3: card image
      const imageFrag = document.createDocumentFragment();
      const cardImg = card.querySelector('.lp-aca-card-img img');
      if (cardImg) {
        imageFrag.appendChild(cardImg.cloneNode(true));
      }

      // Column 4: card description
      const descFrag = document.createDocumentFragment();
      const cardDesc = card.querySelector('.lp-aca-card-description');
      if (cardDesc) {
        const descP = document.createElement('p');
        descP.textContent = cardDesc.textContent.trim();
        descFrag.appendChild(descP);
      }

      cells.push([tabFrag, titleFrag, imageFrag, descFrag]);
    });
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-program', cells });
  element.replaceWith(block);
}
