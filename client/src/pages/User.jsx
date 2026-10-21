import React, { Component } from 'react' 
import LoadingSpinner from '../components/LoadingSpinner'
import Alert from '../components/Alert'


export default class Users extends Component {
  constructor(props) {
    super(props)
    this.state = {
      users: [],
      filteredUsers: [],
      isLoading: true,
      error: null,
      searchTerm: '',
      filterLetter: '',
      showForm: false,
      isEditing: false,
      formData: { name: '', email: '' },
      editIndex: null
    }
  }

  componentDidMount() {
    this.fetchUsers()
  }

  fetchUsers = async () => {
    this.setState({ isLoading: true, error: null })

    try {
      const response = await fetch('/json/user.json')
      if (!response.ok) throw new Error('Failed to fetch users')
      const data = await response.json()

      this.setState({ 
        users: data, 
        filteredUsers: data, 
        isLoading: false 
      })
    } catch (error) {
      this.setState({ 
        error: error.message || 'Failed to load users', 
        isLoading: false 
      })
    }
  }

  handleSearchChange = (event) => {
    const searchTerm = event.target.value
    this.setState({ searchTerm }, this.applyFilters)
  }

  handleFilterChange = (event) => {
    const filterLetter = event.target.value
    this.setState({ filterLetter }, this.applyFilters)
  }

  applyFilters = () => {
    const { users, searchTerm, filterLetter } = this.state
    let filtered = users

    if (searchTerm) {
      filtered = filtered.filter(
        u =>
          u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filterLetter) {
      filtered = filtered.filter(u => u.name.startsWith(filterLetter))
    }

    this.setState({ filteredUsers: filtered })
  }

  handleInputChange = (e) => {
    const { name, value } = e.target
    this.setState(prev => ({
      formData: { ...prev.formData, [name]: value }
    }))
  }

  handleAddUser = () => {
    this.setState({
      showForm: true,
      isEditing: false,
      formData: { name: '', email: '' },
      editIndex: null
    })
  }

  handleEditUser = (index) => {
    const { filteredUsers } = this.state
    this.setState({
      showForm: true,
      isEditing: true,
      formData: { ...filteredUsers[index] },
      editIndex: index
    })
  }

  handleDeleteUser = (index) => {
    const { filteredUsers, users } = this.state
    const userToDelete = filteredUsers[index]

    const updatedUsers = users.filter(u => u !== userToDelete)
    this.setState({ users: updatedUsers }, this.applyFilters)
  }

  handleFormSubmit = (e) => {
    e.preventDefault()
    const { users, isEditing, formData, editIndex, filteredUsers } = this.state

    if (isEditing) {
      const userToEdit = filteredUsers[editIndex]
      const updatedUsers = users.map(u =>
        u === userToEdit ? formData : u
      )
      this.setState({ users: updatedUsers }, () => {
        this.applyFilters()
        this.setState({ showForm: false })
      })
    } else {
      const updatedUsers = [...users, formData]
      this.setState({ users: updatedUsers }, () => {
        this.applyFilters()
        this.setState({ showForm: false })
      })
    }
  }

  render() {
    const { filteredUsers, isLoading, error, searchTerm, filterLetter, showForm, isEditing, formData } = this.state
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

    return (
      <div className="bm_usersContainer">
        <h1 className="bm_h1">Users</h1>

        <div className="bm_filters">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={this.handleSearchChange}
            className="bm_formInput"
          />

          <select
            value={filterLetter}
            onChange={this.handleFilterChange}
            className="bm_formSelect"
          >
            <option value="">All Letters</option>
            {letters.map(letter => (
              <option key={letter} value={letter}>
                {letter}
              </option>
            ))}
          </select>

          <button onClick={this.handleAddUser} className="bm_addButton">
            + Add User
          </button>
        </div>

        {error && (
          <Alert
            type="error"
            message={error}
            onClose={() => this.setState({ error: null })}
          />
        )}

        {isLoading ? (
          <LoadingSpinner message="Loading users..." />
        ) : filteredUsers.length > 0 ? (
          <table className="bm_usersTable">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, idx) => (
                <tr key={idx}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <button onClick={() => this.handleEditUser(idx)} className="bm_editButton">Edit</button>
                    <button onClick={() => this.handleDeleteUser(idx)} className="bm_deleteButton">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ textAlign: 'center', marginTop: '2rem' }}>No users found.</p>
        )}

        {showForm && (
          <div className="bm_formOverlay">
            <form onSubmit={this.handleFormSubmit} className="bm_userForm">
              <h2>{isEditing ? 'Edit User' : 'Add User'}</h2>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={this.handleInputChange}
                required
                className="bm_formInput"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={this.handleInputChange}
                required
                className="bm_formInput"
              />
              <div className="bm_formActions">
                <button type="submit" className="bm_submitButton">
                  {isEditing ? 'Update' : 'Add'}
                </button>
                <button type="button" onClick={() => this.setState({ showForm: false })} className="bm_cancelButton">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    )
  }
}
