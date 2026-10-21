export const getToken = () => {
    return localStorage.getItem("token")
}

export const setToken = (token) => {
    localStorage.setItem("token", token)
}

export const removeToken = () => {
    localStorage.removeItem("token")
}

export const getUser = () => {
    const user = localStorage.getItem("user")
    return user ? JSON.parse(user) : null
}

export const setUser = (user) => {
    localStorage.setItem("user", JSON.stringify(user))
}

export const removeUser = () => {
    localStorage.removeItem("user")
}

export const isAuthenticated = () => {
    const token = getToken()
    const user = getUser()
    return !!(token && user)
}

export const isAdmin = () => {
    const user = getUser()
    return user?.isAdmin || false
}

export const logout = () => {
    removeToken()
    removeUser()
    window.location.href = "/login"
}

export const validateEmail = (email) => {
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/
    return emailRegex.test(email)
}

export const validatePassword = (password) => {
    return password && password.length >= 6
}

export const validateRequired = (value) => {
    return value && value.toString().trim().length > 0
}

export const validatePhone = (phone) => {
    if (!phone) return true
    const phoneRegex = /^\\+?[\\d\\s\\-\\(\\)]+$/
    return phoneRegex.test(phone)
}
