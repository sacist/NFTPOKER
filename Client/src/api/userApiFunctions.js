import { authUser,setUserBalance,userLogin,getUserByNickname } from "./userApi";


export const auth = async (nickname,password) => {
    try {
        const data = await authUser({nickname,password});
        console.log(data);
        return data
    } catch (e) {
        console.error(e);
    }
};

export const setBalance = async (nickname,ammount) => {
    try {
        const data = await setUserBalance({nickname,ammount});
        console.log(data);
        return data
    } catch (e) {
        console.error(e);
    }
};

export const login = async (nickname,password) => {
    try {
        const data = await userLogin({nickname,password});
        return data
    } catch (e) {
        console.error(e);
    }
};

export const getUserByNick = async (nickname,token) => {
    try {
        const data = await getUserByNickname({nickname,token});
        return data
    } catch (e) {
        console.error(e);
    }
};