import React, { Component } from 'react'

export default class LoadingSpinner extends Component {
    render() {
        const { message = 'Loading...' } = this.props
        
        return (
            <div className="bm_loading">
                <div className="bm_spinner"></div>
                {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
            </div>
        )
    }
}