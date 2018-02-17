import React, { Component } from 'react'

const ml5 = window.ml5
const modelPath = `${process.env.PUBLIC_URL}/static/models/lstm/hemingway`
const lstm = new ml5.LSTMGenerator(modelPath)

class App extends Component {
  state = { loading: false, output: '', text: 'There was' }

  shouldComponentUpdate(nextProps, nextState) {
    return true
  }

  handleChange = e => {
    this.setState({ text: e.target.value })
  }

  handleSubmit = e => {
    e.preventDefault()
    const { text } = this.state
    if (!text.length || !lstm.ready) return
    this.setState({ loading: true, output: '' }, this.initGen)
  }

  initGen = () => setTimeout(this.runGen, 20)

  runGen = () => {
    const { text } = this.state
    const data = {
      seed: text,
      temperature: 0.5,
      length: 100,
    }

    lstm.generate(data, this.processResults)
  }

  processResults = results => {
    const { text } = this.state
    const output = `${text} ${results.generated}`
    this.setState({ loading: false, output })
  }

  render() {
    const { loading, output, text } = this.state

    return (
      <div className="p2 sm-p3 container">
        <form className="sm-flex mb3" onSubmit={this.handleSubmit}>
          <input
            className="flex-auto input sm-mb0 mr1"
            name="text"
            value={text}
            onChange={this.handleChange}
          />
          <button type="submit" className="btn btn-primary">
            Generate
          </button>
        </form>
        {loading && <div>Loading...</div>}
        {output && <div className="p2 bg-silver rounded">{output}</div>}
      </div>
    )
  }
}

export default App
