/* eslint-disable jsx-a11y/accessible-emoji */

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
    const { text } = this.state
    const data = {
      seed: text,
      temperature: 0.5,
      length: 300
    }

    const inputs = [...Array(3)].map(() => ({ ...data }))
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
      <div className="p2 sm-p3 pb4 container">
        <div className="mb3">
          <div className="h3">🤖📝😂</div>
          <h1 className="m0 h2">AI Joke Generator</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
        </div>

        <div className="clearfix mxn2">
          <div className="col col-12 sm-col-7 px2">
            <form className="mb2" onSubmit={this.handleSubmit}>
              <div className="mb3">
                <label className="block mb05 h6 bold caps">Initial text</label>
                <textarea
                  name="text"
                  className="textarea m0"
                  rows="3"
                  value={text}
                  onChange={this.handleChange}
                />
              </div>
              <div className="mb3">
                <label className="block mb05 h6 bold caps">
                  Variation: ({temp})
                </label>
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
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Generating jokes...' : 'Generate'}
              </button>
            </form>
          </div>
          <div className="col col-12 sm-col-5 px2 xs-hide">
            <div className="sm-pl3 border-left border-silver">
              <h3 className="mt0 mb05 h6 bold caps">More details...</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam.
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam.
              </p>
            </div>
          </div>
        </div>

        {results.length > 0 && (
          <div className="my3 border-top border-silver">
            <h3>Joke Ideas:</h3>
            {results.map((joke, i) => (
              <div key={i} className="mb2 p2 bg-silver rounded">
                {joke}
              </div>
            ))}
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 block center p2 h6">
          <a
            className="black underline mr2"
            href="https://twitter.com/brensudol"
          >
            Made by @brensudol
          </a>
          <a
            className="black underline mr2"
            href="https://github.com/brendansudol/neural-jokes"
          >
            Code on GitHub
          </a>
        </div>
      </div>
    )
  }
}

export default App
