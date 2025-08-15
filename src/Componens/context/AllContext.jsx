import Password from "antd/es/input/Password";
import { createContext, useState } from "react";

const initialState = {
    value: [],
    setValue: () => { },
    selectedItem: null,
    setSelectedItem: () => { },
    passwordForAdmin: "admin123",
    setPasswordForAdmin: () => { },
};

export const AllNewsContext = createContext(initialState);

export const AllNewsProvider = ({ children }) => {
    const [value, setValue] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [passwordForAdmin, setPasswordForAdmin] = useState("admin123");

    return (
        <AllNewsContext.Provider value={{ value, setValue, selectedItem, setSelectedItem, passwordForAdmin, setPasswordForAdmin }}>
            {children}
        </AllNewsContext.Provider>
    );
}
