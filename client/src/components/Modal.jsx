import React, { Component } from 'react'
import { X } from 'lucide-react'

export default class Modal extends Component {
    constructor(props) {
        super(props)
        
        this.modalRef = React.createRef()
    }
    
    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyDown)
        document.body.style.overflow = 'hidden'
    }
    
    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyDown)
        document.body.style.overflow = 'unset'
    }
    
    handleKeyDown = (event) => {
        if (event.key === 'Escape') {
            this.handleClose()
        }
    }
    
    handleBackdropClick = (event) => {
        if (event.target === this.modalRef.current) {
            this.handleClose()
        }
    }
    
    handleClose = () => {
        if (this.props.onClose) {
            this.props.onClose()
        }
    }
    
    render() {
        const { 
            isOpen, 
            title, 
            children, 
            size = 'medium',
            closable = true 
        } = this.props
        
        if (!isOpen) {
            return null
        }
        
        const sizeClasses = {
            small: { maxWidth: '400px' },
            medium: { maxWidth: '600px' },
            large: { maxWidth: '800px' },
            full: { maxWidth: '95vw' }
        }
        
        return (
            <div 
                className={`bm_modal ${isOpen ? 'bm_open' : ''}`}
                ref={this.modalRef}
                onClick={this.handleBackdropClick}
            >
                <div 
                    className="bm_modalContent"
                    style={sizeClasses[size]}
                >
                    <div className="bm_modalHeader">
                        <h2 className="bm_modalTitle">{title}</h2>
                        {closable && (
                            <button 
                                className="bm_modalClose"
                                onClick={this.handleClose}
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>
                    
                    <div className="bm_modalBody">
                        {children}
                    </div>
                </div>
            </div>
        )
    }
}
