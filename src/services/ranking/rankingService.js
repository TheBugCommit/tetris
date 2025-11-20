export const getRanking = async () => {
    try {
        const API_URL = ""
        const response = await fetch(`${API_URL}/ranking`);
        if (!response.ok) throw new Error("Error fetching ranking");
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const postScore = async (playerData) => {
    // fetch POST ...
};