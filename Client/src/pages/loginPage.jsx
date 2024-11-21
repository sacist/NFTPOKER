import React, {useState} from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import logo from '../assets/Logo.png'
import { login } from "../api/userApiFunctions";



export const LoginPage=() => {
    const navigate=useNavigate()
    const [error,setError]=useState(null)
    const [logData, setLogData] = useState({
        username:"",
        password:"",
          })
      
          const handleChange = e => {
        const { name, value } = e.target
        setLogData(prevState => ({ ...prevState, [name]: value })) 
       }

    const loginHandler=async () => {
        const res=await login(logData.username,logData.password)
        if (res && res.token){
            console.log(res);     
            localStorage.setItem("nickname",res.nickname)
            return navigate('/')
        }
        else{
            setError('wrong password or nickame')
        }
    }


  return(
    <LoginWrapper>
        <Wrapper2>
            <LogoWrapper>
                <PokerLogo src={logo} alt="Poker chip logo"/>
                <HeaderText>Poker</HeaderText>
            </LogoWrapper>
            <Wrapper3>
                <HeaderText>
                    Login To 
                    <br />
                    Your Account
                </HeaderText>
            </Wrapper3>
        </Wrapper2>

        <Wrapper1>
            <StyledInput placeholder="nickname" onChange={handleChange} onClick={()=>setError(null)} name={'username'}></StyledInput>
            <StyledInput placeholder="password" onChange={handleChange} onClick={()=>setError(null)} name={'password'}></StyledInput>
            {error && (<ErrorMessage>{error}</ErrorMessage>)}
            <StyledButton onClick={loginHandler}>Login</StyledButton>
        </Wrapper1>
    </LoginWrapper>
  )
}
const ErrorMessage=styled.p`
    color:red;
    font-size: 25px;
    align-self: flex-end;
    margin-right: 80px;
`

const StyledInput=styled.input`
    width: 450px;
    height: 45px;
    border-radius: 6px;
    border: none;
    font-size: 30px;
    margin-top: 40px;
`

const LoginWrapper=styled.div`
    width:1100px;
    height: 600px;
    background-color: #16141b;
    margin-top: 10%;
    margin-left:300px;
    display: flex;
    border-radius: 50px;
`

const Wrapper1=styled.div`
    width:600px;
    height: 600px;
    display: flex;
    flex-direction: column;
    justify-content: center;
`
const LogoWrapper=styled.div`
    width:500px;
    height: 100px;
    display: flex;
    gap: 20px;
    align-items: center;

`
const HeaderText=styled.p`
    color: white;
    font-size: 55px;
    letter-spacing: 4px;
    user-select: none;
`

const PokerLogo=styled.img`
    width:85px;
    height:85px;
    margin-left: 20px;
    user-select: none;
`
const Wrapper3=styled.div`
    width:600px;
    height: 500px;
    display: flex;
    flex-direction: column;
    gap: 40px;
    justify-content: space-between;
    align-items: center;
`
const Wrapper2=styled.div`
    width:600px;
    height: 500px;
    display: flex;
    flex-direction: column;
    gap: 40px;
    justify-content: center;
`

const StyledButton=styled.button`
    width:200px;
    height:60px;
    border-radius: 20px;
    border: none;
    align-self: flex-end;
    margin-right:45px;
    cursor: pointer;
    margin-top: 40px;
    font-size: 25px;
`