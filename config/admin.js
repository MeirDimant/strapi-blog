module.exports = ({ env }) => ({
  apiToken: {
    salt: env("API_TOKEN_SALT"),
  },

  auth: {
    secret: env("ADMIN_JWT_SECRET", "b5a46d9559da88d7a82948bc37fb58d8"),
  },

  url: "/dashboard",
});
