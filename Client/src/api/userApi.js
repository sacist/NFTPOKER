import axios from 'axios'


const URL='http://localhost:5000'

const axiosInstance = axios.create({
    baseURL: URL,
    withCredentials: true,
  });

export async function authUser({nickname,password}) {
    try {
        const res = await axiosInstance.post(`/user/auth`,{nickname,password})
        return res.data
    } catch (e) {
        console.log(e);
        throw e
    }
}

export async function setUserBalance({nickname,ammount}) {
    try {
        const res = await axiosInstance.post(`/user/setBalance`,{nickname,ammount})
        return res.data
    } catch (e) {
        console.log(e);
        throw e
    }
}

export async function userLogin({nickname,password}) {
    try {
        const res = await axiosInstance.post(`/user/login`,{nickname,password})
        return res.data
    } catch (e) {
        console.log(e);
        throw e
    }
}

export async function getUserByNickname({nickname,token}){
    try {
        const res=await axiosInstance.get(`/user/getUserByNickname/${nickname}`)
        return res.data
    } catch (e) {
        console.log(e);
        throw e
    }
}

