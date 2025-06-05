import axios from "axios"
import { BASE_URL } from "../constants"
import type { User } from "../types/user"

axios.defaults.withCredentials = true

export const sendCode = (email: string) =>
  axios.post(BASE_URL+"api/auth/send-code", { email })

export const verifyCode = (email: string, code: string) =>
  axios.post(BASE_URL+"api/auth/verify-code", { email, code })

export const completeRegistration = (data: any) =>
  axios.post(BASE_URL+"api/auth/complete-registration", data)

export const getMe = () => axios.get<{ user: User }>(BASE_URL+"api/auth/me")

export const logout = () => axios.post(BASE_URL+"api/auth/logout")