const express = require('express')
const router = express.Router()
const Product = require('../models/Products')


router.get('/', async ( req , res) => {
   
  try {
    const products = await Product.find()
     console.log(products)
    res.json(products)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})


router.post('/', async (req, res) => {
  try {
    const newProduct = new Product(req.body)
    const savedProduct = await newProduct.save()
    res.status(201).json(savedProduct)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})


router.put('/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!updatedProduct) return res.status(404).json({ error: 'Product not found' })
    res.json(updatedProduct)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id)
    if (!deletedProduct) return res.status(404).json({ error: 'Product not found' })
    res.json({ message: 'Product deleted' })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

module.exports = router