import axios from "axios";

const request = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_URL
})

request.interceptors.request.use((config)=>{
    let token = localStorage.getItem("accessToken")
    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export {request}