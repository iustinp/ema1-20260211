var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
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

  // tools/importer/import-how-we-work.js
  var import_how_we_work_exports = {};
  __export(import_how_we_work_exports, {
    default: () => import_how_we_work_default
  });

  // tools/importer/parsers/columns.js
  function parse(element, { document }) {
    const columns = element.querySelectorAll(".lp__listnav_icon_cta");
    if (!columns.length) return;
    const row = [];
    columns.forEach((col) => {
      const img = col.querySelector(".lp__listnav_icon_cta_top img");
      const titleSpan = col.querySelector(".lp__listnav_icon_cta_title span:first-child");
      const descP = col.querySelector(".lp__listnav_icon_cta_bottom p");
      const frag = document.createDocumentFragment();
      if (img) {
        const p = document.createElement("p");
        p.appendChild(img);
        frag.appendChild(p);
      }
      if (titleSpan) {
        const h3 = document.createElement("h3");
        h3.textContent = titleSpan.textContent.trim();
        frag.appendChild(h3);
      }
      if (descP) {
        frag.appendChild(descP);
      }
      row.push(frag);
    });
    const cells = [row];
    const block = WebImporter.Blocks.createBlock(document, { name: "Columns", cells });
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
      WebImporter.DOMUtils.remove(element, [".academyHeader"]);
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
      WebImporter.DOMUtils.remove(element, ["#cookieconsentpopup"]);
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

  // tools/importer/import-how-we-work.js
  var parsers = {
    "columns": parse
  };
  var transformers = [
    transform,
    transform2
  ];
  var PAGE_TEMPLATE = {
    name: "how-we-work",
    description: "How We Work informational page describing the World Bank Academy approach and methodology",
    urls: [
      "https://academy.worldbank.org/en/how-we-work"
    ],
    blocks: [
      {
        name: "columns",
        instances: [".academy_list_navigation"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Page Title and Banner",
        selector: ".par.parsys > .supergrid:first-child",
        style: null,
        blocks: [],
        defaultContent: [".lp__heading_v1 h1", ".redesign_image .lp__image_components img"]
      },
      {
        id: "section-2",
        name: "Feature Columns",
        selector: ".academy_list_navigation",
        style: null,
        blocks: ["columns"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Body Content",
        selector: ".redesign_static_content article.lp__body_content",
        style: null,
        blocks: [],
        defaultContent: ["article.lp__body_content"]
      }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
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
  var import_how_we_work_default = {
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
  return __toCommonJS(import_how_we_work_exports);
})();
