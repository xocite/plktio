import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

export default function Template({
  data, // injected by GraphQL query 
}) {
  const { markdownRemark } = data 
  const { frontmatter, html } = markdownRemark
  var updated = ""
  if (!frontmatter.updated) {
    updated = ""
  } else {
    updated = "Updated » " + frontmatter.updated + " |"
  }
  return (
    <Layout>
      <SEO title={frontmatter.title} />
    <div className="blog-post-container">
      <div className="blog-post">
        <h1>{frontmatter.title}</h1>
        {updated} Published &raquo; {frontmatter.date}
        <br /><br />
        <div
          className="blog-post-content"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
    </Layout>
  )
}

// https://graphql.org/graphql-js/type/#graphqlinputobjecttype
export const pageQuery = graphql`
  query($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        date(formatString: "YYYY-MM-DD")
        updated
        path
        title
      }
    }
  }
`