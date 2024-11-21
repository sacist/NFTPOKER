import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { leaveTable } from '../../api/tableApiFunctions';
import { useNavigate } from 'react-router-dom';


export const LeaveButton = ({ nickname, tableId, table, redirect, setRedirect, handleLeaveAttempt }) => {
  const [didUserFold, setDidUserFold] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (redirect) {
      tableLeaveHandler();
      setRedirect(false);
    }
  }, [table.gameStarted]);

  useEffect(() => {
    setDidUserFold(table.foldedPlayers.includes(nickname));
  }, [table.foldedPlayers]);
  
  const tableLeaveHandler = async () => {
    if (table.gameStarted && !didUserFold) {
      handleLeaveAttempt();
    } else {
      const response = await leaveTable(tableId, nickname,null);
      if (response) {
        navigate('/');
      }
    }
  };

  return (
      <ButtonToLeaveTable onClick={tableLeaveHandler}>
        <div style={{ cursor: 'pointer' }}>{'← Leave'}</div>
      </ButtonToLeaveTable>
  );
};

const ButtonToLeaveTable = styled.button`
  position: absolute;
  top: -50px;
  left: -20px;
  width: 300px;
  height: 60px;
  font-size: 40px;
  background: none;
  border: none;
  color: #ff8800;
  outline: #ff8800;
`;
