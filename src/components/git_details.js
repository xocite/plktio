import React, { Component, useState, useEffect } from "react"

const GitDetails = () => {
  const [hash, setHash] = useState("Fetching hash...")

  useEffect(() => {
    fetch(
      'https://blue-union-3e08.plktio.workers.dev/',
      { method: 'GET' }
    )
    .then(response => response.text())
    .then(data => setHash(data))
  })

  return (
    <div>
      {hash}
    </div>
  )
}
export default GitDetails