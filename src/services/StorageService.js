const KEYS = {
    USER_SESSION: 'tetris_user_session',
    RECENT_NAMES: 'tetris_recent_names',
};

const getUser = () => {
    try {
        const item = window.sessionStorage.getItem(KEYS.USER_SESSION);
        return item ? JSON.parse(item) : null;
    } catch (e) {
        console.error("Error getting user", e);
        return null;
    }
}

const setUser = (id, name) => {
    sessionStorage.setItem(KEYS.USER_SESSION, JSON.stringify({ id, name }));
}

const clearUser = () => {
    window.sessionStorage.removeItem(KEYS.USER_SESSION);
}

const getRecentNames = () => {
    try {
        const item = window.localStorage.getItem(KEYS.RECENT_NAMES);
        return item ? JSON.parse(item) : [];
    } catch (e) {
        return [];
    }
}

const addRecentName = (name) => {
    const currentNames = StorageService.getRecentNames();

    const newNames = [name, ...currentNames.filter(n => n !== name)].slice(0, 5);

    window.localStorage.setItem(KEYS.RECENT_NAMES, JSON.stringify(newNames));
    return newNames;
}

const StorageService = {
    getUser,
    setUser,
    clearUser,
    getRecentNames,
    addRecentName
};

export default StorageService;