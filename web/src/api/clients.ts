import axios from 'axios'
import type { ApiResponse, Bike } from './types'

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Адрес твоего Fiber-бэкенда
})

export const getBikes = async () => {
  const response = await api.get<ApiResponse<Bike[]>>('/bikes')
  return response.data.data
}