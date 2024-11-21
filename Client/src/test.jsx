import React from "react";
import { createTable,joinTable,leaveTable,bet,getTable,startGame,dealSharedCards,shipWinnings, fold } from "./api/tableApiFunctions";
import { auth,setBalance,login,getUserByNick } from "./api/userApiFunctions";
import { useEffect } from "react";

export const Test = () => {  
    const func =async() => {
        try {
            const data=await login('sacist33','qwert')
            localStorage.setItem('token',data.token)
            localStorage.setItem('nickname',data.nickname)
            if(localStorage.getItem('token')){
                getUserByNick('sacist33')
            }
            else{return console.log('not logged in');
            }
        } catch (e) {
            console.error(e);
            
        }
    }
    return (
        <div>
            <button onClick={func}>test</button>
        </div>
    );
};