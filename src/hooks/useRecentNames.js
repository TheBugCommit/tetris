import { useState } from "react";
import StorageService from "../services/StorageService";

export const useRecentNames = () => {
    const [names, setNames] = useState(() => StorageService.getRecentNames());

    const addName = (name) => {
        const updatedList = StorageService.addRecentName(name);
        setNames(updatedList);
    };

    return [names, addName];
};