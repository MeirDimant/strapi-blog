"use strict";

const RBAC_ACTIONS = [
  {
    section: "plugins",
    displayName: "View and access the plugin",
    uid: "use",
    pluginName: "github-projects",
  },
  {
    section: "plugins",
    subCategory: "repository",
    displayName: "Read repositories",
    uid: "repos.read",
    pluginName: "github-projects",
  },
  {
    section: "plugins",
    subCategory: "projects",
    displayName: "Read projects",
    uid: "projects.read",
    pluginName: "github-projects",
  },
  {
    section: "plugins",
    subCategory: "projects",
    displayName: "Create projects",
    uid: "projects.create",
    pluginName: "github-projects",
  },
  {
    section: "plugins",
    subCategory: "projects",
    displayName: "Delete projects",
    uid: "projects.delete",
    pluginName: "github-projects",
  },
];

module.exports = async ({ strapi }) => {
  await strapi.admin.services.permission.actionProvider.registerMany(
    RBAC_ACTIONS
  );
};
