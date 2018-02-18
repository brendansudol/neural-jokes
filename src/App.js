import React, { Component } from 'react'

const ml5 = window.ml5
const modelPath = `${process.env.PUBLIC_URL}/static/models/lstm/hemingway`
const lstm = new ml5.LSTMGenerator(modelPath)

class App extends Component {
  state = { loading: false, output: '', temp: '0.5', text: 'There was' }

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
    this.setState({ loading: true, output: '' }, this.initGen)
  }

  initGen = () => setTimeout(this.runGen, 20)

  runGen = () => {
    const { temp, text } = this.state
    const data = {
      seed: text,
      temperature: +temp,
      length: 200
    }

    lstm.generate(data, this.processResults)
  }

  processResults = results => {
    const { text } = this.state
    const output = `${text} ${results.generated}`
    this.setState({ loading: false, output })
  }

  render() {
    const { loading, output, temp, text } = this.state

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
            <label>Temperature: ({parseInt(temp * 10, 10)} / 10)</label>
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
        {output && <div className="p2 bg-silver rounded">{output}</div>}
      </div>
    )
  }
}

export default App
