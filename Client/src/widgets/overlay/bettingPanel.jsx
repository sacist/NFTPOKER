import React, { useEffect, useState,useRef } from 'react';
import styled from 'styled-components';
import { startGame, leaveTable, takeAction, dealSharedCards, endRound } from '../../api/tableApiFunctions';
import { useNavigate } from 'react-router-dom';
import { useTabFocus } from '../../hooks/useTabFocus';

export const BettingPanel = ({ tableId, nickname, balance, table, redirect, setRedirect, turn, gameStarted }) => {
  const [sliderValue, setSliderValue] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const firstRender=useRef(true)
  const focused=useTabFocus()
  const onSliderChange = (e) => {
    setSliderValue(+e.target.value);
  };

  const onInputChange = (e) => {
    const value = e.target.value
    if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setSliderValue(value);
    }

  };

  const handleAction = async (action, betAmmount = 0) => {
    setSliderValue('')
    try {
      const response = await takeAction(tableId, nickname, action, betAmmount);

      if (response.actionCount === table.ActionSequence.length || response.actionCount === table.ActionSequence.concat(table.foldedPlayers).length) {
        const cardsResponse = await dealSharedCards(tableId);

        if (cardsResponse.flop.concat(cardsResponse.turn, cardsResponse.river).length === 5) {
          if (cardsResponse.actionCount === table.ActionSequence.length || cardsResponse.actionCount === table.ActionSequence.concat(table.foldedPlayers).length) {
            setTimeout(() => {
              endRound(tableId);
            }, 5000);
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    (async () => {
      if (firstRender.current) {
        firstRender.current = false;
        return;
      }
      
      if (!table.gameStarted && !(table.currentPlayers.length===1)&&table.currentPlayers[0]==nickname) {
        
        setTimeout(() => {
          startGame(tableId)
        }, 2000);
      }
    })()
  }, [table.gameStarted,table.currentPlayers,focused])

  const placeRaise = () => handleAction('raise', +sliderValue);
  const placeBet = () => handleAction('bet', +sliderValue);
  const check = () => handleAction('check', 0);
  const callBet = () => {
    const callAmount = table.currentBet - (table.playerBets.nickname || 0);
      handleAction('call', +callAmount);
  };

  const foldCards = async () => {
    try {

      await handleAction('fold', 0);

      if (redirect) {
        const response = await leaveTable(tableId, nickname);
        if (response) {
          setRedirect(false);
          navigate('/');
        }
      }
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <PanelWrapper>
      <SliderWrapper>
        <InputSlider
          type="range"
          value={sliderValue}
          onChange={onSliderChange}
          min={0}
          step={0.1}
          max={balance}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        />
        <InputField
          type="text"
          value={sliderValue}
          onChange={onInputChange}
          step={0.1}
          min={0}
          max={balance}
          $isHovered={isHovered}
          placeholder='0'
        />
      </SliderWrapper>
      <Panel>
        {Array.isArray(table.lastAction) && table.lastAction.length === 0 || table.lastAction == 'check' ? (
          <>
            <StyledButton onClick={check} disabled={!turn || !gameStarted}>Check</StyledButton>
            <StyledButton onClick={placeBet} disabled={!turn || !gameStarted}>Bet</StyledButton>
          </>
        ) : table.lastAction == 'fold' ? (
          <>
            <StyledButton onClick={foldCards} disabled={!turn || !gameStarted}>Fold</StyledButton>
            <StyledButton onClick={callBet} disabled={!turn || !gameStarted}>Call</StyledButton>
            <StyledButton onClick={placeRaise} disabled={!turn || !gameStarted}>Raise</StyledButton>
          </>
        ) : table.lastAction == 'bet' || table.lastAction == 'raise' ? (
          <>
            <StyledButton onClick={foldCards} disabled={!turn || !gameStarted}>Fold</StyledButton>
            <StyledButton onClick={callBet} disabled={!turn || !gameStarted}>Call</StyledButton>
            <StyledButton onClick={placeRaise} disabled={!turn || !gameStarted}>Raise</StyledButton>
          </>
        ) : table.lastAction == 'call' && table.currentBet === table.playerBets[nickname] ? (
          <>
            <StyledButton onClick={check} disabled={!turn || !gameStarted}>Check</StyledButton>
            <StyledButton onClick={placeRaise} disabled={!turn || !gameStarted}>Raise</StyledButton>
          </>
        ) : (
          <>
            <StyledButton onClick={foldCards} disabled={!turn || !gameStarted}>Fold</StyledButton>
            <StyledButton onClick={callBet} disabled={!turn || !gameStarted}>Call</StyledButton>
            <StyledButton onClick={placeRaise} disabled={!turn || !gameStarted}>Raise</StyledButton>
          </>
        )}
      </Panel>
    </PanelWrapper>
  );
};

const PanelWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  bottom: -50px;
  right: 0px;
  width: 540px;
  height: 140px;
`;

const SliderWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 80px;
`;

const Panel = styled.div`
  display: flex;
  width: 540px;
  height: 90px;
  margin-top: 10px;
`;

const StyledButton = styled.button`
  width: 180px;
  height: 90px;
  font-size: 30px;
  opacity: 0.8;
  &:hover{cursor: pointer;opacity:1}
  background-color: #c7b4b4;
  border-radius: 10px;
`;

const InputSlider = styled.input`
  width: 60%;
  opacity: 0.7;
  &:hover {
    opacity: 1;
  }
  margin-left: 20px;
`;

const InputField = styled.input`
  width: 80px;
  height: 30px;
  font-size: 18px;
  text-align: center;
  background-color: gray;
  &:focus{background-color:white}
  &:hover{background-color:white}
  border-radius: 3px;
  outline: none;
  ${({ isHovered }) =>
    isHovered &&
    `
    background-color: #ffffff;
  `}
`;
