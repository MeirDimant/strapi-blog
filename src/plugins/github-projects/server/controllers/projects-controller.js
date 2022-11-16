"use strict";

module.exports = ({ strapi }) => ({
  create: async (ctx) => {
    const response = await strapi
      .plugin("github-projects")
      .service("projectService")
      .create(ctx.request.body, ctx.state.user.id);
    return response;
  },

  delete: async (ctx) => {
    const response = await strapi
      .plugin("github-projects")
      .service("projectService")
      .delete(ctx.params.id);
    return response;
  },

  createAll: async (ctx) => {
    const repos = ctx.request.body;
    const userId = ctx.state.user.id;
    const response = repos.map(
      async (repo) =>
        await strapi
          .plugin("github-projects")
          .service("projectService")
          .create(repo, userId)
    );
    return Promise.all(response);
  },

  deleteAll: async (ctx) => {
    const { projectIds } = ctx.query;
    const userId = ctx.state.user.id;
    const response = projectIds.map(
      async (projectId) =>
        await strapi
          .plugin("github-projects")
          .service("projectService")
          .delete(projectId, userId)
    );
    return Promise.all(response);
  },

  find: async (ctx) => {
    const response = await strapi
      .plugin("github-projects")
      .service("projectService")
      .find(ctx.query);
    return response;
  },

  findOne: async (ctx) => {
    const projectId = ctx.params.id;
    const response = await strapi
      .plugin("github-projects")
      .service("projectService")
      .findOne(projectId, ctx.query);
    return response;
  },
});
