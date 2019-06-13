import React, { useState, useEffect } from "react"

const GitDetails = () => {
  const initialState = JSON.parse('{"htmlUrl": "", "hash": ""}')
  const [result, setResult] = useState(initialState)

  useEffect(() => {
    fetch(
      'https://blue-union-3e08.plktio.workers.dev/',
      { method: 'GET' }
    )
    .then(response => response.text())
    .then(data => {
      try {
        setResult(JSON.parse(data))
      } catch(error) { // Cached version of Cloudflare worker is used
        const jsonData = JSON.parse('{"htmlUrl": "", "hash": data}')
        setResult(jsonData)
      }
      
    })
  }, [])

  return (
    <div>
      <a href={result.htmlUrl}>{result.hash}</a>
    </div>
  )
}
export default GitDetails