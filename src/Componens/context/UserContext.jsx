import { createContext, useState } from "react";

export const UserContext = createContext({
    user: null,
    setUser: () => {},
    users: [],
    setUsers: () => {},
    logout: () => {},
    roles: ['user', 'admin', 'author'],
    sourcesUser: [],
    setSourcesUser: () => {},
});

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [users, setUsers] = useState([]);
    const roles = ['user', 'admin', 'author'];
    const [sourcesUser, setSourcesUser] = useState([]);
    const logout = () => setUser(null);

    return (
        <UserContext.Provider value={{ user, setUser, users, setUsers, logout, roles, sourcesUser, setSourcesUser }}>
            {children}
        </UserContext.Provider>
    );
};