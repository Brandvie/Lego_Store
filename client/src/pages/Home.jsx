import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner'
import Alert from '../components/Alert'

export default class Home extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
            featuredProducts: [],
            isLoading: true,
            error: null
        }
    }
    
    componentDidMount() {
        this.fetchProducts()
    }
    
    fetchProducts = async () => {
        this.setState({ isLoading: true, error: null })

        try {
            const response = await fetch('/json/products.json')
            if (!response.ok) throw new Error('Failed to fetch products')
            const data = await response.json()

            
            const featuredProducts = data.slice(0, 5)

            this.setState({
                featuredProducts,
                isLoading: false
            })
        } catch (error) {
            this.setState({
                error: error.message || 'Failed to load products',
                isLoading: false
            })
        }
    }
    
    handleCartUpdate = () => {
        if (this.props.onCartUpdate) {
            this.props.onCartUpdate()
        }
    }
    
    render() {
        const { featuredProducts, isLoading, error } = this.state
        
        return (
            <div>
                <section className="bm_hero">
                    <div className="bm_container">
                        <h1 className="bm_heroTitle">
                            Build Your Dreams with LEGO
                        </h1>
                        <p className="bm_heroSubtitle">
                            Discover endless possibilities with our premium collection of LEGO sets. 
                            From architecture to space adventures, find your perfect building experience.
                        </p>
                        <Link to="/products" className="bm_heroButton">
                            Shop Now
                        </Link>
                    </div>
                </section>
                
                <main className="bm_main">
                    <div className="bm_container">
                        <section>
                            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                                <h2 className="bm_h2">Featured Products</h2>
                                <p style={{ fontSize: '1.125rem', color: '#666' }}>
                                    Discover our most popular and highly-rated LEGO sets
                                </p>
                            </div>

                            {error && (
                                <Alert 
                                    type="error" 
                                    message={error}
                                    onClose={() => this.setState({ error: null })}
                                />
                            )}

                            {isLoading ? (
                                <LoadingSpinner message="Loading featured products..." />
                            ) : featuredProducts.length > 0 ? (
                                <div className="bm_productGrid">
                                    {featuredProducts.map((product, index) => (
                                        <div key={index} className="bm_card">
                                            <img
                                                src={product.images[0]}
                                                alt={product.name}
                                                className="bm_image"
                                            />
                                            <div className="bm_content">
                                                <h2 className="bm_title">{product.name}</h2>
                                                <p className="bm_text">Price: ${product.price}</p>
                                                <p className="bm_text">⭐ {product.rating}</p>
                                                <p className="bm_text">Stock: {product.quantity}</p>
                                                <button className="bm_button">Add to Cart</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '3rem' }}>
                                    <p style={{ fontSize: '1.125rem', color: '#666' }}>
                                        No featured products available at the moment.
                                    </p>
                                    <Link 
                                        to="/products" 
                                        style={{
                                            display: 'inline-block',
                                            marginTop: '1rem',
                                            padding: '0.75rem 1.5rem',
                                            backgroundColor: '#3D74B6',
                                            color: 'white',
                                            textDecoration: 'none',
                                            borderRadius: '0.5rem',
                                            fontWeight: '500'
                                        }}
                                    >
                                        Browse All Products
                                    </Link>
                                </div>
                            )}
                        </section>

                        <section style={{ marginTop: '4rem' }}>
                            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                                <h2 className="bm_h2">Why Choose Our LEGO Store?</h2>
                            </div>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                                gap: '2rem',
                                marginBottom: '3rem'
                            }}>
                                <div style={{
                                    textAlign: 'center',
                                    padding: '2rem',
                                    backgroundColor: 'white',
                                    borderRadius: '0.75rem',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}>
                                    <h3 className="bm_h3" style={{ color: '#3D74B6' }}>
                                        Authentic Products
                                    </h3>
                                    <p>
                                        All our LEGO sets are 100% authentic and sourced directly 
                                        from official distributors.
                                    </p>
                                </div>

                                <div style={{
                                    textAlign: 'center',
                                    padding: '2rem',
                                    backgroundColor: 'white',
                                    borderRadius: '0.75rem',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}>
                                    <h3 className="bm_h3" style={{ color: '#3D74B6' }}>
                                        Fast Shipping
                                    </h3>
                                    <p>
                                        Free shipping on orders over $100. Express delivery 
                                        available for urgent orders.
                                    </p>
                                </div>

                                <div style={{
                                    textAlign: 'center',
                                    padding: '2rem',
                                    backgroundColor: 'white',
                                    borderRadius: '0.75rem',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}>
                                    <h3 className="bm_h3" style={{ color: '#3D74B6' }}>
                                        Expert Support
                                    </h3>
                                    <p>
                                        Our team of LEGO enthusiasts is here to help you find 
                                        the perfect set for any occasion.
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        )
    }
}
