import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row, i) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);

    // Alternate size classes: lg, md, md, lg
    const sizes = ['card-lg', 'card-md', 'card-md', 'card-lg'];
    li.classList.add(sizes[i] || 'card-md');

    const cols = [...row.children];
    // col 0: item type label ("card") — skip
    // col 1: image
    // col 2: text (h3 + p)
    const imageCol = cols[1];
    const textCol = cols[2];

    if (imageCol) {
      imageCol.className = 'cards-overlay-card-image';
      li.append(imageCol);
    }

    if (textCol) {
      textCol.className = 'cards-overlay-card-body';
      li.append(textCol);
    }

    ul.append(li);
  });

  ul.querySelectorAll('img').forEach((img) => {
    // Only optimize local images; external URLs break the rewrite
    if (img.src && new URL(img.src, window.location.origin).origin === window.location.origin) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      img.closest('picture, p')?.replaceWith(optimizedPic);
    }
  });

  block.textContent = '';
  block.append(ul);

  // Make the preceding default-content-wrapper sticky
  const section = block.closest('.section');
  if (section) {
    section.classList.add('cards-overlay-sticky-section');
  }
}
