/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-program variant.
 * Base block: carousel. Source: https://academy.worldbank.org/en/home
 * Selector: .academy-carousel
 *
 * Block library structure (carousel, container, 3 columns):
 *   Row 1: block name
 *   Each subsequent row: carousel-slide (label) | image | text (title + description)
 *
 * xwalk model fields (carousel-program-item):
 *   - media_image (reference) → column 2 (grouped under 'media')
 *   - media_imageAlt (collapsed into media_image, skip)
 *   - content_text (richtext) → column 3 (grouped under 'content')
 *   Skip: classes
 *
 * Source DOM (.academy-carousel):
 *   - .swiper-wrapper > li.swiper-slide → each slide
 *     - .lp-aca-card-img img → slide image
 *     - .lp-aca-card-tag → tag (e.g., "Impact Programs")
 *     - .lp-aca-card-title a → title with link
 *     - .lp-aca-card-description → description
 */
export default function parse(element, { document }) {
  const slides = element.querySelectorAll('.swiper-slide');
  const cells = [];

  slides.forEach((slide) => {
    const img = slide.querySelector('.lp-aca-card-img img, .lp-aca-card-img picture');
    const tag = slide.querySelector('.lp-aca-card-tag');
    const titleEl = slide.querySelector('.lp-aca-card-title a, h3.lp-aca-card-title a');
    const description = slide.querySelector('.lp-aca-card-description');

    // Column 1: item label (must match definition id in component-definition.json)
    const label = 'carousel-program-item';

    // Column 2: image with field hint (media group)
    const imageFrag = document.createDocumentFragment();
    imageFrag.appendChild(document.createComment(' field:media_image '));
    if (img) imageFrag.appendChild(img);

    // Column 3: text content with field hint (content group)
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:content_text '));

    if (tag) {
      const tagP = document.createElement('p');
      tagP.textContent = tag.textContent.trim();
      textFrag.appendChild(tagP);
    }

    if (titleEl) {
      const h3 = document.createElement('h3');
      h3.appendChild(titleEl);
      textFrag.appendChild(h3);
    }

    if (description) {
      const descP = document.createElement('p');
      descP.textContent = description.textContent.trim();
      textFrag.appendChild(descP);
    }

    cells.push([label, imageFrag, textFrag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-program', cells });
  element.replaceWith(block);
}
