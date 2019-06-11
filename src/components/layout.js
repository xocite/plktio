/**
 * Layout component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { StaticQuery, graphql } from "gatsby"

import Header from "./header"
import "./layout.css"
import LayoutStyles from "./layout.module.css"
import GitDetails from "./git_details";

const Layout = ({ children }) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
          }
        }
      }
    `}
    render={data => (
      <>
        <Header siteTitle={data.site.siteMetadata.title} />
        <div className={LayoutStyles.container}>
          <main>{children}</main>
          <footer><small>
            <br />
            <hr />
            Built with
            {` `}
            <a href="https://www.gatsbyjs.org">Gatsby</a>,
            {` `}
            <a href="https://code.visualstudio.com/">VSCode</a>,
            {` `}
            <a href="https://www.gentoo.org">Gentoo</a>,
            {` `}
            <a href="https://aws.amazon.com/amplify/">Amplify</a>,
            {` and `}
            <a href="https://reactjs.org/">React</a><br />
            © 2008 to {new Date().getFullYear()} Antony Jepson <GitDetails />
          </small></footer>
        </div>
      </>
    )}
  />
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
