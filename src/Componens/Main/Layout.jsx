import React, { use, useContext } from 'react';
import { Breadcrumb, Layout as LayoutAntd, Menu, theme, Button } from 'antd';
import {
    DatabaseFilled,
} from '@ant-design/icons';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

import {
    HomeOutlined,
    ReadOutlined,
    BookOutlined,
    UserOutlined,
    LogoutOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import NewsModal from '../Items/NewsModal';

const { Header, Content, Footer } = LayoutAntd;


const Layout = () => {
    const { users, setUsers, setUser } = useContext(UserContext);
    const { sourcesUser, setSourcesUser } = useContext(UserContext);
    const { user, logout } = useContext(UserContext);
    const dispatch = useDispatch();

    const allNews = useSelector(state => state.account.allNews);
    const lastnews = useSelector(state => state.account.lastnews);


    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    console.log(lastnews)
    const navigate = useNavigate();

    const handleLogout = () => {
        const updatedUsers = users.map(u =>
            u.username === user.username
                ? { ...u, sourcesUser: sourcesUser }
                : u
        );
        setUsers(updatedUsers);
        setUser(null);
        setSourcesUser([]);
        logout();
        navigate("/");
    };


    const items = [
        {
            key: '1',
            label: <Link to="/home">Home</Link>,
            icon: <HomeOutlined />,
        },
        user?.role !== 'user' && user != null && {
            key: '2',
            label: <Link to="/newslist">News</Link>,
            icon: <ReadOutlined />,
        },
        user != null && {
            key: '3',
            label: <Link to="/newsbyauthor">Selected Edition</Link>,
            icon: <BookOutlined />,
        },
        user != null && {
            key: '4',
            label: <Link to="/pr">Profile</Link>,
            icon: <UserOutlined />,
        },
        user != null && {
            key: '5',
            style: { position: 'absolute', right: 0, top: 0 },
            label: <Link to="/" onClick={handleLogout}>Exit</Link>,
            icon: <LogoutOutlined />,
        },
        user == null && {
            key: '5',
            style: { position: 'absolute', right: 0, top: 0 },
            label: <Link to="/">Sing in</Link>,
            icon: <LogoutOutlined />,
        },
        user?.role === 'admin' && {
            key: '6',
            label: <Link to="/admins">Admins</Link>,
            icon: <DatabaseFilled />,
        },
        {
            key: '7',
            label: <><Button onClick={() => openModal(lastnews)}>Остання новина</Button>
            </>,
            icon: <DatabaseFilled />,

        }
    ]

    const [isOpen, setIsOpen] = useState(false);
    const [selectedNews, setSelectedNews] = useState(null);

    const openModal = (newsObj) => {
        setSelectedNews(newsObj);
        setIsOpen(true);
    };
    const closeModal = () => setIsOpen(false);
    return (
        <LayoutAntd className='Layout'>
            <Header style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                <div className='logo'>
                    <h2>News App</h2>
                </div>
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['1']}
                    items={items}
                    style={{ flex: 1, minWidth: 0 }}
                />
            </Header>
            

            <Content style={{ padding: '0 48px' }}>
                <Breadcrumb
                    style={{ margin: '16px 0' }}
                    items={[{ title: 'Home' }, { title: 'List' }, { title: 'App' }]}
                />
                <div
                    style={{
                        background: colorBgContainer,
                        minHeight: 280,
                        padding: 24,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <Outlet />
                </div>
            </Content>

            <Footer style={{ textAlign: 'center' }}>
                {/* {lastnews.title} */}
                <hr />
                Ant Design ©{new Date().getFullYear()} Created by Ant UED
            </Footer>
            <NewsModal
                news={selectedNews}
                isOpen={isOpen}
                onClose={closeModal}
            />
        </LayoutAntd>
    );
};
export default Layout;