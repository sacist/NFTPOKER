import React, {useEffect } from 'react';
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

export const LoginButton=({nickname,setNickname,className})=>{
    const navigate=useNavigate()
    useEffect(() => {
        const savedNickname = localStorage.getItem('nickname');
        const savedToken= Cookies.get('token')
        
        if (savedNickname && savedToken) {
            setNickname(savedNickname);
        }else{
            setNickname(null)
        }
    }, []);

    // const handleLogout = () => {
    //     localStorage.removeItem('token');
    //     localStorage.removeItem('nickname');
    //     setNickname(null);
    // };
    

    return(
        <div>
            {nickname ?(
                    <LoginButt className={className}>{nickname}</LoginButt>
            ):(
                <LoginButt onClick={()=> {return navigate('/login')}} className={className}>Log in</LoginButt>  
            )}
        </div>
    )
}


const LoginButt=styled.button`
    border:none;
    color:white;
    font-size: 40px;
    justify-self: right;
    background: none;
`