import { useContext } from 'react';

import { UserContext } from '../context/UserContext';
import SearchSortNews from './SearchSortNews';

export default function Home() {
    return (
        <>
            <SearchSortNews />
        </>
    )
}
