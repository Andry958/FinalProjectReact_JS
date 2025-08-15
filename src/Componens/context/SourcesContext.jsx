import { createContext, useState } from "react";

export const SourcesContext = createContext({
    sources: [],
    setSources: () => {},
    selectedAuthors: [],
    setSelectedAuthors: () => {},
});

export const SourcesProvider = ({ children }) => {
    const [sources, setSources] = useState([]);
    const [selectedAuthors, setSelectedAuthors] = useState([]);
    return (
        <SourcesContext.Provider value={{ sources, setSources, selectedAuthors, setSelectedAuthors }}>
            {children}
        </SourcesContext.Provider>
    );
};