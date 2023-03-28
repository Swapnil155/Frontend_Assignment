import axios from "axios"

const instance = axios.create({
    // baseURL: "http://localhost:5000",
//     baseURL: "https://backend-api-for-assignment-project-sigma.vercel.app",
    baseURL: "https://backend-api-for-assignment.onrender.com",
    headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'multipart/form-data'
    }
})

export default instance
