import React, { useState } from 'react'

import { Link, StaticQuery, graphql } from 'gatsby'
import { useStaticQuery } from 'gatsby'
import Layout from "../components/layout"
import SEO from "../components/seo"

const Bookshelf = () => {
  const [ isDisplayingLinks, displayLinks ] = useState(false)
  const [ isDisplayingAuthor, displayAuthor ] = useState(true)
  const [ isDisplayingFullTitle, displayFullTitle ] = useState(false)
  const [ isDisplayingComment, displayComment ] = useState(true)

  const books = useStaticQuery(
    graphql`
      query {
        allBooksYaml {
          edges {
            node {
              title
              author
              subtitle
              amazon
              goodreads
              comment
            }
          }
        }
      }
    `
  )

  return (
    <Layout>
      <SEO title="Bookshelf" />
      <p>
        Here is a list of the books I've read recently.  It serves as a good example of what interests me.  I'll be adding to this page over time.  <Link to="/contact">Let me know</Link> if you also enjoyed these books or have others to recommend. 😀.
      </p>
      <button onClick={() => displayFullTitle(!isDisplayingFullTitle)}>Toggle full title</button>
      <button onClick={() => displayAuthor(!isDisplayingAuthor)}>Toggle author name</button>
      <button onClick={() => displayLinks(!isDisplayingLinks)}>Toggle Amazon/Goodreads links</button>
      <button onClick={() => displayComment(!isDisplayingComment)}>Toggle comments</button>
      <p></p>
      <ul>
        {books.allBooksYaml.edges.map( ({ node }) => (
          <li key={node.id}><strong>{node.title}</strong>
          {
            isDisplayingFullTitle ?
              <>
                : <em>{node.subtitle}</em>
              </>
            : null
          }
          {
            isDisplayingAuthor ?
              <>
               &nbsp;by {node.author}
              </>
            : null
          }
          {
            isDisplayingLinks ? 
              <>
                <small>&nbsp;<a href={node.amazon}>(Amazon)</a></small>
                <small>&nbsp;<a href={node.goodreads}>(Goodreads)</a></small>
              </>
            : null
          }
          {
            isDisplayingComment && node.comment ? 
              <>
                <blockquote>&nbsp;{node.comment}</blockquote>
              </>
            : null
          }
          </li>
        )
        )}
      </ul>
    </Layout>    
  )

}

export default Bookshelf