import apiService from './apiService'

const getRanking = async () => {
    try {
        return await apiService.get('/ranking')
    } catch (error) {
        throw new Error("Error getting global ranking")
    }
};

const postRanking = async ({playerName, level, lines}) => {
    try {
        const data = {
            playerName: playerName,
            level: level,
            totalLines: lines,
        }
        const response = await apiService.post('/ranking', data)
    } catch (error) {
        throw new Error("Error sending ranking")
    }
};

const rankingService = {
    getRanking,
    postRanking
}

export default rankingService