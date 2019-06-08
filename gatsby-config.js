module.exports = {
  siteMetadata: {
    title: `plkt.io`,
    description: `The best way to see and get involved in what I'm doing.`,
    author: `@plktio`,
  },
  pathPrefix: `/blog`,
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: "posts",
        path: `${__dirname}/src/posts`,
      }
    },
    `gatsby-transformer-remark`,
  ],
}
