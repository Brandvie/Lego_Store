import React, { Component } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import Alert from '../components/Alert'
import LoadingSpinner from '../components/LoadingSpinner'
import { apiRequest } from '../utils/api'
import { setToken, setUser, isAuthenticated, validateEmail, validateRequired } from '../utils/auth'
import { API_ENDPOINTS } from '../config/constants'

export default class Login extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
            email: '',
            password: '',
            showPassword: false,
            isLoading: false,
            error: null,
            success: null,
            wasSubmittedAtLeastOnce: false,
            redirectToHome: false
        }
        
        this.emailInputRef = React.createRef()
    }
    
    componentDidMount() {
        if (isAuthenticated()) {
            this.setState({ redirectToHome: true })
            return
        }
        
        if (this.emailInputRef.current) {
            this.emailInputRef.current.focus()
        }
    }
    
    handleChange = (event) => {
        const { name, value } = event.target
        this.setState({ [name]: value })
    }
    
    togglePasswordVisibility = () => {
        this.setState(prevState => ({
            showPassword: !prevState.showPassword
        }))
    }
    
    validateEmail = () => {
        return validateEmail(this.state.email)
    }
    
    validatePassword = () => {
        return validateRequired(this.state.password)
    }
    
    validate = () => {
        return {
            email: this.validateEmail(),
            password: this.validatePassword()
        }
    }
    
    handleSubmit = async (event) => {
        event.preventDefault()
        
        this.setState({ 
            wasSubmittedAtLeastOnce: true,
            error: null,
            success: null 
        })
        
        const formInputsState = this.validate()
        
        if (!Object.keys(formInputsState).every(key => formInputsState[key])) {
            return
        }
        
        this.setState({ isLoading: true })
        
        const { email, password } = this.state
        
        const { data, error } = await apiRequest('POST', API_ENDPOINTS.AUTH.LOGIN, {
            email,
            password
        })
        
        if (data && !error) {
            setToken(data.token)
            setUser(data.user)
            
            this.setState({ 
                success: 'Login successful! Redirecting...',
                isLoading: false 
            })
            
            setTimeout(() => {
                this.setState({ redirectToHome: true })
            }, 1500)
        } else {
            this.setState({ 
                error: error || 'Login failed. Please try again.',
                isLoading: false 
            })
        }
    }
    
    render() {
        const { 
            email, 
            password, 
            showPassword, 
            isLoading, 
            error, 
            success,
            wasSubmittedAtLeastOnce,
            redirectToHome
        } = this.state
        
        if (redirectToHome) {
            return <Navigate to="/" />
        }
        
        const formInputsState = this.validate()
        const showEmailError = wasSubmittedAtLeastOnce && !formInputsState.email
        const showPasswordError = wasSubmittedAtLeastOnce && !formInputsState.password
        
        return (
            <main className="bm_main">
                <div className="bm_container">
                    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
                        <form className="bm_form" onSubmit={this.handleSubmit} noValidate>
                            <h1 className="bm_formTitle">Login to Your Account</h1>
                            
                            {error && (
                                <Alert 
                                    type="error" 
                                    message={error}
                                    onClose={() => this.setState({ error: null })}
                                />
                            )}
                            
                            {success && (
                                <Alert 
                                    type="success" 
                                    message={success}
                                />
                            )}
                            
                            <div className="bm_formGroup">
                                <label htmlFor="email" className="bm_formLabel">
                                    Email Address
                                </label>
                                <input
                                    ref={this.emailInputRef}
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={email}
                                    onChange={this.handleChange}
                                    className={`bm_formInput ${showEmailError ? 'bm_error' : ''}`}
                                    placeholder="Enter your email"
                                    required
                                />
                                {showEmailError && (
                                    <div className="bm_formError">
                                        Please enter a valid email address
                                    </div>
                                )}
                            </div>
                            
                            <div className="bm_formGroup">
                                <label htmlFor="password" className="bm_formLabel">
                                    Password
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        name="password"
                                        value={password}
                                        onChange={this.handleChange}
                                        className={`bm_formInput ${showPasswordError ? 'bm_error' : ''}`}
                                        placeholder="Enter your password"
                                        required
                                        style={{ paddingRight: '3rem' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={this.togglePasswordVisibility}
                                        style={{
                                            position: 'absolute',
                                            right: '0.75rem',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            color: '#666'
                                        }}
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                {showPasswordError && (
                                    <div className="bm_formError">
                                        Password is required
                                    </div>
                                )}
                            </div>
                            
                            <div className="bm_formActions">
                                <button
                                    type="submit"
                                    className="bm_submitButton"
                                    disabled={isLoading}
                                >
                                    {isLoading ? <LoadingSpinner /> : 'Login'}
                                </button>
                            </div>
                            
                            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                                <p>
                                    Don't have an account?{' '}
                                    <Link 
                                        to="/register" 
                                        style={{ 
                                            color: '#3D74B6', 
                                            fontWeight: '500' 
                                        }}
                                    >
                                        Register here
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        )
    }
}
