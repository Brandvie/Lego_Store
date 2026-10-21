import React, { Component } from 'react'
import { X } from 'lucide-react'

export default class Alert extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
            isVisible: true
        }
    }
    
    componentDidMount() {
        const { autoClose = false, duration = 5000 } = this.props
        
        if (autoClose) {
            this.timer = setTimeout(() => {
                this.handleClose()
            }, duration)
        }
    }
    
    componentWillUnmount() {
        if (this.timer) {
            clearTimeout(this.timer)
        }
    }
    
    handleClose = () => {
        this.setState({ isVisible: false })
        
        if (this.props.onClose) {
            setTimeout(() => {
                this.props.onClose()
            }, 300)
        }
    }
    
    render() {
        const { 
            type = 'info', 
            message, 
            title,
            closable = true 
        } = this.props
        const { isVisible } = this.state
        
        if (!isVisible) {
            return null
        }
        
        return (
            <div className={`bm_alert bm_${type}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                        {title && (
                            <h4 style={{ margin: '0 0 0.5rem 0', fontWeight: '600' }}>
                                {title}
                            </h4>
                        )}
                        <p style={{ margin: 0 }}>
                            {message}
                        </p>
                    </div>
                    
                    {closable && (
                        <button
                            onClick={this.handleClose}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '0.25rem',
                                marginLeft: '1rem'
                            }}
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>
            </div>
        )
    }
}
