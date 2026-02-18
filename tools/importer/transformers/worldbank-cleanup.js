/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: World Bank Academy cleanup.
 * Removes non-authorable content (header, footer, nav, breadcrumbs, overlays, iframes).
 * All selectors verified from captured DOM (migration-work/cleaned.html).
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Remove color animation overlay that may interfere with block parsing
    // Found: <div class="color-wrapper"> with gradient divs (line 133)
    WebImporter.DOMUtils.remove(element, ['.color-wrapper']);

    // Remove scroll indicator inside hero (line 153-156)
    WebImporter.DOMUtils.remove(element, ['.scroll-indicator']);

    // Remove video play/pause button (line 162-166)
    WebImporter.DOMUtils.remove(element, ['.tui_video_btn']);

    // Remove swiper navigation elements that interfere with carousel parsing
    WebImporter.DOMUtils.remove(element, ['.swiper-button-next', '.swiper-button-prev', '.swiper-pagination']);

    // Remove tab scroller navigation arrows (line 823-830)
    WebImporter.DOMUtils.remove(element, ['.lp__scroller']);

    // --- Practitioner-program hero fixes ---

    // Fix hero image: the <img> inside <picture> is stripped during HTML
    // serialization because it has no src attribute (lazy-loaded).
    // The <picture> with <source> elements survives though, so we create
    // a new <img> from the first <source> srcset URL.
    element.querySelectorAll('.eventdetail__image').forEach((container) => {
      const doc = element.ownerDocument || document;
      const source = container.querySelector('source[srcset], source[data-srcset]');
      if (source) {
        const srcUrl = source.getAttribute('srcset') || source.getAttribute('data-srcset');
        if (srcUrl) {
          const url = srcUrl.split(',')[0].trim().split(/\s+/)[0];
          const img = doc.createElement('img');
          img.setAttribute('src', url);
          img.setAttribute('alt', '');
          // Replace entire container contents with just the new <img>
          container.innerHTML = '';
          container.appendChild(img);
        }
      }
    });

    // Also fix any other lazy-loaded images missing src
    element.querySelectorAll('img').forEach((img) => {
      if (!img.getAttribute('src')) {
        const url = img.getAttribute('srcset') || img.getAttribute('data-srcset');
        if (url) {
          img.setAttribute('src', url.split(',')[0].trim().split(/\s+/)[0]);
        }
      }
    });

    // Multi-language enrollment: convert dropdown button + language links
    // into a simple link list that WebImporter can handle.
    element.querySelectorAll('.eventdetail__action-container').forEach((container) => {
      const doc = element.ownerDocument || document;
      const dropdownLinks = container.querySelectorAll('.dropdown-menu > li > a');
      if (dropdownLinks.length > 0) {
        if (dropdownLinks.length === 1) {
          // Single language: just make a plain CTA link
          const a = doc.createElement('a');
          a.href = dropdownLinks[0].href;
          a.textContent = 'Enroll Now';
          container.replaceWith(a);
        } else {
          // Multiple languages: CTA link for first + language links list
          const wrapper = doc.createElement('div');
          const label = doc.createElement('p');
          label.textContent = 'Enroll now';
          wrapper.appendChild(label);
          const ul = doc.createElement('ul');
          dropdownLinks.forEach((link) => {
            const li = doc.createElement('li');
            const a = doc.createElement('a');
            a.href = link.href;
            a.textContent = link.textContent.trim();
            li.appendChild(a);
            ul.appendChild(li);
          });
          wrapper.appendChild(ul);
          container.replaceWith(wrapper);
        }
      }
    });
  }

  if (hookName === H.after) {
    // Remove non-authorable site chrome
    // Header: <header> inside .academyHeader (line 6-62)
    WebImporter.DOMUtils.remove(element, ['header']);

    // Academy sub-header navigation (now handled by nav.plain.html)
    WebImporter.DOMUtils.remove(element, ['.academyHeader']);

    // Footer: <footer> inside .academyFooter (line 1503-1560)
    WebImporter.DOMUtils.remove(element, ['footer']);

    // Mobile menu nav (line 63-89)
    WebImporter.DOMUtils.remove(element, ['nav#menu.mobile-menu']);

    // Breadcrumbs (line 106-130)
    WebImporter.DOMUtils.remove(element, ['.lp__breadcrumb']);

    // Adobe iframe for tracking (line 102)
    WebImporter.DOMUtils.remove(element, ['iframe']);

    // Remove noscript, link, and script tags
    WebImporter.DOMUtils.remove(element, ['noscript', 'link']);

    // Remove empty clearfix divs
    const clearfixes = element.querySelectorAll('.clearfix');
    clearfixes.forEach((el) => {
      if (!el.textContent.trim()) el.remove();
    });

    // Remove sr-only spans (screen reader text not authored)
    WebImporter.DOMUtils.remove(element, ['.sr-only']);

    // Remove cookie consent popup
    WebImporter.DOMUtils.remove(element, ['#cookieconsentpopup']);
  }
}
