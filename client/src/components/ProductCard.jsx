import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Eye, Star } from 'lucide-react'
import { isAuthenticated } from '../utils/auth'
import { apiRequest } from '../utils/api'
import { API_ENDPOINTS } from '../config/constants'

export default class ProductCard extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
            isAddingToCart: false,
            addedToCart: false
        }
    }
    
    handleAddToCart = async (event) => {
        event.preventDefault()
        event.stopPropagation()
        
        if (!isAuthenticated()) {
            window.location.href = '/login'
            return
        }
        
        const { product } = this.props
        
        if (product.stock <= 0) {
            return
        }
        
        this.setState({ isAddingToCart: true })
        
        const { data, error } = await apiRequest('POST', API_ENDPOINTS.CART.ADD, {
            productId: product._id,
            quantity: 1
        })
        
        if (data && !error) {
            this.setState({ 
                addedToCart: true,
                isAddingToCart: false 
            })
            
            if (this.props.onCartUpdate) {
                this.props.onCartUpdate()
            }
            
            setTimeout(() => {
                this.setState({ addedToCart: false })
            }, 2000)
        } else {
            this.setState({ isAddingToCart: false })
            console.error('Failed to add to cart:', error)
        }
    }
    
    formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price)
    }
    
    render() {
        const { product } = this.props
        const { isAddingToCart, addedToCart } = this.state
        
        const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0]
        const isInStock = product.stock > 0
        const hasDiscount = product.originalPrice && product.originalPrice > product.price
        
        return (
            <div className="bm_productCard">
                <Link to={`/products/${product._id}`}>
                    <div style={{ position: 'relative' }}>
                        <img 
                            src={primaryImage?.url || '/placeholder-product.jpg'} 
                            alt={primaryImage?.alt || product.name}
                            className="bm_productImage"
                        />
                        
                        {hasDiscount && (
                            <div style={{
                                position: 'absolute',
                                top: '0.5rem',
                                right: '0.5rem',
                                background: '#DC3C22',
                                color: 'white',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '0.25rem',
                                fontSize: '0.75rem',
                                fontWeight: '600'
                            }}>
                                -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                            </div>
                        )}
                        
                        {!isInStock && (
                            <div style={{
                                position: 'absolute',
                                top: '0.5rem',
                                left: '0.5rem',
                                background: 'rgba(0, 0, 0, 0.8)',
                                color: 'white',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '0.25rem',
                                fontSize: '0.75rem',
                                fontWeight: '600'
                            }}>
                                Out of Stock
                            </div>
                        )}
                    </div>
                </Link>
                
                <div className="bm_productInfo">
                    <Link to={`/products/${product._id}`}>
                        <h3 className="bm_productName">{product.name}</h3>
                    </Link>
                    
                    <div className="bm_productPrice">
                        {hasDiscount && (
                            <span style={{
                                textDecoration: 'line-through',
                                color: '#666',
                                fontSize: '0.875rem',
                                marginRight: '0.5rem'
                            }}>
                                {this.formatPrice(product.originalPrice)}
                            </span>
                        )}
                        {this.formatPrice(product.price)}
                    </div>
                    
                    <p className="bm_productDescription">
                        {product.description}
                    </p>
                    
                    <div className="bm_productMeta">
                        <div>
                            <span style={{ fontSize: '0.875rem', color: '#666' }}>
                                {product.pieceCount} pieces • Ages {product.ageRange.min}+
                            </span>
                        </div>
                        
                        <div className={`bm_productStock ${isInStock ? 'bm_inStock' : 'bm_outOfStock'}`}>
                            {isInStock ? `${product.stock} in stock` : 'Out of stock'}
                        </div>
                    </div>
                    
                    {product.rating && product.rating.count > 0 && (
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.25rem',
                            marginBottom: '0.75rem'
                        }}>
                            <Star size={14} fill="#FFC107" color="#FFC107" />
                            <span style={{ fontSize: '0.875rem' }}>
                                {product.rating.average.toFixed(1)} ({product.rating.count})
                            </span>
                        </div>
                    )}
                    
                    <div className="bm_productActions">
                        <button
                            className="bm_addToCartButton"
                            onClick={this.handleAddToCart}
                            disabled={!isInStock || isAddingToCart}
                        >
                            <ShoppingCart size={16} />
                            {isAddingToCart ? 'Adding...' : addedToCart ? 'Added!' : 'Add to Cart'}
                        </button>
                        
                        <Link 
                            to={`/products/${product._id}`}
                            className="bm_viewButton"
                        >
                            <Eye size={16} />
                        </Link>
                    </div>
                </div>
            </div>
        )
    }
}
