import React, { Component } from "react"

class GitDetails extends Component {
  constructor(props) {
    super(props)

    this.state = { data: "Fetching hash...", }
  }

  componentDidMount() {
    fetch(
      'https://blue-union-3e08.plktio.workers.dev/',
      { method: 'GET' }
    )
    .then(response => response.text())
    .then(data => this.setState({ data }))
  }

  render() {
    const { data } = this.state
    return (
      <div>{data}</div>
    )
  }
}

export default GitDetails