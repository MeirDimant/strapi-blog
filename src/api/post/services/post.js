"use strict";

const likePost = require("../routes/like-post");

/**
 * post service.
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::post.post", ({ strapi }) => ({
  // Method 1: Creating an entirely new custom service
  async findPublic(query) {
    const newQuery = {
      ...query,
      filters: {
        ...query.filters,
        premium: false,
      },
    };
    const publicPosts = await strapi.entityService.findMany(
      "api::post.post",
      this.getFetchParams(newQuery)
    );

    return publicPosts;
  },

  async findOneIfPublic(args) {
    const { id, query } = args;
    const post = await strapi.entityService.findOne(
      "api::post.post",
      id,
      this.getFetchParams(query)
    );

    return post.premium ? null : post;
  },

  async likePost(args) {
    const { postId, userId, query } = args;

    const likedPost = await strapi.entityService.findOne(
      "api::post.post",
      postId,
      {
        populate: { likedBy: true },
      }
    );

    

    const updatedPost = await strapi.entityService.update(
      "api::post.post",
      postId,
      {
        data: {
          likedBy: [...likedPost.likedBy, userId],
        },
        ...query,
      }
    );
    return updatedPost;
  },
}));
