import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface AuthState {
  token: string
}
const initialState: AuthState = {
    token: localStorage.getItem("accessToken") || ""
}
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action:PayloadAction<string>) => {
      state.token = action.payload
      localStorage.setItem("accessToken", action.payload )
    },
    logout: (state) => {
      state.token = ""
      localStorage.removeItem("accessToken" )
    },
  },
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer