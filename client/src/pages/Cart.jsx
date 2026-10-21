import React, { Component } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, X } from 'lucide-react';

export default class Cart extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            cartItems: [],
            isOpen: false,
            isLoading: false,
            error: null
        };
    }
    
    componentDidMount() {
        
        const savedCart = localStorage.getItem('legoCart');
        if (savedCart) {
            this.setState({ cartItems: JSON.parse(savedCart) });
        }
        window.addEventListener('addToCart', this.handleAddToCartEvent);
        
        window.addEventListener('cartUpdated', this.handleCartUpdate);
    }
    
    componentWillUnmount() {
         window.removeEventListener('addToCart', this.handleAddToCartEvent);
        window.removeEventListener('cartUpdated', this.handleCartUpdate);
    }
    handleAddToCartEvent = (event) => {
    this.addToCart(event.detail);
}
    handleCartUpdate = () => {
        const savedCart = localStorage.getItem('legoCart');
        if (savedCart) {
            this.setState({ cartItems: JSON.parse(savedCart) });
        }
    }
    
    addToCart = (product) => {
        this.setState(prevState => {
            const existingItem = prevState.cartItems.find(item => item.id === product.id);
            let updatedCart;
            
            if (existingItem) {
                updatedCart = prevState.cartItems.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                updatedCart = [...prevState.cartItems, { ...product, quantity: 1 }];
            }
            
            
            localStorage.setItem('legoCart', JSON.stringify(updatedCart));
            
           
            window.dispatchEvent(new CustomEvent('cartUpdated'));
            
            return { cartItems: updatedCart };
        });
    }
    
    removeFromCart = (productId) => {
        this.setState(prevState => {
            const updatedCart = prevState.cartItems.filter(item => item.id !== productId);
            
            localStorage.setItem('legoCart', JSON.stringify(updatedCart));
            window.dispatchEvent(new CustomEvent('cartUpdated'));
            
            return { cartItems: updatedCart };
        });
    }
    
    updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) {
            this.removeFromCart(productId);
            return;
        }
        
        this.setState(prevState => {
            const updatedCart = prevState.cartItems.map(item =>
                item.id === productId
                    ? { ...item, quantity: newQuantity }
                    : item
            );
            
            localStorage.setItem('legoCart', JSON.stringify(updatedCart));
            window.dispatchEvent(new CustomEvent('cartUpdated'));
            
            return { cartItems: updatedCart };
        });
    }
    
    clearCart = () => {
        if (window.confirm('Are you sure you want to clear your cart?')) {
            this.setState({ cartItems: [] });
            localStorage.removeItem('legoCart');
            window.dispatchEvent(new CustomEvent('cartUpdated'));
        }
    }
    
    getTotalPrice = () => {
        return this.state.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
    
    getTotalItems = () => {
        return this.state.cartItems.reduce((total, item) => total + item.quantity, 0);
    }
    
    toggleCart = () => {
        this.setState(prevState => ({ isOpen: !prevState.isOpen }));
    }
    
    handleCheckout = () => {
        alert('Checkout functionality would be implemented here!');
        
    }
    
    render() {
        const { cartItems, isOpen } = this.state;
        const totalPrice = this.getTotalPrice();
        const totalItems = this.getTotalItems();
        
        return (
            <>
                {/* Cart Button */}
                <button 
                    className="bm_cartButton"
                    onClick={this.toggleCart}
                >
                    <ShoppingCart size={20} />
                    <span className="bm_cartBadge">{totalItems}</span>
                </button>
                
                {/* Cart Overlay */}
                {isOpen && (
                    <div className="bm_cartOverlay" onClick={this.toggleCart}>
                        <div className="bm_cartPanel" onClick={(e) => e.stopPropagation()}>
                            <div className="bm_cartHeader">
                                <h2 className="bm_cartTitle">Your Cart ({totalItems})</h2>
                                <button 
                                    className="bm_cartCloseButton"
                                    onClick={this.toggleCart}
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            
                            <div className="bm_cartContent">
                                {cartItems.length === 0 ? (
                                    <div className="bm_emptyCart">
                                        <ShoppingCart size={48} />
                                        <p>Your cart is empty</p>
                                        <p>Add some LEGO sets to get started!</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="bm_cartItems">
                                            {cartItems.map(item => (
                                                <div key={item.id} className="bm_cartItem">
                                                    <img 
                                                        src={item.images[0]} 
                                                        alt={item.name}
                                                        className="bm_cartItemImage"
                                                    />
                                                    <div className="bm_cartItemDetails">
                                                        <h3 className="bm_cartItemName">{item.name}</h3>
                                                        <p className="bm_cartItemPrice">${item.price}</p>
                                                        <div className="bm_cartItemControls">
                                                            <button
                                                                onClick={() => this.updateQuantity(item.id, item.quantity - 1)}
                                                                className="bm_quantityButton"
                                                            >
                                                                <Minus size={14} />
                                                            </button>
                                                            <span className="bm_quantityDisplay">{item.quantity}</span>
                                                            <button
                                                                onClick={() => this.updateQuantity(item.id, item.quantity + 1)}
                                                                className="bm_quantityButton"
                                                            >
                                                                <Plus size={14} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => this.removeFromCart(item.id)}
                                                        className="bm_removeItemButton"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        <div className="bm_cartSummary">
                                            <div className="bm_cartTotal">
                                                <span>Total:</span>
                                                <span>${totalPrice.toFixed(2)}</span>
                                            </div>
                                            
                                            <div className="bm_cartActions">
                                                <button
                                                    onClick={this.clearCart}
                                                    className="bm_clearCartButton"
                                                >
                                                    Clear Cart
                                                </button>
                                                <button
                                                    onClick={this.handleCheckout}
                                                    className="bm_checkoutButton"
                                                >
                                                    Checkout
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    }
}