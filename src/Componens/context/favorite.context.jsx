import { createContext, useEffect, useState } from "react";
import {
    addEditionToFav,
    removeEditionFromFav,
    getFavEdition
} from "../Services/FavoritesEdition.service";

export const FavoriteContext = createContext({
    names: [],
    add: (name) => null,
    remove: (name) => null,
    isFav: (name) => null,
    getCount: () => null
});

export const FavoriteProvider = ({ children }) => {
    const [names, setNames] = useState([]);

    useEffect(() => {
        updateNames();
    }, []);

    const updateNames = () => {
        setNames(getFavEdition());
    };

    const add = (id) => {
        addEditionToFav(id);
        updateNames();
    };

    const remove = (id) => {
        removeEditionFromFav(id);
        updateNames();
    };

    const isFav = (name) => names.includes(name);
    const getCount = () => names.length;

    const value = { names, add, remove, isFav, getCount };

    return (
        <FavoriteContext.Provider value={value}>
            {children}
        </FavoriteContext.Provider>
    );
};
