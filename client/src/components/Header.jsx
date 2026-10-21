import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Menu, X, User } from 'lucide-react'
import { isAuthenticated, getUser, logout } from '../utils/auth'
import { apiRequest } from '../utils/api'
import { API_ENDPOINTS } from '../config/constants'

export default class Header extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
            isMenuOpen: false,
            cartCount: 0,
            user: null
        }
    }
    
    componentDidMount() {
        this.updateUserState()
        this.fetchCartCount()
    }
    
    componentDidUpdate(prevProps) {
        if (prevProps.cartUpdated !== this.props.cartUpdated) {
            this.fetchCartCount()
        }
    }
    
    updateUserState = () => {
        if (isAuthenticated()) {
            this.setState({ user: getUser() })
        } else {
            this.setState({ user: null })
        }
    }
    
    fetchCartCount = async () => {
        if (!isAuthenticated()) {
            this.setState({ cartCount: 0 })
            return
        }
        
        const { data, error } = await apiRequest('GET', API_ENDPOINTS.CART.BASE)
        if (data && !error) {
            this.setState({ cartCount: data.itemCount || 0 })
        }
    }
    
    toggleMenu = () => {
        this.setState(prevState => ({
            isMenuOpen: !prevState.isMenuOpen
        }))
    }
    
    closeMenu = () => {
        this.setState({ isMenuOpen: false })
    }
    
    handleLogout = () => {
        logout()
        this.setState({ user: null, cartCount: 0 })
        this.closeMenu()
    }
    
    render() {
        const { isMenuOpen, cartCount, user } = this.state
        
        return (
            <header className="bm_header">
                <div className="bm_headerContainer">
                    <Link to="/" className="bm_logo" onClick={this.closeMenu}>
                        LEGO Store
                    </Link>
                    
                    <nav className="bm_nav">
                        <Link to="/" className="bm_navLink">
                            Home
                        </Link>
                        <Link to="/products" className="bm_navLink">
                            Products
                        </Link>
                        {user?.isAdmin && (
                            <Link to="/admin" className="bm_navLink">
                                Admin
                            </Link>
                        )}
                    </nav>
                    
                    <div className="bm_headerActions">
                        {user ? (
                            <>
                                <Link to="/cart" className="bm_cartIcon">
                                    <ShoppingCart size={24} />
                                    {cartCount > 0 && (
                                        <span className="bm_cartBadge">
                                            {cartCount}
                                        </span>
                                    )}
                                </Link>
                                
                                <div className="bm_userMenu">
                                    <Link to="/profile" className="bm_navLink">
                                        <User size={20} />
                                        {user.firstName}
                                    </Link>
                                    <button 
                                        onClick={this.handleLogout}
                                        className="bm_navLink"
                                        style={{ background: 'none', border: 'none' }}
                                    >
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="bm_navLink">
                                    Login
                                </Link>
                                <Link to="/register" className="bm_navLink">
                                    Register
                                </Link>
                            </>
                        )}
                        
                        <button 
                            className="bm_mobileMenuButton"
                            onClick={this.toggleMenu}
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
                
                <div className={`bm_mobileMenu ${isMenuOpen ? 'bm_open' : ''}`}>
                    <ul className="bm_mobileNavList">
                        <li className="bm_mobileNavItem">
                            <Link 
                                to="/" 
                                className="bm_mobileNavLink"
                                onClick={this.closeMenu}
                            >
                                Home
                            </Link>
                        </li>
                        <li className="bm_mobileNavItem">
                            <Link 
                                to="/products" 
                                className="bm_mobileNavLink"
                                onClick={this.closeMenu}
                            >
                                Products
                            </Link>
                        </li>
                        {user && (
                            <>
                                <li className="bm_mobileNavItem">
                                    <Link 
                                        to="/cart" 
                                        className="bm_mobileNavLink"
                                        onClick={this.closeMenu}
                                    >
                                        Cart ({cartCount})
                                    </Link>
                                </li>
                                <li className="bm_mobileNavItem">
                                    <Link 
                                        to="/profile" 
                                        className="bm_mobileNavLink"
                                        onClick={this.closeMenu}
                                    >
                                        Profile
                                    </Link>
                                </li>
                                {user.isAdmin && (
                                    <li className="bm_mobileNavItem">
                                        <Link 
                                            to="/admin" 
                                            className="bm_mobileNavLink"
                                            onClick={this.closeMenu}
                                        >
                                            Admin
                                        </Link>
                                    </li>
                                )}
                                <li className="bm_mobileNavItem">
                                    <button 
                                        onClick={this.handleLogout}
                                        className="bm_mobileNavLink"
                                        style={{ 
                                            background: 'none', 
                                            border: 'none',
                                            width: '100%',
                                            textAlign: 'left'
                                        }}
                                    >
                                        Logout
                                    </button>
                                </li>
                            </>
                        )}
                        {!user && (
                            <>
                                <li className="bm_mobileNavItem">
                                    <Link 
                                        to="/login" 
                                        className="bm_mobileNavLink"
                                        onClick={this.closeMenu}
                                    >
                                        Login
                                    </Link>
                                </li>
                                <li className="bm_mobileNavItem">
                                    <Link 
                                        to="/register" 
                                        className="bm_mobileNavLink"
                                        onClick={this.closeMenu}
                                    >
                                        Register
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </header>
        )
    }
}