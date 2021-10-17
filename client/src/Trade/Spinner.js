import React, { Component } from 'react'
import loading from '../shared/img/loader.gif'

export default class Spinner extends Component {
    render() {
        return (
            <div className="text-center">
                <img src={loading} alt=""></img>
            </div>
        )
    }
}
