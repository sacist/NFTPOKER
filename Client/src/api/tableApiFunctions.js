import { createNewTable,joinNewTable,leaveNewTable,
    betNew,GetNewTable,startNewGame,dealNewSharedCards,shipNewWinnings,newFold,getAllNewTables,getNewTableById,
TakeNewAction,endNewRound } from "./tableApi";

export const createTable = async (blind,ante) => {
    try {
        const data = await createNewTable({ blind, ante });
        console.log(data);
        return data
    } catch (e) {
        console.error(e);
    }
};

export const joinTable = async (tableId,nickname) => {
    try {
        const data = await joinNewTable({ tableId, nickname });
        return data
    } catch (e) {
        console.error(e);
    }
};

export const leaveTable = async (tableId,nickname,type) => {
    try {
        const data = await leaveNewTable({ tableId, nickname, type });
        return data
    } catch (e) {
        console.error(e);
    }
};
export const bet = async (tableId,nickname,betAmmount) => {
    try {
        const data = await betNew({ tableId, nickname,betAmmount });
        return data
    } catch (e) {
        console.error(e);
    }
};
export const shipWinnings = async (tableId,nickname) => {
    try {
        const data = await shipNewWinnings({ tableId, nickname});
        return data
    } catch (e) {
        console.error(e);
    }
};

export const fold = async (tableId,nickname) => {
    try {
        const data = await newFold({ tableId, nickname});
        return data
    } catch (e) {
        console.error(e);
    }
};

export const getTable = async (tableId) => {
    try {
        const data = await GetNewTable({tableId});
        console.log(data);
        return data
    } catch (e) {
        console.error(e);
    }
};
export const startGame = async (tableId) => {
    try {
        const data = await startNewGame({tableId});
        console.log(data);
        return data
    } catch (e) {
        console.error(e);
    }
};

export const dealSharedCards = async (tableId) => {
    try {
        const data = await dealNewSharedCards({tableId});
        return data
    } catch (e) {
        console.error(e);
    }
};

export const getAllTables=async()=>{
    try {
        const data = await getAllNewTables();
        return data
    } catch (e) {
        console.error(e);
    }
}

export const getTableById=async(tableId,nickname)=>{
    try {
        const data = await getNewTableById({tableId,nickname});
        return data
    } catch (e) {
        console.error(e);
    }
}
export const takeAction=async(tableId,nickname,action,bet)=>{
    try {
        const data = await TakeNewAction({tableId,nickname,action,bet});
        return data
    } catch (e) {
        console.error(e);
    }
}
export const endRound = async (tableId) => {
    try {
        const data = await endNewRound({tableId});
        return data
    } catch (e) {
        console.error(e);
    }
};