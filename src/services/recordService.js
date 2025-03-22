import axios from 'axios'

const API_URL = 'http://localhost:3000'

const findAll = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/api/records`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

export default {
  findAll
}
