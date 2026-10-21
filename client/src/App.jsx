import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Products from './pages/Products'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Register from './pages/Register'
import User from './pages/User'

import { isAuthenticated } from './utils/auth'


export default class App extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
            cartUpdated: 0
        }
    }
    
    handleCartUpdate = () => {
        this.setState(prevState => ({
            cartUpdated: prevState.cartUpdated + 1
        }))
    }
    
    render() {
        const { cartUpdated } = this.state
        
        return (
            <Router>
                <div className="App">
                    <Header 
                        cartUpdated={cartUpdated}
                        onCartUpdate={this.handleCartUpdate}
                    />
                    
                    <Routes>
                        <Route 
                            
                            path="/" 
                           
                            element={<Home onCartUpdate={this.handleCartUpdate} />}
                        />
                        <Route 
                            path="/products" 
                           element={<Products onCartUpdate={this.handleCartUpdate} />}
                        />
                         <Route 
                            path="/users" 
                           element={<User />}
                        />
                        <Route 
                            path="/cart" 
                element={<Cart />}
                        />
                        <Route path="/login" component={Login} />
                        <Route path="/register" component={Register} />
                    </Routes>
                    
                    <Footer />
                </div>
            </Router>
        )
    }
}
