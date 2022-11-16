module.exports = [
  {
    method: "GET",
    path: "/repos",
    handler: "getReposController.index",
    config: {
      policies: [
        "admin::isAuthenticatedAdmin",
        {
          name: "admin::hasPermissions",
          config: {
            actions: [
              "plugin::github-projects.repos.read",
              "plugin::github-projects.projects.read",
            ],
          },
        },
      ],
    },
  },
  {
    method: "POST",
    path: "/project",
    handler: "projectsController.create",
    config: {
      policies: [
        "admin::isAuthenticatedAdmin",
        {
          name: "admin::hasPermissions",
          config: {
            actions: ["plugin::github-projects.projects.create"],
          },
        },
      ],
    },
  },
  {
    method: "DELETE",
    path: "/project/:id",
    handler: "projectsController.delete",
    config: {
      policies: [
        "admin::isAuthenticatedAdmin",
        {
          name: "admin::hasPermissions",
          config: {
            actions: ["plugin::github-projects.projects.delete"],
          },
        },
      ],
    },
  },
  {
    method: "POST",
    path: "/projects",
    handler: "projectsController.createAll",
    config: {
      policies: [
        "admin::isAuthenticatedAdmin",
        {
          name: "admin::hasPermissions",
          config: {
            actions: ["plugin::github-projects.projects.create"],
          },
        },
      ],
    },
  },
  {
    method: "DELETE",
    path: "/projects",
    handler: "projectsController.deleteAll",
    config: {
      policies: [
        "admin::isAuthenticatedAdmin",
        {
          name: "admin::hasPermissions",
          config: {
            actions: ["plugin::github-projects.projects.delete"],
          },
        },
      ],
    },
  },
  {
    method: "GET",
    path: "/projects",
    handler: "projectsController.find",
    config: {
      auth: false,
    },
  },
  {
    method: "GET",
    path: "/projects/:id",
    handler: "projectsController.findOne",
    config: {
      auth: false,
    },
  },
];
