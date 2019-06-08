import React from "react"

import { Link } from "gatsby"
import PropTypes from "prop-types"
import Navigation from "../components/navigation"
import headerStyles from "./header.module.css"

const Header = ({ siteTitle }) => (
  <header>
    <div className={headerStyles.container}>
      <h1>
        <Link to="/"> plkt.io </Link>
      </h1>
      <Navigation />
    </div>
  </header>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: `plkt.io`,
}

export default Header
