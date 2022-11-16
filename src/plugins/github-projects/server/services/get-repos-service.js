"use strict";
const { request } = require("@octokit/request");
const axios = require("axios");

module.exports = ({ strapi }) => ({
  getRelatedProjectId: async (repo) => {
    const { id } = repo;
    const matchingProjects = await strapi.entityService.findMany(
      "plugin::github-projects.project",
      {
        filters: {
          repositoryId: id,
        },
      }
    );

    if (matchingProjects.length == 1) return matchingProjects[0].id;
    return null;
  },

  getPublicRepos: async () => {
    const result = await request("GET /user/repos", {
      headers: {
        authorization: `token ${process.env.GITHUB_TOKEN}`,
      },
      type: "public",
    });

    return Promise.all(
      result.data.map(async (item) => {
        const { id, name, description, html_url, owner, default_branch } = item;
        const readmeFileUrl = `https://raw.githubusercontent.com/${owner.login}/${name}/${default_branch}/README.md`;
        let readmeRawContent;
        try {
          readmeRawContent = (await axios.get(readmeFileUrl)).data;
        } catch (error) {}

        const repo = {
          id,
          name,
          shortDescription: description,
          url: html_url,
          longDescription: readmeRawContent,
        };

        const relatedProject = await strapi
          .plugin("github-projects")
          .service("getReposService")
          .getRelatedProjectId(repo);

        return {
          ...repo,
          projectId: relatedProject,
        };
      })
    );
  },
});
