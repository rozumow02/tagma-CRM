import createDOMPurify from "dompurify";

const purifier = createDOMPurify(window);

// Preserve the editor's formatting without allowing embedded content or URLs.
purifier.addHook("uponSanitizeAttribute", (_node, attribute) => {
  if (attribute.attrName === "style") {
    const parsed = document.createElement("span").style;
    parsed.cssText = attribute.attrValue;
    const safe = document.createElement("span").style;
    for (const property of ["color", "background-color", "text-align"]) {
      const value = parsed.getPropertyValue(property);
      if (value && !/url\s*\(|var\s*\(|expression\s*\(|@import/i.test(value)) {
        safe.setProperty(property, value);
      }
    }
    attribute.attrValue = safe.cssText;
    attribute.keepAttr = Boolean(safe.cssText);
  }
  if (attribute.attrName === "class") {
    attribute.attrValue = attribute.attrValue
      .split(/\s+/)
      .filter((name) =>
        /^ql-(align-(center|right|justify)|indent-[1-8]|direction-rtl|size-(small|large|huge)|font-(serif|monospace)|ui)$/.test(
          name,
        ),
      )
      .join(" ");
    attribute.keepAttr = Boolean(attribute.attrValue);
  }
  if (attribute.attrName === "data-list") {
    attribute.keepAttr = ["ordered", "bullet"].includes(attribute.attrValue);
  }
});

export function sanitizeRichHtml(html: string | null | undefined): string {
  return purifier.sanitize(html ?? "", {
    ALLOWED_TAGS: [
      "p",
      "br",
      "strong",
      "b",
      "em",
      "i",
      "u",
      "s",
      "strike",
      "ol",
      "ul",
      "li",
      "h1",
      "h2",
      "span",
    ],
    ALLOWED_ATTR: ["class", "style", "data-list"],
    ALLOW_DATA_ATTR: false,
    ALLOW_ARIA_ATTR: false,
  });
}
