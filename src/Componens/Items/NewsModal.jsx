import { CheckOutlined } from '@ant-design/icons';
import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { message } from 'antd';
import { FavoriteUsersContext } from '../context/FavoriteUsersContext';

const modalStyles = {
    backdrop: {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        zIndex: 1000,
    },
    modal: {
        background: '#fff', padding: '24px', borderRadius: '12px', maxWidth: '400px', width: '100%',
        boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
        textAlign: 'center',
    },
};

export default function NewsModal({ news, isOpen, onClose }) {
    const [messageApi, contextHolder] = message.useMessage();
    const { user } = useContext(UserContext);
    const { addSource, removeSource, isSourceFav } = useContext(FavoriteUsersContext);

    if (!isOpen || !news) return null;

    const sourceName = news.source?.name;
    const isSelected = user ? isSourceFav(user.username, sourceName) : false;
    const checkColor = isSelected ? 'green' : 'red';

    const handleCheckClick = (e) => {
        e.stopPropagation();
        if (!sourceName || !user) return;

        if (!isSelected) {
            addSource(user, sourceName);
            messageApi.success(`Джерело "${sourceName}" додано до обраного користувачем ${user.username}`);
        } else {
            removeSource(user.username, sourceName);
            messageApi.info(`Джерело "${sourceName}" видалено з обраного користувача ${user.username}`);
        }
    };

    return (
        <div style={modalStyles.backdrop} onClick={onClose}>
            {contextHolder}
            <div style={modalStyles.modal} onClick={e => e.stopPropagation()}>
                <img src={news.urlToImage} alt="news" style={{ width: '100%', borderRadius: '8px', marginBottom: '16px' }} />
                <h2>{news.title}</h2>
                <p><b>Автор:</b> {news.author ?? "Невідомий"}</p>
                <p><b>Опис:</b> {news.description}</p>
                <p><b>Дата:</b> {new Date(news.publishedAt).toLocaleString()}</p>
                <p>
                    <b>Джерело:</b> {sourceName}
                    {user && (
                        <CheckOutlined
                            style={{ color: checkColor, fontSize: 20, marginLeft: 10, cursor: 'pointer' }}
                            onClick={handleCheckClick}
                        />
                    )}
                </p>
                <a href={news.url} target="_blank" rel="noopener noreferrer">Читати повністю</a>
                <br />
                <button onClick={onClose} style={{ marginTop: '16px' }}>Закрити</button>
            </div>
        </div>
    );
}
