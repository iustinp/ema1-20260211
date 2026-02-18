// eslint-disable-next-line import/no-unresolved
import { moveInstrumentation } from '../../scripts/scripts.js';

// keep track globally of the number of tab blocks on the page
let tabBlockCnt = 0;

export default async function decorate(block) {
  tabBlockCnt += 1;

  // Each row is a card with 4 cells: tab | title | image | description
  // Group rows by their tab value to build tab panels
  const rows = [...block.children];
  const tabGroups = new Map();

  rows.forEach((row) => {
    const cells = [...row.children];
    const tabName = cells[0]?.textContent.trim() || '';
    if (!tabGroups.has(tabName)) {
      tabGroups.set(tabName, []);
    }
    tabGroups.get(tabName).push({
      row,
      title: cells[1],
      image: cells[2],
      description: cells[3],
    });
  });

  // Clear block content
  block.textContent = '';

  // Build tablist
  const tablist = document.createElement('div');
  tablist.className = 'tabs-program-list';
  tablist.setAttribute('role', 'tablist');
  tablist.id = `tablist-${tabBlockCnt}`;

  let tabIndex = 0;
  tabGroups.forEach((cards, tabName) => {
    const id = `tabpanel-${tabBlockCnt}-tab-${tabIndex + 1}`;

    // Build tab button
    const button = document.createElement('button');
    button.className = 'tabs-program-tab';
    button.id = `tab-${id}`;
    button.textContent = tabName;
    button.setAttribute('aria-controls', id);
    button.setAttribute('aria-selected', tabIndex === 0);
    button.setAttribute('role', 'tab');
    button.setAttribute('type', 'button');

    button.addEventListener('click', () => {
      block.querySelectorAll('[role=tabpanel]').forEach((panel) => {
        panel.setAttribute('aria-hidden', true);
      });
      tablist.querySelectorAll('button').forEach((btn) => {
        btn.setAttribute('aria-selected', false);
      });
      block.querySelector(`#${id}`).setAttribute('aria-hidden', false);
      button.setAttribute('aria-selected', true);
    });

    tablist.append(button);

    // Build tab panel with cards
    const tabpanel = document.createElement('div');
    tabpanel.className = 'tabs-program-panel';
    tabpanel.id = id;
    tabpanel.setAttribute('aria-hidden', tabIndex !== 0);
    tabpanel.setAttribute('aria-labelledby', `tab-${id}`);
    tabpanel.setAttribute('role', 'tabpanel');

    const cardGrid = document.createElement('div');
    cardGrid.className = 'tabs-program-cards';

    cards.forEach(({
      row, title, image, description,
    }) => {
      const card = document.createElement('div');
      card.className = 'tabs-program-card';
      moveInstrumentation(row, card);

      if (image) {
        const imgWrap = document.createElement('div');
        imgWrap.className = 'tabs-program-card-image';
        imgWrap.append(...image.childNodes);
        card.append(imgWrap);
      }

      const body = document.createElement('div');
      body.className = 'tabs-program-card-body';

      if (title) {
        const titleEl = document.createElement('h3');
        titleEl.className = 'tabs-program-card-title';
        titleEl.append(...title.childNodes);
        body.append(titleEl);
      }

      if (description) {
        const descEl = document.createElement('div');
        descEl.className = 'tabs-program-card-description';
        descEl.append(...description.childNodes);
        body.append(descEl);
      }

      card.append(body);
      cardGrid.append(card);
    });

    tabpanel.append(cardGrid);
    block.append(tabpanel);

    tabIndex += 1;
  });

  block.prepend(tablist);
}
