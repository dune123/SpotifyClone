import axios from "axios"

export const axiosInstane=axios.create({
    baseURL:import.meta.env.MODE==="developement"?"http://localhost:3000":"/api"
})