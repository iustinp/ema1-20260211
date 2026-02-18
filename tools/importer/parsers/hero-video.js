/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-video variant.
 * Base block: hero. Source: https://academy.worldbank.org/en/home
 * Selector: section.video-banner
 *
 * Block library structure (hero, 1 column, max 3 rows):
 *   Row 1: block name
 *   Row 2: background image (optional)
 *   Row 3: text content (heading, subheading, CTA)
 *
 * xwalk model fields (hero-video):
 *   - image (reference) → Row 1
 *   - imageAlt (collapsed into image, skip)
 *   - text (richtext) → Row 2
 *   Skip: classes
 *
 * Source DOM (section.video-banner):
 *   - video.bg-video > source[src] → video poster/thumbnail for image
 *   - .banner-content h1 → heading
 *   - .banner-content p → description
 */
export default function parse(element, { document }) {
  // Extract video source for image field (use first frame / poster)
  const videoSource = element.querySelector('video.bg-video source, video source');
  const videoSrc = videoSource ? videoSource.getAttribute('src') : '';

  // Create an image element to represent the video background
  const imageCell = [];
  if (videoSrc) {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(' field:image '));
    const img = document.createElement('img');
    img.setAttribute('src', videoSrc);
    img.setAttribute('alt', 'Hero video background');
    frag.appendChild(img);
    imageCell.push(frag);
  }

  // Extract text content (heading + description)
  const heading = element.querySelector('.banner-content h1, h1');
  const description = element.querySelector('.banner-content p, .banner-content .hero-description');

  const textCell = [];
  const textFrag = document.createDocumentFragment();
  textFrag.appendChild(document.createComment(' field:text '));
  if (heading) textFrag.appendChild(heading);
  if (description) textFrag.appendChild(description);
  textCell.push(textFrag);

  const cells = [];
  if (imageCell.length) cells.push(imageCell);
  cells.push(textCell);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-video', cells });
  element.replaceWith(block);
}
