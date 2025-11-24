
import axios from 'axios'

const apiInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
})

apiInstance.interceptors.response.use(
  response => response,
  error => {
    let err;
    if (error.response) {
      err = new Error(error.response.data.message || 'Error in server response');
      if(error.response.data.errors)
        err.errors = error.response.data.errors
    } else if (error.request) {
      err = new Error('Can\'t connect to server.');
    } else {
      err = new Error(error.message);
    }
    return Promise.reject(err)
  }
)

const get = async (endpoint) => {
  const response = await apiInstance.get(endpoint)
  return response.data
}

const post = async (endpoint, data) => {
  const response = await apiInstance.post(endpoint, data)
  return response.data
}

const apiService = {
  get,
  post,
}

export default apiService