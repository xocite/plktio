import React from 'react'

import { Link, StaticQuery, graphql } from 'gatsby'

export default () => (
  <StaticQuery
  query={graphql`
    query NavigationQuery {
      allNavpagesYaml {
        edges {
          node {
            id
            title
            link
          }
        }
      }
    }
  `}
  render={data => (
    <ul>
      {data.allNavpagesYaml.edges.map( ({ node }) => (
        <li key={node.id}>
          <Link to={node.link}>{node.title}</Link>
        </li>
      )
      )}
    </ul>
  )
  }
  />
)