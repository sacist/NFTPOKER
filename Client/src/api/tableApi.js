import axios from 'axios'
import { act } from 'react';


const URL='http://localhost:3010'
const URL_Deploy='http://79.141.65.35:3010'

const axiosInstance = axios.create({
    baseURL: URL_Deploy,
    withCredentials: true,
  });

export async function createNewTable({blind,ante}) {
    try {
        const res = await axiosInstance.post(`/table/createTable`,{blind,ante})
        return res.data
    } catch (e) {
        console.log(e);
        throw e
    }
}

export async function joinNewTable({tableId,nickname}){
    try {
        const res = await axiosInstance.post(`/table/joinTable`,{tableId,nickname})    
        return res.data
    } catch (e) {
        console.log(e);
        throw e
    }
}

export async function leaveNewTable({tableId,nickname,type}){
    try {
        const res = await axiosInstance.post(`/table/leaveTable`,{tableId,nickname,type})
        return res.data
    } catch (e) {
        console.log(e);
        throw e
    }
}

export async function betNew({tableId,nickname,betAmmount}){
    try {
        const res = await axiosInstance.post(`/table/bet`,{tableId,nickname,betAmmount})
        return res.data
    } catch (e) {
        console.log(e);
        throw e
    }
}
export async function shipNewWinnings({tableId,nickname}){
    try {
        const res=await axiosInstance.post(`/table/shipWinnings`,{tableId,nickname})
        return res.data
    } catch (e) {
        console.log(e);
        throw e
    }
}

export async function newFold({tableId,nickname}){
    try {
        const res=await axiosInstance.post(`/table/fold`,{tableId,nickname})
        return res.data
    } catch (e) {
        console.log(e);
        throw e
    }
}

export async function GetNewTable({tableId}){
    try {
        const res = await axiosInstance.get(`/table/${tableId}/getTable`)
        return res.data
    } catch (e) {
        console.log(e);
        throw e
    }
}

export async function startNewGame({tableId}){
    try {
        const res=await axiosInstance.get(`/table/${tableId}/start`)
        return res.data
    } catch (e) {
        console.log(e);
        throw e
    }
}

export async function dealNewSharedCards({tableId}){
    try {
        const res=await axiosInstance.get(`/table/${tableId}/deal`)
        return res.data
    } catch (e) {
        console.log(e);
        throw e
    }
}

export async function getAllNewTables(){
    try {
        const res=await axiosInstance.get(`/table/getAllTables`)
        return res.data
    } catch (e) {
        console.log(e);
        throw e 
    }
}

export async function getNewTableById({tableId,nickname}){
    try {
        const res=await axiosInstance.get(`/table/getTableById/${tableId}/${nickname}`)
        return res.data
    } catch (e) {
        console.log(e);
        throw e 
    }
}

export async function TakeNewAction({tableId,nickname,action,bet}){
    try {
        const res=await axiosInstance.post(`/table/takeAction`,{tableId,nickname,action,bet})
        return res.data
    } catch (e) {
        console.log(e);
        throw e
        
    }
}
export async function endNewRound({tableId}){
    try {
        const res=await axiosInstance.get(`/table/${tableId}/endRound`)
        return res.data
    } catch (e) {
        console.log(e);
        throw e
    }
}