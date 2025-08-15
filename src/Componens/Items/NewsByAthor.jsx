import React, { useState, useContext, useEffect, useMemo } from 'react';
import { Input, Select } from 'antd';
import { AllNewsContext } from '../context/AllContext';
import NewsCards from './NewsCards';
import { SourcesContext } from '../context/SourcesContext';
import { UserContext } from '../context/UserContext';
import { FavoriteContext } from '../context/favorite.context';
import { getFavUsers } from '../Services/FavoritesUsers.service';

const { Search } = Input;

const sortOptions = [
    { value: 'title', label: 'Назва' },
    { value: 'publishedAt', label: 'Дата' },
    { value: 'author', label: 'Автор' },
];

export default function NewsByAuthor() {
    const { names } = useContext(FavoriteContext);
    const { value } = useContext(AllNewsContext);
    const { sources } = useContext(SourcesContext);
    const { user } = useContext(UserContext);

    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('publishedAt');
    const [selectedSource, setSelectedSource] = useState('');
    const [userSources, setUserSources] = useState([]);


    useEffect(() => {
        if (user.username) {
            const favUsers = getFavUsers();
            const currentUser = favUsers.find(u => u.username === user.username);
            const sources = currentUser?.sourcesUser || [];
            setUserSources(sources);
        } else {
            setUserSources([]);
        }
    }, [user.username]);

    const filtered = useMemo(() => {
        if (userSources.length === 0) return [];

        return value.filter(news => {
            const matchesSearch = news.title?.toLowerCase().includes(search.toLowerCase()) ||
                news.description?.toLowerCase().includes(search.toLowerCase());

            const matchesSource = selectedSource === '' || news.source?.name === selectedSource;

            const matchesUserSources = userSources.includes(news.source?.name);

            return matchesSearch && matchesSource && matchesUserSources;
        });
    }, [value, search, selectedSource, userSources]);

    const sorted = useMemo(() => {
        return [...filtered].sort((a, b) => {
            if (sortBy === 'publishedAt') {
                return new Date(b.publishedAt) - new Date(a.publishedAt);
            }
            if (sortBy === 'title' || sortBy === 'author') {
                return (a[sortBy] || '').localeCompare(b[sortBy] || '');
            }
            return 0;
        });
    }, [filtered, sortBy]);

    const sourceOptions = useMemo(() => {
        return [
            { value: '', label: 'Всі ваші видання' },
            ...userSources.map(src => ({ value: src, label: src }))
        ];
    }, [userSources]);

    console.log("Current user:", user);
    console.log("User sources:", userSources);
    console.log("Filtered news count:", filtered.length);

    return (
        <>
            {user ? (
                <div style={{ marginBottom: 24 }}>
                    <div style={{ marginBottom: 16 }}>
                        <Search
                            placeholder="Пошук новин..."
                            allowClear
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{ width: 300, marginRight: 16 }}
                        />
                        <Select
                            value={sortBy}
                            onChange={setSortBy}
                            options={sortOptions}
                            style={{ width: 180, marginRight: 16 }}
                            placeholder="Сортувати за"
                        />
                        <Select
                            value={selectedSource}
                            onChange={setSelectedSource}
                            options={sourceOptions}
                            style={{ width: 200 }}
                            placeholder="Виберіть видання"
                        />
                    </div>

                    {userSources.length === 0 ? (
                        <>
                            <h2>У вас немає обраних видань</h2>
                            <h3>Оберіть видання у модальних вікнах новин</h3>
                        </>
                    ) : sorted.length === 0 ? (
                        <>
                            <h2>Новин за обраними критеріями не знайдено</h2>
                            <h3>Спробуйте змінити параметри пошуку</h3>
                        </>
                    ) : (
                        <>
                            <h3>Знайдено {sorted.length} новин з ваших обраних видань ({userSources.length})</h3>
                            <NewsCards customNews={sorted} />
                        </>
                    )}
                </div>
            ) : (
                <div style={{ textAlign: 'center', marginTop: 50 }}>
                    <h2>Увійдіть щоб бачити новини за вашими улюбленими виданнями</h2>
                </div>
            )}
        </>
    );
}