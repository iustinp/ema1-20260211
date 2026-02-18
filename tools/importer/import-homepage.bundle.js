var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-video.js
  function parse(element, { document }) {
    const videoSource = element.querySelector("video.bg-video source, video source");
    const videoSrc = videoSource ? videoSource.getAttribute("src") : "";
    const imageCell = [];
    if (videoSrc) {
      const frag = document.createDocumentFragment();
      frag.appendChild(document.createComment(" field:image "));
      const img = document.createElement("img");
      img.setAttribute("src", videoSrc);
      img.setAttribute("alt", "Hero video background");
      frag.appendChild(img);
      imageCell.push(frag);
    }
    const heading = element.querySelector(".banner-content h1, h1");
    const description = element.querySelector(".banner-content p, .banner-content .hero-description");
    const textCell = [];
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(" field:text "));
    if (heading) textFrag.appendChild(heading);
    if (description) textFrag.appendChild(description);
    textCell.push(textFrag);
    const cells = [];
    if (imageCell.length) cells.push(imageCell);
    cells.push(textCell);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-video", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-overlay.js
  function parse2(element, { document }) {
    const cards = element.querySelectorAll(".lp-sticky-card");
    const cells = [];
    cards.forEach((card) => {
      const img = card.querySelector(".lp-sticky-card-img img, .lp-sticky-card-img picture");
      const heading = card.querySelector(".lp-sticky-card-content h3");
      const description = card.querySelector(".lp-sticky-card-content p");
      const label = "card";
      const imageFrag = document.createDocumentFragment();
      imageFrag.appendChild(document.createComment(" field:image "));
      if (img) imageFrag.appendChild(img);
      const textFrag = document.createDocumentFragment();
      textFrag.appendChild(document.createComment(" field:text "));
      if (heading) textFrag.appendChild(heading);
      if (description) textFrag.appendChild(description);
      cells.push([label, imageFrag, textFrag]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-overlay", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-program.js
  function parse3(element, { document }) {
    const cards = element.querySelectorAll(".lp-aca-card");
    const cells = [];
    cards.forEach((card) => {
      const img = card.querySelector(".lp-aca-card-img img, .lp-aca-card-img picture");
      const tag = card.querySelector(".lp-aca-card-tag");
      const titleLink = card.querySelector(".lp-aca-card-title a, h3.lp-aca-card-title a");
      const description = card.querySelector(".lp-aca-card-description");
      const ctaLinks = card.querySelectorAll(".lp-aca-card-link");
      const label = "card";
      const imageFrag = document.createDocumentFragment();
      imageFrag.appendChild(document.createComment(" field:image "));
      if (img) imageFrag.appendChild(img);
      const textFrag = document.createDocumentFragment();
      textFrag.appendChild(document.createComment(" field:text "));
      if (tag) {
        const tagP = document.createElement("p");
        tagP.textContent = tag.textContent.trim();
        textFrag.appendChild(tagP);
      }
      if (titleLink) {
        const h3 = document.createElement("h3");
        h3.appendChild(titleLink);
        textFrag.appendChild(h3);
      }
      if (description) {
        const descP = document.createElement("p");
        descP.textContent = description.textContent.trim();
        textFrag.appendChild(descP);
      }
      ctaLinks.forEach((link) => {
        const p = document.createElement("p");
        p.appendChild(link);
        textFrag.appendChild(p);
      });
      cells.push([label, imageFrag, textFrag]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-program", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-program.js
  function parse4(element, { document }) {
    const slides = element.querySelectorAll(".swiper-slide");
    const cells = [];
    slides.forEach((slide) => {
      const img = slide.querySelector(".lp-aca-card-img img, .lp-aca-card-img picture");
      const tag = slide.querySelector(".lp-aca-card-tag");
      const titleEl = slide.querySelector(".lp-aca-card-title a, h3.lp-aca-card-title a");
      const description = slide.querySelector(".lp-aca-card-description");
      const label = "carousel-program-item";
      const imageFrag = document.createDocumentFragment();
      imageFrag.appendChild(document.createComment(" field:media_image "));
      if (img) imageFrag.appendChild(img);
      const textFrag = document.createDocumentFragment();
      textFrag.appendChild(document.createComment(" field:content_text "));
      if (tag) {
        const tagP = document.createElement("p");
        tagP.textContent = tag.textContent.trim();
        textFrag.appendChild(tagP);
      }
      if (titleEl) {
        const h3 = document.createElement("h3");
        h3.appendChild(titleEl);
        textFrag.appendChild(h3);
      }
      if (description) {
        const descP = document.createElement("p");
        descP.textContent = description.textContent.trim();
        textFrag.appendChild(descP);
      }
      cells.push([label, imageFrag, textFrag]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-program", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/form-finder.js
  function parse5(element, { document }) {
    const heading = element.querySelector("h2");
    if (heading) {
      element.before(heading);
    }
    const refFrag = document.createDocumentFragment();
    refFrag.appendChild(document.createComment(" field:reference "));
    const actionFrag = document.createDocumentFragment();
    actionFrag.appendChild(document.createComment(" field:action "));
    const actionP = document.createElement("p");
    actionP.textContent = "https://academy.worldbank.org/en/our-programs";
    actionFrag.appendChild(actionP);
    const cells = [
      [refFrag, actionFrag]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "form-finder", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-program.js
  function parse6(element, { document }) {
    const tabLinks = element.querySelectorAll(".lp__tablist li a");
    const tabPanels = element.querySelectorAll('.lp__tabcontent > div.tab_wbr, .lp__tabcontent > div[id^="tab-"]');
    const cells = [];
    tabLinks.forEach((tabLink, index) => {
      const tabLabel = tabLink.textContent.trim();
      const panel = tabPanels[index];
      if (!panel) return;
      const cards = panel.querySelectorAll(".lp-aca-card");
      cards.forEach((card) => {
        const tabFrag = document.createDocumentFragment();
        const tabP = document.createElement("p");
        tabP.textContent = tabLabel;
        tabFrag.appendChild(tabP);
        const titleFrag = document.createDocumentFragment();
        const cardTitleEl = card.querySelector(".lp-aca-card-title a, h3.lp-aca-card-title a");
        if (cardTitleEl) {
          const titleP = document.createElement("p");
          const link = document.createElement("a");
          link.href = cardTitleEl.href || cardTitleEl.getAttribute("href") || "";
          link.textContent = cardTitleEl.textContent.trim();
          titleP.appendChild(link);
          titleFrag.appendChild(titleP);
        }
        const imageFrag = document.createDocumentFragment();
        const cardImg = card.querySelector(".lp-aca-card-img img");
        if (cardImg) {
          imageFrag.appendChild(cardImg.cloneNode(true));
        }
        const descFrag = document.createDocumentFragment();
        const cardDesc = card.querySelector(".lp-aca-card-description");
        if (cardDesc) {
          const descP = document.createElement("p");
          descP.textContent = cardDesc.textContent.trim();
          descFrag.appendChild(descP);
        }
        cells.push([tabFrag, titleFrag, imageFrag, descFrag]);
      });
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "tabs-program", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/worldbank-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [".color-wrapper"]);
      WebImporter.DOMUtils.remove(element, [".scroll-indicator"]);
      WebImporter.DOMUtils.remove(element, [".tui_video_btn"]);
      WebImporter.DOMUtils.remove(element, [".swiper-button-next", ".swiper-button-prev", ".swiper-pagination"]);
      WebImporter.DOMUtils.remove(element, [".lp__scroller"]);
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, ["header"]);
      WebImporter.DOMUtils.remove(element, ["footer"]);
      WebImporter.DOMUtils.remove(element, ["nav#menu.mobile-menu"]);
      WebImporter.DOMUtils.remove(element, [".lp__breadcrumb"]);
      WebImporter.DOMUtils.remove(element, ["iframe"]);
      WebImporter.DOMUtils.remove(element, ["noscript", "link"]);
      const clearfixes = element.querySelectorAll(".clearfix");
      clearfixes.forEach((el) => {
        if (!el.textContent.trim()) el.remove();
      });
      WebImporter.DOMUtils.remove(element, [".sr-only"]);
    }
  }

  // tools/importer/transformers/worldbank-sections.js
  var H2 = { after: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName !== H2.after) return;
    const { template } = payload || {};
    if (!template || !template.sections || template.sections.length < 2) return;
    const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document: element };
    const doc = document || element.ownerDocument;
    const sections = [...template.sections].reverse();
    sections.forEach((section, reverseIndex) => {
      const originalIndex = template.sections.length - 1 - reverseIndex;
      if (originalIndex === 0) return;
      const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
      let sectionEl = null;
      for (const sel of selectors) {
        sectionEl = element.querySelector(sel);
        if (sectionEl) break;
      }
      if (!sectionEl) return;
      const hr = doc.createElement("hr");
      sectionEl.before(hr);
      if (section.style) {
        const metaBlock = WebImporter.Blocks.createBlock(doc, {
          name: "Section Metadata",
          cells: [["style", section.style]]
        });
        sectionEl.after(metaBlock);
      }
    });
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-video": parse,
    "cards-overlay": parse2,
    "cards-program": parse3,
    "carousel-program": parse4,
    "form-finder": parse5,
    "tabs-program": parse6
  };
  var transformers = [
    transform,
    transform2
  ];
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "World Bank Academy homepage with hero, featured courses, programs, and promotional sections",
    urls: [
      "https://academy.worldbank.org/en/home"
    ],
    blocks: [
      {
        name: "hero-video",
        instances: ["section.video-banner"]
      },
      {
        name: "cards-overlay",
        instances: [".lp-sticky-card-grid"]
      },
      {
        name: "cards-program",
        instances: [".academySliderComp .sticky-column"]
      },
      {
        name: "tabs-program",
        instances: [".lp__tab"]
      },
      {
        name: "carousel-program",
        instances: [".academy-carousel"]
      },
      {
        name: "form-finder",
        instances: ["section.lp-find-program"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero Banner",
        selector: "section.video-banner",
        style: null,
        blocks: ["hero-video"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Value Proposition Cards",
        selector: "section.sticky-section#one-center",
        style: null,
        blocks: ["cards-overlay"],
        defaultContent: [".sticky-content h2", ".sticky-content a.btn"]
      },
      {
        id: "section-3",
        name: "Program Types",
        selector: ".academySliderComp",
        style: null,
        blocks: ["cards-program"],
        defaultContent: [".lp-aca-heading h2"]
      },
      {
        id: "section-4",
        name: "Impact Programs Carousel",
        selector: ".tui_full_row_swiper",
        style: null,
        blocks: ["carousel-program"],
        defaultContent: [".lp-aca-heading h2", ".lp-aca-heading p"]
      },
      {
        id: "section-5",
        name: "Find Your Program",
        selector: "section.lp-find-program",
        style: null,
        blocks: ["form-finder"],
        defaultContent: []
      },
      {
        id: "section-6",
        name: "Programs for All",
        selector: [".tui_full_row_swiper:nth-of-type(2)", ".supergrid:has(.lp__tab)"],
        style: null,
        blocks: ["tabs-program"],
        defaultContent: [".lp-aca-heading h2", ".lp-aca-heading .lp-body-text-medium"]
      }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = {
      ...payload,
      template: PAGE_TEMPLATE
    };
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
