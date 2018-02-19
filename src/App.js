import React, { Component } from 'react'

const ml5 = window.ml5
const modelPath = `${process.env.PUBLIC_URL}/static/models/conan`
const lstm = new ml5.LSTMGenerator(modelPath)

const genText = input =>
  new Promise((resolve, reject) => {
    lstm.generate(input, resolve)
  })

const genTexts = inputs => Promise.all(inputs.map(inp => genText(inp)))

class App extends Component {
  state = {
    loading: false,
    results: [],
    temp: '0.5',
    text: 'There was'
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true
  }

  handleChange = e => {
    const { name, value } = e.target
    this.setState({ [name]: value })
  }

  handleSubmit = e => {
    e.preventDefault()
    const { text } = this.state
    if (!text.length || !lstm.ready) return
    this.setState({ loading: true, results: [] }, this.initGen)
  }

  initGen = () => setTimeout(this.runGen, 20)

  runGen = () => {
    const { temp, text } = this.state
    const data = {
      seed: text,
      temperature: +temp,
      length: 300
    }

    const inputs = [data, data]
    genTexts(inputs).then(this.processResults)
  }

  processResults = data => {
    const { text } = this.state
    const results = data.map(d => {
      const raw = d.generated
      const clean = raw.search('\n\n') > 0 ? raw.split('\n\n')[0] : `${raw}...`
      return `${text} ${clean}`
    })

    this.setState({ loading: false, results })
  }

  render() {
    const { loading, results, temp, text } = this.state

    return (
      <div className="p2 sm-p3 container">
        <form className="mb3" onSubmit={this.handleSubmit}>
          <div className="mb3">
            <label>Seed</label>
            <input
              className="input m0"
              name="text"
              value={text}
              onChange={this.handleChange}
            />
          </div>
          <div className="mb3">
            <label>Temperature: ({temp})</label>
            <input
              type="range"
              className="input-range block"
              name="temp"
              min="0"
              max="1"
              step="0.1"
              value={temp}
              onChange={this.handleChange}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Generating' : 'Generate'}
          </button>
        </form>
        {loading && <div>Loading...</div>}
        {results.length > 0 &&
          results.map((joke, i) => (
            <div key={i} className="mb2 p2 bg-silver rounded">
              {joke}
            </div>
          ))}
      </div>
    )
  }
}

export default App
