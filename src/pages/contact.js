import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import twitter from "../images/twitter.png"
import github from "../images/github-32px.png"
import linkedin from "../images/linkedin.png"

const Contact = () => (
  <Layout>
    <SEO title="Contact Antony" />
    <h1>Contact and employment</h1>
    <p>I am available for immediate employment for product manager and software engineer positions, both remote and in United Kingdom.  Outside of the UK, I am willing to relocate and will likely need a work visa.  Locations of interest include: Hong Kong, Singapore, Thailand (Bangkok), United States, and Budapest.</p>
    <p>I want to help you build great products and also make sure we will be a good fit &mdash; so please include complete details on the position, your company, your role, and the customer problem being solved.</p>
    <p>Here are some ways you can reach me.</p>
    <ul>
      <li>
        A well written 📧 email works wonders  and will likely receive a response in under 24 hours. Email address is "a" at this domain.
      </li>
      <li>
        I can also be reached through various social accounts.  My response time may vary.
      </li>
      <ul>
        <li>
          <img src={linkedin} width="20px" alt="LinkedIn icon" /> <a href="https://www.linkedin.com/in/antony-jepson">Antony Jepson</a>
        </li>
        <li>
          <img src={twitter} width="20px" alt="Twitter icon" /> <a href="https://twitter.com/plktio">@plktio</a>
        </li>
        <li>
        <img src={github} width="20px" alt="GitHub icon" /> <a href="https://github.com/xocite">xocite</a>
        </li>
      </ul>
    </ul>
    Learn more about my skillset by looking at my <a href="https://s3-eu-west-1.amazonaws.com/plkt.io.public/resume-2019-07-11.pdf">resume</a>.
    <br />
    <a href="https://s3-eu-west-1.amazonaws.com/plkt.io.public/resume-2019-07-11.pdf"><img src="https://s3-eu-west-1.amazonaws.com/plkt.io.public/resume-2019-07-11-150px.jpg" alt="Antony Jepson resume thumbnail" /></a>
  </Layout>
)



export default Contact
