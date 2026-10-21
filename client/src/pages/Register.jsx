import React, { Component } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import Alert from '../components/Alert'
import LoadingSpinner from '../components/LoadingSpinner'
import { apiRequest } from '../utils/api'
import { setToken, setUser, isAuthenticated, validateEmail, validatePassword, validateRequired, validatePhone } from '../utils/auth'
import { API_ENDPOINTS } from '../config/constants'

export default class Register extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            phone: '',
            showPassword: false,
            showConfirmPassword: false,
            isLoading: false,
            error: null,
            success: null,
            wasSubmittedAtLeastOnce: false,
            redirectToHome: false
        }
        
        this.firstNameInputRef = React.createRef()
    }
    
    componentDidMount() {
        if (isAuthenticated()) {
            this.setState({ redirectToHome: true })
            return
        }
        
        if (this.firstNameInputRef.current) {
            this.firstNameInputRef.current.focus()
        }
    }
    
    handleChange = (event) => {
        const { name, value } = event.target
        this.setState({ [name]: value })
    }
    
    togglePasswordVisibility = (field) => {
        this.setState(prevState => ({
            [field]: !prevState[field]
        }))
    }
    
    validateFirstName = () => {
        return validateRequired(this.state.firstName)
    }
    
    validateLastName = () => {
        return validateRequired(this.state.lastName)
    }
    
    validateEmail = () => {
        return validateEmail(this.state.email)
    }
    
    validatePassword = () => {
        return validatePassword(this.state.password)
    }
    
    validateConfirmPassword = () => {
        return this.state.password === this.state.confirmPassword && this.state.confirmPassword.length > 0
    }
    
    validatePhone = () => {
        return validatePhone(this.state.phone)
    }
    
    validate = () => {
        return {
            firstName: this.validateFirstName(),
            lastName: this.validateLastName(),
            email: this.validateEmail(),
            password: this.validatePassword(),
            confirmPassword: this.validateConfirmPassword(),
            phone: this.validatePhone()
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
        
        const { firstName, lastName, email, password, phone } = this.state
        
        const { data, error } = await apiRequest('POST', API_ENDPOINTS.AUTH.REGISTER, {
            firstName,
            lastName,
            email,
            password,
            phone: phone || undefined
        })
        
        if (data && !error) {
            setToken(data.token)
            setUser(data.user)
            
            this.setState({ 
                success: 'Registration successful! Welcome to LEGO Store. Redirecting...',
                isLoading: false 
            })
            
            setTimeout(() => {
                this.setState({ redirectToHome: true })
            }, 2000)
        } else {
            this.setState({ 
                error: error || 'Registration failed. Please try again.',
                isLoading: false 
            })
        }
    }
    
    render() {
        const { 
            firstName,
            lastName,
            email, 
            password,
            confirmPassword,
            phone,
            showPassword,
            showConfirmPassword,
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
        const showFirstNameError = wasSubmittedAtLeastOnce && !formInputsState.firstName
        const showLastNameError = wasSubmittedAtLeastOnce && !formInputsState.lastName
        const showEmailError = wasSubmittedAtLeastOnce && !formInputsState.email
        const showPasswordError = wasSubmittedAtLeastOnce && !formInputsState.password
        const showConfirmPasswordError = wasSubmittedAtLeastOnce && !formInputsState.confirmPassword
        const showPhoneError = wasSubmittedAtLeastOnce && !formInputsState.phone
        
        return (
            <main className="bm_main">
                <div className="bm_container">
                    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
                        <form className="bm_form" onSubmit={this.handleSubmit} noValidate>
                            <h1 className="bm_formTitle">Create Your Account</h1>
                            
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
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="bm_formGroup">
                                    <label htmlFor="firstName" className="bm_formLabel">
                                        First Name
                                    </label>
                                    <input
                                        ref={this.firstNameInputRef}
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        value={firstName}
                                        onChange={this.handleChange}
                                        className={`bm_formInput ${showFirstNameError ? 'bm_error' : ''}`}
                                        placeholder="First name"
                                        required
                                    />
                                    {showFirstNameError && (
                                        <div className="bm_formError">
                                            First name is required
                                        </div>
                                    )}
                                </div>
                                
                                <div className="bm_formGroup">
                                    <label htmlFor="lastName" className="bm_formLabel">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        value={lastName}
                                        onChange={this.handleChange}
                                        className={`bm_formInput ${showLastNameError ? 'bm_error' : ''}`}
                                        placeholder="Last name"
                                        required
                                    />
                                    {showLastNameError && (
                                        <div className="bm_formError">
                                            Last name is required
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className="bm_formGroup">
                                <label htmlFor="email" className="bm_formLabel">
                                    Email Address
                                </label>
                                <input
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
                                <label htmlFor="phone" className="bm_formLabel">
                                    Phone Number (Optional)
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={phone}
                                    onChange={this.handleChange}
                                    className={`bm_formInput ${showPhoneError ? 'bm_error' : ''}`}
                                    placeholder="Enter your phone number"
                                />
                                {showPhoneError && (
                                    <div className="bm_formError">
                                        Please enter a valid phone number
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
                                        onClick={() => this.togglePasswordVisibility('showPassword')}
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
                                        Password must be at least 6 characters long
                                    </div>
                                )}
                            </div>
                            
                            <div className="bm_formGroup">
                                <label htmlFor="confirmPassword" className="bm_formLabel">
                                    Confirm Password
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={confirmPassword}
                                        onChange={this.handleChange}
                                        className={`bm_formInput ${showConfirmPasswordError ? 'bm_error' : ''}`}
                                        placeholder="Confirm your password"
                                        required
                                        style={{ paddingRight: '3rem' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => this.togglePasswordVisibility('showConfirmPassword')}
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
                                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                {showConfirmPasswordError && (
                                    <div className="bm_formError">
                                        Passwords do not match
                                    </div>
                                )}
                            </div>
                            
                            <div className="bm_formActions">
                                <button
                                    type="submit"
                                    className="bm_submitButton"
                                    disabled={isLoading}
                                >
                                    {isLoading ? <LoadingSpinner /> : 'Create Account'}
                                </button>
                            </div>
                            
                            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                                <p>
                                    Already have an account?{' '}
                                    <Link 
                                        to="/login" 
                                        style={{ 
                                            color: '#3D74B6', 
                                            fontWeight: '500' 
                                        }}
                                    >
                                        Login here
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
