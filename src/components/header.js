import React from "react"

import { Link } from "gatsby"
import PropTypes from "prop-types"
import Navigation from "../components/navigation"

const Header = ({ siteTitle }) => (
  <header>
    <div style={{margin: `0 auto`, maxWidth: 960, padding: `1.45rem 1.0875rem`}}>
      <h1>
        <Link
          to="/"
        >
          plkt.io
        </Link>
      </h1>
    </div>
    <Navigation />
  </header>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: `plkt.io`,
}

export default Header
