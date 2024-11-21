import React, { useState } from 'react';
import { LeaveButton } from './LeaveTableButton';
import { BettingPanel } from './bettingPanel';
import {CustomAlert} from '../reusable/customAlert';

export const Overlay = ({ tableId, nickname, balance, table,turn,gameStarted }) => {
  const [readyToRedirect, setReadyToRedirect] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleLeaveAttempt = () => {
    setAlertMessage('You will leave after this hand');
    setShowAlert(true);
  };

  const closeAlert = () => setShowAlert(false);

  return (
    <>
      <BettingPanel
        nickname={nickname}
        tableId={tableId}
        balance={balance}
        table={table}
        redirect={readyToRedirect}
        setRedirect={setReadyToRedirect}
        turn={turn}
        gameStarted={gameStarted}
      />
      <LeaveButton
        nickname={nickname}
        tableId={tableId}
        table={table}
        redirect={readyToRedirect}
        setRedirect={setReadyToRedirect}
        handleLeaveAttempt={handleLeaveAttempt}
      />
      <CustomAlert visible={showAlert}
       onClose={closeAlert}
        message={alertMessage}
        setRedirect={setReadyToRedirect}
         />
    </>
  );
};
