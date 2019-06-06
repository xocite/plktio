import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { graphql } from "gatsby"

export default ({ data }) => {
  return (
    <Layout>
      <SEO title="Home" />
      <h3>Hi <span role="img" aria-label="Waving hand">👋</span>  I’m Antony, a technical product manager.  I can help you build quality products.</h3>
      <p>I've written {data.allMarkdownRemark.totalCount} posts in 2019.</p>
      {data.allMarkdownRemark.edges.map(({ node }) => (
        <div key={node.id}>
          <strong>{node.frontmatter.title}</strong> on {node.frontmatter.date}
        </div>
      )
      )}
    </Layout>
  )
}

export const query = graphql`
  query {
    allMarkdownRemark {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
            date(formatString: "DD MMMM YYYY")
          }
          }
        }
      }
    }
  `