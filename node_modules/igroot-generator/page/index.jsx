import React, {Component} from 'react'
import {render} from 'react-dom'

import {TestApi} from '../../apis/test.api'
import './index.scss'

window.React = React

class App extends Component {
    state = {}

    render() {
        const {testData} = this.state

        return (
            <div id="app">
                <img src="/static/bird.jpg" alt="bird"/> <br/>
                welcome to React! <br/>
                {testData}
            </div>
        )
    }

    componentWillMount() {
        TestApi.get()
            .then(json => this.setState({testData: JSON.stringify(json)}))
    }
}

// Render the main component into the dom
render(<App />, document.getElementById('app'))
