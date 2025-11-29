import { useState } from "react";
import storageService from "../services/storageService";

export const useRecentNames = () => {
    const [names, setNames] = useState(() => storageService.getRecentNames());

    const addName = (name) => {
        const updatedList = storageService.addRecentName(name);
        setNames(updatedList);
    };

    return [names, addName];
};