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

  // tools/importer/import-impact-program.js
  var import_impact_program_exports = {};
  __export(import_impact_program_exports, {
    default: () => import_impact_program_default
  });

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

  // tools/importer/import-impact-program.js
  var PAGE_TEMPLATE = {
    name: "impact-program",
    description: "Impact program page template showcasing a specific World Bank Academy thematic program with details, outcomes, and related resources",
    urls: [
      "https://academy.worldbank.org/en/our-programs/by-theme/jobs-for-the-poor"
    ],
    blocks: [],
    sections: [
      {
        id: "section-1",
        name: "Page Title and Banner",
        selector: ".par.parsys > .supergrid",
        style: null,
        blocks: [],
        defaultContent: [
          ".lp__heading_v1 h1",
          ".redesign_image .lp__image_components img"
        ]
      },
      {
        id: "section-2",
        name: "Body Content",
        selector: ".redesign_static_content article.lp__body_content",
        style: null,
        blocks: [],
        defaultContent: [
          "article.lp__body_content"
        ]
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  var import_impact_program_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
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
          blocks: []
        }
      }];
    }
  };
  return __toCommonJS(import_impact_program_exports);
})();
