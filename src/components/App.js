/* eslint-disable jsx-a11y/accessible-emoji */

import ml5 from 'ml5'
import React, { Component } from 'react'

import HelpIcon from './HelpIcon'
import Tooltip from './Tooltip'

const MODEL_PATH = `${process.env.PUBLIC_URL}/static/models/conan5`

const nextFrame = () =>
  new Promise(resolve => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
  })

const tempText = `
  Also known as “temperature”, decreasing the variation makes the model more
  confident, but also more conservative in its text generation. Conversely, a
  higher variation produces more diversity at the cost of more mistakes (e.g.,
  spelling errors).
`

class App extends Component {
  state = {
    ready: false,
    loading: false,
    results: [],
    temp: '0.5',
    text: 'According to a recent poll, Donald Trump',
  }

  componentDidMount() {
    this.model = ml5.LSTMGenerator(MODEL_PATH, () =>
      this.setState({ ready: true })
    )
  }

  handleChange = e => {
    const { name, value } = e.target
    this.setState({ [name]: value })
  }

  handleSubmit = e => {
    e.preventDefault()
    const { text } = this.state
    if (!text.length) return
    this.setState({ loading: true, results: [] })
    this.generateResults()
  }

  generateResults = async () => {
    await nextFrame()

    const { temp, text } = this.state
    const inputs = { seed: text, temperature: +temp, length: 300 }

    const data = await Promise.all(
      [...Array(3)].map(async () => await this.model.generate(inputs))
    )

    const results = data.map(raw => {
      const clean = raw.search('\n\n') > 0 ? raw.split('\n\n')[0] : `${raw}...`
      return `${text} ${clean}`
    })

    this.setState({ loading: false, results })
  }

  render() {
    const { ready, loading, results, temp, text } = this.state

    return (
      <div className="p2 sm-p3 pb4 container">
        <div className="mb3">
          <div className="h2">🤖📝😂</div>
          <h1 className="my1 h1">AI Joke Generation Demo</h1>
          <p>
            This experiment lets you generate jokes with a recurrent neural
            network. It was trained on ten thousand Conan O’Brien monologue
            jokes. Once you start writing a sentence, the model will come up
            with a few possible ways to finish the zinger.
          </p>
        </div>
        <div className="clearfix mxn2">
          <div className="col col-12 sm-col-6 px2">
            <form className="mb2" onSubmit={this.handleSubmit}>
              <div className="mb3">
                <label className="block mb05 h6 bold caps">Initial text</label>
                <textarea
                  name="text"
                  className="textarea m0"
                  rows="3"
                  required={true}
                  value={text}
                  onChange={this.handleChange}
                />
              </div>
              <div className="mb3">
                <label className="inline-block mb05 h6 bold caps">
                  <span className="mr1">
                    Variation: (<span className="mono">{temp}</span>)
                  </span>
                  <Tooltip theme="dark text" title={tempText}>
                    <HelpIcon className="align-bottom" />
                  </Tooltip>
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
                disabled={!ready || loading}
              >
                {!ready
                  ? 'Loading model...'
                  : loading
                    ? 'Generating jokes...'
                    : 'Generate jokes'}
              </button>
            </form>
          </div>
          <div className="col col-12 sm-col-6 px2 xs-hide">
            <div className="sm-pl3 border-left border-silver">
              <h3 className="mt0 mb05 h6 bold caps">Details</h3>
              <p>
                The training data is 7+ years of Conan O’Brien monologue{' '}
                <a href="https://github.com/brendansudol/conan-jokes-data">
                  jokes
                </a>{' '}
                (10k total, 1.6M characters). The model is a 2-layer LSTM with
                512 hidden nodes and a dropout of 0.5.
              </p>
              <p>
                Trained using{' '}
                <a href="https://www.tensorflow.org/">TensorFlow</a>. Modified
                to work in the browser via{' '}
                <a href="https://ml5js.org/">ml5.js</a>. Interface built with
                React.
              </p>
            </div>
          </div>
        </div>
        {results.length > 0 && (
          <div className="mt2 mb4 border-top border-silver">
            <h3 className="h4">Joke Ideas:</h3>
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
