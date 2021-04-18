import axios from 'axios'
import baseURL from './baseURL'

var axiosInstance = axios.create({
  baseURL: baseURL,
});

module.exports = axiosInstance;