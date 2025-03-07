import axios from "axios"

export const axiosInstane=axios.create({
    baseURL:"http://localhost:3000",
})