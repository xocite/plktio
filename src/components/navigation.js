import React from 'react'

import { Link, StaticQuery, graphql } from 'gatsby'

import navigationStyles from './navigation.module.css'

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
    <nav className={navigationStyles.navbar}>
    <ul className={navigationStyles.navbar}>
      {data.allNavpagesYaml.edges.map( ({ node }) => (
        <li  key={node.id}>
          <Link to={node.link}> {node.title}&nbsp;</Link>
        </li>
      )
      )}
    </ul>
    </nav>
  )
  }
  />
)