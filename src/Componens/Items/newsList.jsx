import React, { useEffect, useState } from 'react';
import { Button, Popconfirm, Space, Table, Tag } from 'antd';
import { useContext } from 'react';
import { AllNewsContext } from '../context/AllContext';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

import { message } from 'antd';

// f596c55597b748049467bb00fd96ecae
const apiNews = "https://newsapi.org/v2/top-headlines?country=us&apiKey=f596c55597b748049467bb00fd96ecae"

const omg = "data:image/jpeg;base64,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"
const NewsList = () => {

    const { value, setValue, selectedItem, setSelectedItem } = useContext(AllNewsContext);
    const { user } = useContext(UserContext);
    const [messageApi, contextHolder] = message.useMessage();

    const isAuthor = user?.role === 'author';
    const tableData = isAuthor
        ? value.filter(i => i.author === user.username)
        : value;

    const columns = [
        {
            title: 'Img',
            dataIndex: 'urlToImage',
            key: 'image',
            render: (text, record) =>
                text
                    ? <img src={text} alt="??" style={{ width: 150, height: 100 }} />
                    : <img src={omg} alt="??" style={{ width: 150, height: 100 }} />
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: text => <span>{text}</span>,
        },

        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            render: text => <span>{text}</span>,
        },
        {
            title: 'PublsihedAt',
            dataIndex: 'publishedAt',
            key: 'publishedAt',
            render: text => <span>{text}</span>,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Link to="/edit">
                        <Button onClick={() => setSelectedItem(record)} type="primary">Edit News</Button>
                    </Link>
                    <Popconfirm
                        title="Delete the product"
                        description={`Are you sure to delete ${record.title}?`}
                        onConfirm={() => onDelete(record.title)}
                        // onCancel={cancel}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button danger>Delete</Button>
                    </Popconfirm>
                </Space>
            ),
        },

    ];

    function onDelete(title) {
        setValue(value.filter(i => i.title != title))
    }
    return (
        <>
            {contextHolder}
            {user ?
                <>
                    <Link to="/create">
                        <Button type="primary" style={{ marginBottom: '12px' }}>Create New Product</Button>
                    </Link>
                    <h2>News List</h2>
                    <Table columns={columns} dataSource={tableData.map((item, index) => ({ ...item, key: item.title || index }))} />
                </>
                :
                <h2>Login to see the news list</h2>
            }
        </>
    )
};
export default NewsList;