import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getTableById,shipWinnings } from '../api/tableApiFunctions';
import { getUserByNick } from '../api/userApiFunctions';
import styled from 'styled-components';
import tableTexture from '../assets/openart-image_zYxX74fa_1730800015204_raw.png';
import { Overlay } from '../widgets/overlay/overlay';
import { deepEqual } from '../functions/deepEqual';
import cardBack from '../assets/cardBack.png'
import spades from '../assets/spades.svg'
import clubs from '../assets/clubs.svg'
import diamonds from '../assets/diamonds.svg'
import hearts from '../assets/hearts.svg'

export const Table = () => {
  const [table, setTable] = useState(null);
  const [user, setUser] = useState(null);
  const { tableId } = useParams();
  const nickname = localStorage.getItem('nickname');
  const [otherPlayers, setOtherPlayers] = useState([]);
  const [playersBalances, setPlayersBalances] = useState({});
  const playersBalancesRef = useRef({});
  const [sharedCards, setSharedCards] = useState([]);
  const [foldedPlayers, setFoldedPlayers] = useState([]);
  const [hand, setHand] = useState([]);
  const [pot, setPot] = useState(null);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [playerTurn, setPlayerTurn] = useState(null)
  const playerPositions = [
    { top: -6, left: 47 },
    { top: 0, left: 13 },
    { top: 56, left: 13.5 },
    { top: 56, left: 80.8 },
    { top: 0, left: 80.5 },
  ];
    
  const updateTableData = (tableData) => {


    setFoldedPlayers(tableData.foldedPlayers || []);
    setHand(tableData.playerHands?.[nickname] || []);
    setSharedCards([
      ...(tableData.flop || []),
      ...(tableData.turn || []),
      ...(tableData.river || [])
    ]);
    setPot(tableData.pot);
    setIsGameStarted(tableData.gameStarted);
    setPlayerTurn(tableData.playerTurn[0])
  };


  const fetchBalances = async (players) => {
    const balances = {};
    for (const player of players) {
      const user = await getUserByNick(player);
      if (user && user.balance) {
        balances[player] = user.balance;
      }
    }

    if (!deepEqual(playersBalancesRef.current, balances)) {
      playersBalancesRef.current = balances;
      setPlayersBalances(balances);
    }
  };

  useEffect(() => {

    (async () => {
      const tableData = await getTableById(tableId, nickname);
      const userData = await getUserByNick(nickname);
      setTable(tableData);
      setUser(userData);
      updateTableData(tableData);
      setOtherPlayers(tableData.currentPlayers.filter((player) => player !== nickname));
    })
      ()
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {

      const tableData = await getTableById(tableId, nickname);
      const currentPlayers = tableData.currentPlayers.filter((player) => player !== nickname);

      if (JSON.stringify(currentPlayers) !== JSON.stringify(otherPlayers)) {
        setOtherPlayers(currentPlayers);
        
      }
      if (!deepEqual(table, tableData)) {
        setTable(tableData);
        updateTableData(tableData);

      }

      const userData = await getUserByNick(nickname);
      if(!deepEqual(user,userData)){

        if (userData && userData.balance !== user?.balance) {
          setUser(userData);
          
        }
      }

      if (currentPlayers.length > 0) {
        fetchBalances(currentPlayers);
      }


    }, 3000);

    return () => clearInterval(interval);
  }, [tableId, nickname, otherPlayers, user, table]);
  const roundToTwoDecimals = (num) => {
    return Math.round((num + Number.EPSILON) * 100) / 100;
  };
  // useEffect(()=>{
  //   if(table?.ActionSequence.length===1){
  //     shipWinnings(tableId,table.ActionSequence[0])
  //   }
  // },[table?.ActionSequence])
  return (
    <TableContainer>
      <PokerTable src={tableTexture} />
      {table && (
        <>
          <Player1Wrapper>
            <CurrentBet>
            {table.playerBets?.[nickname] ? (`$${roundToTwoDecimals(table.playerBets[nickname])}`):(null)}
            </CurrentBet>
            <PlayerCardWrapper>
              {(!foldedPlayers.includes(nickname) && isGameStarted) ? (
                <>
                  <Player1Card style={{ transform: 'rotate(-5deg) translateX(15px)'}} $suit={hand[0]?.slice(1,2)}>
                    {hand[0]?.slice(0,1)=='T'?10:hand[0]?.slice(0,1)}
                  </Player1Card>
                  <Player1Card style={{ transform: 'rotate(5deg) translateY(-1px)'}} $suit={hand[1]?.slice(1,2)}>
                    {hand[1]?.slice(0,1)=='T'?10:hand[1]?.slice(0,1)}
                  </Player1Card>
                </>
              ) : (
                <PlayerIcon style={{ transform: 'translateX(15px)' }}></PlayerIcon>
              )}
            </PlayerCardWrapper>
            <PlayerInfoWrapper $isGlowing={playerTurn===nickname}>
              <PlayerInfo fontSize={30}>{nickname}</PlayerInfo>
              <PlayerInfo fontSize={20}>${roundToTwoDecimals(user.balance)}</PlayerInfo>
            </PlayerInfoWrapper>
          </Player1Wrapper>

          {otherPlayers.map((player, i) => (
            <PlayerWrapper
              key={i}
              style={{
                top: `${playerPositions[i].top}%`,
                left: `${playerPositions[i].left}%`
              }}
            >
              <PlayerCardWrapper>
                {(!foldedPlayers.includes(player) && isGameStarted) ? (
                  <>
                    <PlayerCard style={{ transform: 'rotate(-5deg) translateX(15px)'}}>
                    </PlayerCard>
                    <PlayerCard style={{ transform: 'rotate(5deg) translateY(-1px)'}}>
                    </PlayerCard>
                  </>
                ) : (
                  <PlayerIcon style={{ transform: 'translateX(15px)' }}></PlayerIcon>
                )}
              </PlayerCardWrapper>
              <PlayerInfoWrapper $isGlowing={playerTurn===player}>
                <PlayerInfo fontSize={30}>{player}</PlayerInfo>
                <PlayerInfo fontSize={20}>${roundToTwoDecimals(playersBalances[player]) || 0}</PlayerInfo>
              </PlayerInfoWrapper>
              <CurrentBet style={{ marginLeft: i >= 3 ? '-130px' : '130px' }}>
                {table.playerBets?.[player] ? (`$${roundToTwoDecimals(table.playerBets[player])}`):(null)}
              </CurrentBet>
            </PlayerWrapper>
          ))}
          <SharedWrapper>
            <SharedCardsWrapper>
              {table.flop && (
                <>
                  <SharedCard $suit={sharedCards[0]?.slice(1,2)}>{sharedCards[0]?.slice(0,1)=='T'?10:sharedCards[0]?.slice(0,1) || ''}</SharedCard>
                  <SharedCard $suit={sharedCards[1]?.slice(1,2)}>{sharedCards[1]?.slice(0,1)=='T'?10:sharedCards[1]?.slice(0,1) || ''}</SharedCard>
                  <SharedCard $suit={sharedCards[2]?.slice(1,2)}>{sharedCards[2]?.slice(0,1)=='T'?10:sharedCards[2]?.slice(0,1) || ''}</SharedCard>
                  <SharedCard $suit={sharedCards[3]?.slice(1,2)}>{sharedCards[3]?.slice(0,1)=='T'?10:sharedCards[3]?.slice(0,1) || ''}</SharedCard>
                  <SharedCard $suit={sharedCards[4]?.slice(1,2)}>{sharedCards[4]?.slice(0,1)=='T'?10:sharedCards[4]?.slice(0,1)|| ''}</SharedCard>
                </>
              )}
            </SharedCardsWrapper>
            <PotAmount>{`$${roundToTwoDecimals(pot) || 0}`}</PotAmount>
          </SharedWrapper>
          <Overlay tableId={tableId}
            nickname={nickname}
            balance={user.balance}
            table={table}
            turn={playerTurn===nickname}
            gameStarted={isGameStarted}>
          </Overlay>

        </>
      )}
    </TableContainer>
  );
};

