const { shouldHideInProduction } = require("../../lib/post-visibility");

module.exports = {
  eleventyComputed: {
    layout: (data) => data.layout || "blog-post.njk",
    eleventyExcludeFromCollections: (data) => {
      if (shouldHideInProduction(data)) {
        return true;
      }

      return data.eleventyExcludeFromCollections;
    },
    permalink: (data) => {
      if (shouldHideInProduction(data)) {
        return false;
      }

      const rawSlug = data.slug || data.page?.fileSlug || "";
      const normalizedSlug = String(rawSlug)
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9-]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

      return `/blog/${normalizedSlug || data.page.fileSlug}/`;
    },
  },
};
