require('dotenv').config({ path: './config/.env' })

const express = require('express')
const cors = require('cors')
const path = require('path')

require('./config/db')



const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors({
    credentials: true,
    origin: true
}))

const productRoutes = require('./routes/products')
app.use('/api/products', productRoutes)

app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'LEGO Store API is running',
        timestamp: new Date().toISOString()
    })
})



const PORT = process.env.SERVER_PORT || 4000

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`)
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
})
