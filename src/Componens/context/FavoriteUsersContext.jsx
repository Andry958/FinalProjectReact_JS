import { createContext, useEffect, useState } from "react";
import {
    getFavUsers,
    addSourceToUser,
    removeSourceFromUser,
    isSourceFavForUser
} from "../Services/FavoritesUsers.service";

export const FavoriteUsersContext = createContext({
    users: [],
    addSource: (userObj, source) => null,
    removeSource: (username, source) => null,
    isSourceFav: (username, source) => null,
    getUserSources: (username) => []
});

export const FavoriteUsersProvider = ({ children }) => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        setUsers(getFavUsers());
    }, []);

    const refresh = () => setUsers(getFavUsers());

    const addSource = (userObj, source) => {
        addSourceToUser(userObj, source);
        refresh();
    };

    const removeSource = (username, source) => {
        removeSourceFromUser(username, source);
        refresh();
    };

    const isSourceFav = (username, source) => isSourceFavForUser(username, source);

    const getUserSources = (username) => {
        const user = users.find(u => u.username === username);
        return user ? user.sourcesUser : [];
    };

    return (
        <FavoriteUsersContext.Provider value={{ users, addSource, removeSource, isSourceFav, getUserSources }}>
            {children}
        </FavoriteUsersContext.Provider>
    );
};
