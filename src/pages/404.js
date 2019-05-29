import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

const NotFoundPage = () => (
  <Layout>
    <SEO title="404: Not found" />
    <h1>NOT FOUND</h1>
    <p>Page doesn't exist.  Need it?  Create it.  <a href="https://github.com/xocite/plktio">GitHub repository</a></p>
  </Layout>
)

export default NotFoundPage
