import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

import { graphql, Link } from "gatsby"

export default ({ data }) => {
  return (
    <Layout>
      <SEO title="Home" />
      <h3>Hi <span role="img" aria-label="Waving hand">👋</span>  I’m Antony, a technical product manager.  I help you build quality products.</h3>
      <p>I've written {data.allMarkdownRemark.totalCount} posts since July 2019.</p>
      {data.allMarkdownRemark.edges.map(({ node }) => (
        <div key={node.id}>
          <Link to={node.frontmatter.path}><strong>{node.frontmatter.title}</strong></Link> on {node.frontmatter.date}
        </div>
      )
      )}
      <br />
      80 older posts also available on my <a href="https://antonyjepson.co.uk">former home</a>.
    </Layout>
  )
}

export const query = graphql`
  query {
    allMarkdownRemark(sort: {fields: frontmatter___date, order: DESC}) {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
            path
            date(formatString: "DD MMMM YYYY")
          }
        }
      }
    }
  }
`