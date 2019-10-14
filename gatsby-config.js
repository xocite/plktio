module.exports = {
  siteMetadata: {
    title: `Antony Jepson`,
    description: `The best way to see and get involved in what Antony Jepson is doing.`,
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
        name: `posts`,
        path: `${__dirname}/src/posts`,
      }
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          { 
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: `650`,
              linkImagesToOriginal: true,
              showCaptions: true,
              wrapperStyle: "border-style: solid;",
            }
          },
          {
            resolve: `gatsby-remark-prismjs`,
          }
        ]
      }
    },
    {
      resolve: `gatsby-remark-images`,
      options: {
        maxWidth: `800`,
        linkImagesToOriginal: true,
        showCaptions: false,
      }
    },
    `gatsby-transformer-yaml`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `data`,
        path: `${__dirname}/src/data`,
      }
    }
  ],
}
