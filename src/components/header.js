import React from "react"

import { Link } from "gatsby"
import PropTypes from "prop-types"
import Navigation from "../components/navigation"
import headerStyles from "./header.module.css"

import Analytics from '@aws-amplify/analytics'
import Auth from '@aws-amplify/auth'
import aws_exports from "../aws-exports.js"

const amplifyConfig = {
  Auth: {
    identityPoolId: 'eu-west-1:2f5ce4a0-55bc-425e-a93d-9f875eb7622f',
    region: 'eu-west-1'
  }
}
//Initialize Amplify
Auth.configure(amplifyConfig);

const analyticsConfig = {
  autoSessionRecord: true,
  AWSPinpoint: {
        // Amazon Pinpoint App Client ID
        appId: '3431c98f37a645f48ec779174df81656',
        // Amazon service region
        region: 'eu-west-1',
        mandatorySignIn: false,
  }
}

Analytics.configure(analyticsConfig)

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
