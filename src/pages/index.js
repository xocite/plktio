import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import containerStyles from "../components/index.module.css"

import { graphql, Link } from "gatsby"

export default ({ data }) => {
  return (
    <Layout>
      <SEO title="Home" />
      <h3>Hi <span role="img" aria-label="Waving hand">👋</span>  I’m Antony, a technical product manager.  I help you build quality products.</h3>
      <p>Read my most recent posts and commentary below.</p>
      {data.allMarkdownRemark.edges.map(({ node }) => (
        <dl key={node.id}>
          <dt>
            {node.frontmatter.date}
            <br />
            {
              (node.frontmatter.commentary) ?
              <></>
              : <Link to={node.frontmatter.path}><strong>{node.frontmatter.title}</strong></Link>

            }
          </dt>
          <dd>
            {
              (node.frontmatter.commentary) ?
              <div
                className="commentary-content"
                dangerouslySetInnerHTML={{ __html: (node.html) }}
              />
              : (node.frontmatter.attract)
            }
          </dd>
        </dl>
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
            attract
            commentary
          }
          html
        }
      }
    }
  }
`