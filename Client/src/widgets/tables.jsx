import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { getAllTables,joinTable } from "../api/tableApiFunctions";
import tableImage from "../assets/tableBackground.jpg";
import { useNavigate } from "react-router-dom";


export const Tables = () => {
  const [tables, setTables] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPlayers, setCurrentPlayers] = useState([]);
  const navigate=useNavigate()
  useEffect(() => {
    async function fetchData() {
      const response = await getAllTables();
      setTables(response);
    }
    fetchData();
  }, []);


  const handlePlayerListClick = (players) => {
    if(players.length!==0){
        setCurrentPlayers(players);
        setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentPlayers([]);
  };

  const nav=(tableId) => {
    navigate(`/table/${tableId}`)
  }
  const tableJoinHandler=async(tableId) => {
   const response=await joinTable(tableId,localStorage.getItem('nickname'))
    if(response){
      
      nav(tableId)
    }
  }

  return (
    <TablesWrapper >
      {tables.map((elem, index) => (
        <Table key={index}>
          <TableImage src={tableImage} alt="poker table"/>
          <TableOverlay onClick={()=>{tableJoinHandler(elem.tableId)}}>
            <Blind>Blind: {elem.blind}</Blind>
            <Ante>Ante: {elem.ante}</Ante>
            <TableId>Table: {elem.tableId}</TableId>
            <PlayerCount>Players: {elem.currentPlayers.length}/6</PlayerCount>
            <PlayerListIcon title="Show player list" onClick={() => handlePlayerListClick(elem.currentPlayers)}>
              ❔
            </PlayerListIcon>
          </TableOverlay>
        </Table>
      ))}

      {isModalOpen && (
        <ModalBackdrop onClick={handleCloseModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>Players List</ModalHeader>
            <PlayerList>
              {currentPlayers.map((player, idx) => (
                <Player key={idx}>{player}</Player>
              ))}
            </PlayerList>
          </ModalContent>
        </ModalBackdrop>
      )}
    </TablesWrapper>
  );
};

const TablesWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  padding: 20px;
  background-color: rgba(36, 35, 42, 1);
  user-select: none;
`;

const Table = styled.div`
  position: relative;
  width: 380px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 20px;
`;

const TableImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
`;

const TableOverlay = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  color: #fcdddd;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px;
  cursor: pointer;
`;

const Blind = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: rgba(0, 0, 0, 0.750);
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 16px;
`;

const Ante = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.750);
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 16px;
`;

const PlayerCount = styled.div`
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.750);
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 16px;
`;

const TableId = styled.div`
  position: absolute;
  bottom: 16px;
  left: 13%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.750);
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 16px;
`;

const PlayerListIcon = styled.div`
  position: absolute;
  bottom: 15px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.750);
  padding: 5px;
  border-radius: 50%;
  font-size: 16px;
  cursor: alias;
`;


const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.750);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  width: 300px;
  border-radius: 10px;
  text-align: center;
`;

const ModalHeader = styled.h3`
  margin: 0;
  color: black;
`;

const PlayerList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin-top: 15px;
  color: black;
`;

const Player = styled.li`
  margin-bottom: 10px;
  font-size: 14px;
`;


