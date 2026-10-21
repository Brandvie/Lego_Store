import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class Footer extends Component {
    render() {
        const currentYear = new Date().getFullYear()
        
        return (
            <footer className="bm_footer">
                <div className="bm_footerContainer">
                    <div className="bm_footerContent">
                        <div className="bm_footerSection">
                            <h3 className="bm_footerTitle">LEGO Store</h3>
                            <p>
                                Your one-stop destination for all LEGO sets and building experiences. 
                                Discover creativity, imagination, and endless fun with our premium collection.
                            </p>
                        </div>
                        
                        <div className="bm_footerSection">
                            <h4 className="bm_footerTitle">Quick Links</h4>
                            <ul className="bm_footerList">
                                <li className="bm_footerItem">
                                    <Link to="/" className="bm_footerLink">Home</Link>
                                </li>
                                <li className="bm_footerItem">
                                    <Link to="/products" className="bm_footerLink">Products</Link>
                                </li>
                                <li className="bm_footerItem">
                                    <Link to="/cart" className="bm_footerLink">Cart</Link>
                                </li>
                                <li className="bm_footerItem">
                                    <Link to="/profile" className="bm_footerLink">My Account</Link>
                                </li>
                            </ul>
                        </div>
                        
                        <div className="bm_footerSection">
                            <h4 className="bm_footerTitle">Categories</h4>
                            <ul className="bm_footerList">
                                <li className="bm_footerItem">
                                    <Link to="/products?category=Star Wars" className="bm_footerLink">Star Wars</Link>
                                </li>
                                <li className="bm_footerItem">
                                    <Link to="/products?category=City" className="bm_footerLink">City</Link>
                                </li>
                                <li className="bm_footerItem">
                                    <Link to="/products?category=Technic" className="bm_footerLink">Technic</Link>
                                </li>
                                <li className="bm_footerItem">
                                    <Link to="/products?category=Creator" className="bm_footerLink">Creator</Link>
                                </li>
                            </ul>
                        </div>
                        
                        <div className="bm_footerSection">
                            <h4 className="bm_footerTitle">Support</h4>
                            <ul className="bm_footerList">
                                <li className="bm_footerItem">
                                    <a href="#" className="bm_footerLink">Help Center</a>
                                </li>
                                <li className="bm_footerItem">
                                    <a href="#" className="bm_footerLink">Shipping Info</a>
                                </li>
                                <li className="bm_footerItem">
                                    <a href="#" className="bm_footerLink">Returns</a>
                                </li>
                                <li className="bm_footerItem">
                                    <a href="#" className="bm_footerLink">Contact Us</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    
                    <div className="bm_footerBottom">
                        <p>&copy; {currentYear} LEGO Store by Brandyvie Mayombo. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        )
    }
}
