// filepath: c:\Users\rafac\Documents\my-records\my_records_front\src\services\userService.js
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

export default {
  registerUser
}
