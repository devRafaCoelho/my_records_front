import axios from 'axios'

const API_URL = 'http://localhost:3000'

const createRecord = async (data, token) => {
  try {
    const response = await axios.post(`${API_URL}/api/records`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

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

const findById = async (id, token) => {
  try {
    const response = await axios.get(`${API_URL}/api/records/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

const updateRecord = async (id, data, token) => {
  try {
    const response = await axios.put(`${API_URL}/api/records/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

const deleteRecord = async (id, token) => {
  try {
    const response = await axios.delete(`${API_URL}/api/records/${id}`, {
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
  createRecord,
  findAll,
  findById,
  updateRecord,
  deleteRecord
}
