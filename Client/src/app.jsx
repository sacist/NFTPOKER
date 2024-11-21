import { Routes,Route } from "react-router-dom"
import Header from './widgets/header'
import { Tables } from "./widgets/tables"
import { LoginPage } from "./pages/loginPage"
import { Table } from "./pages/table"
export const App=()=>{
    return(
        <Routes>
            <Route path="/login" element={
                <>
                <LoginPage></LoginPage>
                </>
            }/>
            <Route path="/" element={
                <>
                <Header></Header>
                <Tables></Tables>
                </>
            }/>
             <Route path="/table/:tableId" element={
                <>
                <Table></Table>
                </>
            }/>
        </Routes>
    )
}