const TableContainer = styled.div`
  position: relative;
`;

const PokerTable = styled.img`
  width: 1600px;
  height: 800px;
  border-radius: 35%;
  border: 12px solid #462c1f;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  margin-top: 75px;
  margin-left: 160px;
  user-select: none;
`;

const PlayerInfoWrapper=styled.div`
  box-shadow:${(props)=>props.$isGlowing && `0px 0px 21px 8px rgba(255, 255, 255, 0.87)`} ;
  width: 150px;
`
const PlayerInfo = styled.div`
  width: 150px;
  height: 4%;
  font-size: ${(props) => props.fontSize}px;
  color: #ff8800;
  text-align: center;
  background-color: black;
`;


const PlayerIcon = styled.div`
  border: solid black 1px;
  border-radius: 50%;
  width: 150px;
  height: 150px;
`;

const Player1Wrapper = styled.div`
  position: absolute;
  top: 72.5%;
  left: 47%;
  display: flex;
  flex-direction: column;
  
`;

const PlayerWrapper = styled.div`
  position: absolute;
  font-size: 30px;
  color: #ff8800;
  display: flex;
  flex-direction: column;
`;

const SharedCardsWrapper = styled.div`
  gap: 40px;
  position: absolute;
  display: flex;
  justify-content: center;
  width: 800px;
  height: 260px;
`;

