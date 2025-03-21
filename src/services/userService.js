import axios from 'axios'

const API_URL = 'http://localhost:3000'

const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/api/users`, userData)
    return response.data
  } catch (error) {
    throw error.response.data
  }
}

const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/api/login`, credentials)
    return response.data
  } catch (error) {
    throw error.response.data
  }
}

export default {
  registerUser,
  login
}
