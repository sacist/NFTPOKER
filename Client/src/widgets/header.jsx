import React, { useState, useEffect } from 'react';
import { login } from '../api/userApiFunctions';
import styled from 'styled-components'
import logo from '../assets/Logo.png'
import { LoginButton } from './loginButton';
const Header=()=> {
    const [nickname, setNickname] = useState(null);



    return (
        <HeaderWrapper>
            <PokerLogo src={logo}></PokerLogo>
            <HeaderText>Poker</HeaderText>
            <StyledLoginButton nickname={nickname} setNickname={setNickname}></StyledLoginButton>
        </HeaderWrapper>
    );
}

const HeaderWrapper=styled.header`
    width: 100%;
    height:80px;
    display: flex;
    gap:40px;
    align-items: center;
`

const PokerLogo=styled.img`
    width:70px;
    height:70px;
    margin-left:160px;
    user-select: none;
`
const HeaderText=styled.p`
    color: #ffffff;
    font-size: 45px;
    letter-spacing: 4px;
`
const StyledLoginButton=styled(LoginButton)`
    margin-left: 1220px;
    color: #c3dfda;;
    cursor: pointer;
`

export default Header;