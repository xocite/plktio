import React from "react"

import { Link } from "gatsby"
import PropTypes from "prop-types"
import Navigation from "../components/navigation"
import headerStyles from "./header.module.css"
import ImageLogo from '../images/favicon.jpg'

const Header = ({ siteTitle }) => (
  <header>
    <div className={headerStyles.container}>
      <Link to="/"><img className={headerStyles.logo} src={ImageLogo} alt="plkt.io logo" /></Link>
      <h1>
        <Link to="/">Antony Jepson</Link>
      </h1>
      <Navigation />
    </div>
  </header>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: `Antony Jepson`,
}

export default Header
