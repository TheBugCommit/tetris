import apiService from './apiService'

const getRanking = async () => {
    try {
        return apiService.get('/ranking')
    } catch (error) {
        console.error(error);
        return [];
    }
};

const postRanking = async ({playerName, level, lines}) => {
    try {
        const data = {
            playerName: playerName,
            level: level,
            totalLines: lines,
        }
        const response = apiService.post('/ranking', data)
        console.log(response)
    } catch (error) {
        console.error(error);
    }
};

const rankingService = {
    getRanking,
    postRanking
}

export default rankingService