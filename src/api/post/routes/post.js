"use strict";

/**
 * post router.
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter("api::post.post", {
  config: {
    update: {
      policies: [{ name: "check-role", config: { userRole: "Author" } }],
    },
  },
});
