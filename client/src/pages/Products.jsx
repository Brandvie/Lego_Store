import React, { Component } from 'react'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import { PRODUCT_CATEGORIES } from '../config/constants'

export default class Products extends Component {
  constructor(props) {
    super(props)

    this.state = {
      products: [],
      isLoading: true,
      error: null,
      searchTerm: '',
      selectedCategory: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'newest',
      inStockOnly: false,
      currentPage: 1,

      showForm: false,
      editingProduct: null,
      formData: {
        name: '',
        price: '',
        rating: '',
        quantity: '',
        category: '',
        images: ['']
      }
    }

    this.searchInputRef = React.createRef()
    this.searchTimeout = null
  }

  componentDidMount() {
    this.fetchProducts()

    const urlParams = new URLSearchParams(window.location.search)
    const category = urlParams.get('category')
    if (category) {
      this.setState({ selectedCategory: category }, () => {
        this.fetchProducts()
      })
    }
  }

  componentWillUnmount() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout)
    }
  }

  fetchProducts = async () => {
    this.setState({ isLoading: true, error: null })
    try {
      const res = await fetch('http://localhost:4000/api/products')
      if (!res.ok) throw new Error('Failed to fetch products')
      let data = await res.json()

      const { searchTerm, selectedCategory, minPrice, maxPrice, inStockOnly, sortBy } = this.state

      if (searchTerm) {
        data = data.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
      }
      if (selectedCategory) {
        data = data.filter(p => p.category === selectedCategory)
      }
      if (minPrice) {
        data = data.filter(p => p.price >= parseFloat(minPrice))
      }
      if (maxPrice) {
        data = data.filter(p => p.price <= parseFloat(maxPrice))
      }
      if (inStockOnly) {
        data = data.filter(p => p.quantity > 0)
      }
      if (sortBy === 'priceLowHigh') {
        data.sort((a, b) => a.price - b.price)
      } else if (sortBy === 'priceHighLow') {
        data.sort((a, b) => b.price - a.price)
      } else if (sortBy === 'rating') {
        data.sort((a, b) => b.rating - a.rating)
      } else if (sortBy === 'newest') {
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      }

      this.setState({ products: data, isLoading: false })
    } catch (error) {
      this.setState({ error: error.message, isLoading: false })
    }
  }

  handleFormChange = (e) => {
    const { name, value } = e.target
    this.setState(prev => ({
      formData: {
        ...prev.formData,
        [name]: value
      }
    }))
  }

  handleAddClick = () => {
    this.setState({
      showForm: true,
      editingProduct: null,
      formData: { name: '', price: '', rating: '', quantity: '', category: '', images: [''] }
    })
  }

  handleEditClick = (product) => {
    this.setState({
      showForm: true,
      editingProduct: product,
      formData: { ...product }
    })
  }

  handleFormSubmit = async (e) => {
    e.preventDefault()
    const { editingProduct, formData } = this.state

    try {
      let res
      if (editingProduct) {
        res = await fetch(`http://localhost:4000/api/products/${editingProduct._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
      } else {
        res = await fetch('http://localhost:4000/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
      }
      const savedProduct = await res.json()
      this.setState(prev => ({
        showForm: false,
        editingProduct: null,
        products: editingProduct
          ? prev.products.map(p => (p._id === savedProduct._id ? savedProduct : p))
          : [...prev.products, savedProduct]
      }))
    } catch (err) {
      alert(err.message)
    }
  }

  handleDeleteClick = async (product) => {
    if (!window.confirm(`Delete ${product.name}?`)) return
    try {
      await fetch(`http://localhost:4000/api/products/${product._id}`, { method: 'DELETE' })
      this.setState(prev => ({
        products: prev.products.filter(p => p._id !== product._id)
      }))
    } catch (err) {
      alert(err.message)
    }
  }

  handleSearchChange = (event) => {
    const searchTerm = event.target.value
    this.setState({ searchTerm })

    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout)
    }

    this.searchTimeout = setTimeout(() => {
      this.setState({ currentPage: 1 }, () => {
        this.fetchProducts()
      })
    }, 500)
  }

  handleFilterChange = (event) => {
    const { name, value, type, checked } = event.target
    const newValue = type === 'checkbox' ? checked : value

    this.setState(
      { [name]: newValue, currentPage: 1 },
      () => {
        if (['sortBy', 'selectedCategory', 'minPrice', 'maxPrice', 'inStockOnly'].includes(name)) {
          this.fetchProducts()
        }
      }
    )
  }

  clearFilters = () => {
    this.setState({
      searchTerm: '',
      selectedCategory: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'newest',
      inStockOnly: false,
      currentPage: 1
    }, () => {
      this.fetchProducts()
      if (this.searchInputRef.current) {
        this.searchInputRef.current.value = ''
      }
    })
  }

  render() {
    const {
      products,
      isLoading,
      searchTerm,
      sortBy,
      showForm,
      formData,
      selectedCategory,
      minPrice,
      maxPrice,
      inStockOnly
    } = this.state

    return (
      <main className="bm_main">
        <div className="bm_container">
          <div className="bm_header">
            <div>
              <h1 className="bm_h1">LEGO Products</h1>
              <p>Discover our complete collection of LEGO sets</p>
            </div>
            <div className="bm_controls">
              <input
                type="text"
                placeholder="Search..."
                ref={this.searchInputRef}
                defaultValue={searchTerm}
                onChange={this.handleSearchChange}
              />
              <select name="sortBy" value={sortBy} onChange={this.handleFilterChange}>
                <option value="newest">Newest</option>
                <option value="priceLowHigh">Price: Low to High</option>
                <option value="priceHighLow">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <select name="selectedCategory" value={selectedCategory} onChange={this.handleFilterChange}>
                <option value="">All Categories</option>
                {PRODUCT_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <input type="number" name="minPrice" value={minPrice} onChange={this.handleFilterChange} placeholder="Min Price" />
              <input type="number" name="maxPrice" value={maxPrice} onChange={this.handleFilterChange} placeholder="Max Price" />
              <label>
                <input type="checkbox" name="inStockOnly" checked={inStockOnly} onChange={this.handleFilterChange} /> In Stock Only
              </label>
              <button onClick={this.clearFilters}>Clear</button>
            </div>
            <button onClick={this.handleAddClick} className="bm_addButton">
              <Plus size={16}/> Add Product
            </button>
          </div>

          {showForm && (
            <form className="bm_form" onSubmit={this.handleFormSubmit}>
              <input name="name" value={formData.name} onChange={this.handleFormChange} placeholder="Name" required />
              <input name="price" type="number" value={formData.price} onChange={this.handleFormChange} placeholder="Price" required />
              <input name="rating" type="number" value={formData.rating} onChange={this.handleFormChange} placeholder="Rating" required />
              <input name="quantity" type="number" value={formData.quantity} onChange={this.handleFormChange} placeholder="Quantity" required />
              <input name="category" value={formData.category} onChange={this.handleFormChange} placeholder="Category" required />
              <input
                name="images"
                value={formData.images[0]}
                onChange={(e) => this.setState({ formData: { ...formData, images: [e.target.value] } })}
                placeholder="Image URL"
                required
              />
              <button type="submit" className="bm_submitButton">Save</button>
              <button type="button" className="bm_clearFiltersButton" onClick={() => this.setState({ showForm: false })}>Cancel</button>
            </form>
          )}

          {!isLoading && products.length > 0 && (
            <div className="bm_grid">
              {products.map((product) => (
                <div key={product._id} className="bm_card">
                  <img
                    src={
                      product.images[0].startsWith('data:') || product.images[0].startsWith('http')
                        ? product.images[0]
                        : `/images/${product.images[0]}`
                    }
                    alt={product.name}
                    className="bm_image"
                  />
                  <div className="bm_content">
                    <h2 className="bm_title">{product.name}</h2>
                    <p className="bm_text">Price: ${product.price}</p>
                    <p className="bm_text">⭐ {product.rating}</p>
                    <p className="bm_text">Stock: {product.quantity}</p>
                    <button className="bm_button" onClick={() => window.dispatchEvent(new CustomEvent('addToCart', { detail: product }))}>
                      Add to Cart
                    </button>
                    <div className="bm_actions">
                      <button onClick={() => this.handleEditClick(product)}><Edit2 size={16} /></button>
                      <button onClick={() => this.handleDeleteClick(product)}><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {isLoading && <LoadingSpinner />}
          {!isLoading && products.length === 0 && <p>No products found.</p>}
        </div>
      </main>
    )
  }
}
