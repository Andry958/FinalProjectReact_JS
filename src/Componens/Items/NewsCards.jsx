import React, { useContext, useState } from 'react';
import { Card } from 'antd';
import CardItem from './CardItem';
import { AllNewsContext } from '../context/AllContext';
import NewsModal from './NewsModal';
import { UserContext } from '../context/UserContext';
const { Meta } = Card;
// const apiNews = "https://newsapi.org/v2/top-headlines?country=us&apiKey=f596c55597b748049467bb00fd96ecae"
export default function NewsCards({ customNews}) {
    const { value } = useContext(AllNewsContext);
    const newsList = customNews || value;

    const [isOpen, setIsOpen] = useState(false);
    const [selectedNews, setSelectedNews] = useState(null);

    const openModal = (newsObj) => {
        setSelectedNews(newsObj);
        setIsOpen(true);
    };
    const closeModal = () => setIsOpen(false);

    return (
        <div className='divCard'>
            {newsList.map((i, index) =>
                <CardItem
                    key={index}
                    obj={i}
                    openModal={() => openModal(i)}
                />
            )}
            <NewsModal
                news={selectedNews}
                isOpen={isOpen}
                onClose={closeModal}
            />
            
        </div>
    )
}