import React, { useState } from 'react'

import { Link, StaticQuery, graphql } from 'gatsby'
import Layout from "../components/layout"

export default () => (
  <StaticQuery
  query={graphql`
    query BlankQuery {
      allBooksYaml {
        edges {
          node {
            title
            author
            subtitle
            amazon
            goodreads
          }
        }
      }
    }
  `}
  render={data => (
    <Layout>
      <p>
        Here are the books I've read recently.  People often ask me for book recommendations so I decided to compile a list of impactful books across a wide range of genres including fiction and non-fiction.  I'll be adding to this page over time.
      </p>
      <ul>
        {data.allBooksYaml.edges.map( ({ node }) => (
          <li key={node.id}>{node.title}
          &nbsp;
          <small><a href={node.amazon}>(Amazon)</a></small>
          &nbsp;
          <small><a href={node.goodreads}>(Goodreads)</a></small>
          </li>
        )
        )}
      </ul>
    </Layout>
  )
  }
  />
)