// eslint-disable-next-line no-undef
module.exports = {
  siteMetadata: {
    description: "Personal page of John Doe",
    locale: "fr",
    title: "Adrien Louis-Rossignol",
    showThemeLogo: false,
  },
  plugins: [
    {
      resolve: "@wkocjan/gatsby-theme-intro",
      options: {
        theme: {
          back: "#161b23",
          front: "#9dadc5",
          lead: "#91e12a",
          "lead-text": "#161b23",
          line: "#28303c",
          "skill-1": "#25a55f",
          "skill-2": "#9bdf46",
          "skill-3": "#e9f679",
          "skill-4": "#0077b5",
          "skill-5": "#00adb5",
          "skill-6": "#854af0",
        },
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "markdown-pages",
        // eslint-disable-next-line no-undef
        path: `${__dirname}/content/markdown`,
      },
    },
    {
      resolve: "gatsby-transformer-remark",
      options: {
        plugins: [
          {
            resolve: "gatsby-remark-highlight-code",
          },
        ],
      },
    },
  ],
};