const SharedCard = styled.div`
  height: 80%;
  width: 120px;
  color:${(props)=>props.$suit=='h'||props.$suit=='d'?'#fd0000cc':'black'};
  text-align: left;
  text-indent: 5px;
  font-size: 58px;
  background-image: ${(props) => 
    props.$suit === 'd' 
    ? `url(${diamonds}), url(${diamonds})`
    : props.$suit === 'c' 
    ? `url(${clubs}), url(${clubs})`
    : props.$suit === 'h' 
    ? `url(${hearts}), url(${hearts})`
    : props.$suit === 's' 
    ? `url(${spades}), url(${spades})`
    : 'none, none'};

  background-size: 
    70% auto, 45%; 
  background-repeat: no-repeat, no-repeat; 
  background-position: 
    85% 90%,
    5% 40%;

  background-color: ${(props)=>!props.$suit ? 'none':'#f8e6e6'};
  border-radius: 15px;
`;

const Player1Card = styled.div`
  width: 50%;
  height: 150px;
  border-radius: 10%;
  color:${(props)=>props.$suit=='h'||props.$suit=='d'?'#fd0000cc':'black'};
  font-size: 40px;
  background-color:#f8e6e6 ;
  text-indent: 4px;
  background-image: ${(props) => 
    props.$suit === 'd' 
    ? `url(${diamonds}), url(${diamonds})`
    : props.$suit === 'c' 
    ? `url(${clubs}), url(${clubs})`
    : props.$suit === 'h' 
    ? `url(${hearts}), url(${hearts})`
    : props.$suit === 's' 
    ? `url(${spades}), url(${spades})`
    : 'none, none'};

  background-size: 
    70% auto, 45%; 
  background-repeat: no-repeat, no-repeat; 
  background-position: 
    85% 90%,
    5% 40%;
    box-shadow: -4px 2px 15px -3px rgba(0,0,0,0.45);
`;
const PlayerCard = styled.div`
  width: 50%;
  height: 150px;
  border-radius: 10%;
  background-image: url(${cardBack});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  box-shadow: -4px 2px 15px -3px rgba(0, 0, 0, 0.45);
  border: 1px solid black;
  
  @media (min-width: 768px) {
    background-size: cover; 
  }
`;

const PlayerCardWrapper = styled.div`
  display: flex;
  width: 170px;
  height: 150px;
  border-radius: 10%;
  transform: translateX(-17px);
`;

const SharedWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  top: 29%;
  left: 30%;
  width: 800px;
  height: 260px;
`
const PotAmount = styled.div`
  margin-top: 270px;
  font-size: 40px;
  color: white;
  text-align: center;
  border-radius: 20px;
  background-color: #0000009d;
  min-width: 80px;
`;

const CurrentBet = styled.div`
  height: 4%;
  font-size: 30px;
  color: #fcd8c7;
  text-align: center;
  border-radius: 20px;
  background-color: #0000009d;
  min-width: 60px;
  margin-left: 160px;
`;