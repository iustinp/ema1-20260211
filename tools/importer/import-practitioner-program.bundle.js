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

  // tools/importer/import-practitioner-program.js
  var import_practitioner_program_exports = {};
  __export(import_practitioner_program_exports, {
    default: () => import_practitioner_program_default
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
      element.querySelectorAll(".eventdetail__image").forEach((container) => {
        const doc = element.ownerDocument || document;
        const source = container.querySelector("source[srcset], source[data-srcset]");
        if (source) {
          const srcUrl = source.getAttribute("srcset") || source.getAttribute("data-srcset");
          if (srcUrl) {
            const url = srcUrl.split(",")[0].trim().split(/\s+/)[0];
            const img = doc.createElement("img");
            img.setAttribute("src", url);
            img.setAttribute("alt", "");
            container.innerHTML = "";
            container.appendChild(img);
          }
        }
      });
      element.querySelectorAll("img").forEach((img) => {
        if (!img.getAttribute("src")) {
          const url = img.getAttribute("srcset") || img.getAttribute("data-srcset");
          if (url) {
            img.setAttribute("src", url.split(",")[0].trim().split(/\s+/)[0]);
          }
        }
      });
      element.querySelectorAll(".eventdetail__action-container").forEach((container) => {
        const doc = element.ownerDocument || document;
        const dropdownLinks = container.querySelectorAll(".dropdown-menu > li > a");
        if (dropdownLinks.length > 0) {
          if (dropdownLinks.length === 1) {
            const a = doc.createElement("a");
            a.href = dropdownLinks[0].href;
            a.textContent = "Enroll Now";
            container.replaceWith(a);
          } else {
            const wrapper = doc.createElement("div");
            const label = doc.createElement("p");
            label.textContent = "Enroll now";
            wrapper.appendChild(label);
            const ul = doc.createElement("ul");
            dropdownLinks.forEach((link) => {
              const li = doc.createElement("li");
              const a = doc.createElement("a");
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
    const { document: document2 } = element.ownerDocument ? { document: element.ownerDocument } : { document: element };
    const doc = document2 || element.ownerDocument;
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

  // tools/importer/import-practitioner-program.js
  var PAGE_TEMPLATE = {
    name: "practitioner-program",
    description: "Practitioner program course page with hero banner, course metadata grid, and overview content",
    urls: [
      "https://academy.worldbank.org/en/people/education/literacy-policy"
    ],
    blocks: [],
    sections: [
      {
        id: "section-1",
        name: "Hero and Course Details",
        selector: ".par.parsys > .supergrid:first-child",
        style: null,
        blocks: [],
        defaultContent: [
          ".eventdetail__title",
          ".eventdetail__description",
          ".eventdetail_enroll_btn",
          ".eventdetail__image img",
          ".eventdetail_banner_bottom_content"
        ]
      },
      {
        id: "section-2",
        name: "Overview",
        selector: ".par.parsys > .supergrid:nth-child(2)",
        style: null,
        blocks: [],
        defaultContent: [
          ".lp__heading_v1 h2",
          ".redesign_static_content"
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
  var import_practitioner_program_default = {
    transform: (payload) => {
      const { document: document2, url, params } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: []
        }
      }];
    }
  };
  return __toCommonJS(import_practitioner_program_exports);
})();
