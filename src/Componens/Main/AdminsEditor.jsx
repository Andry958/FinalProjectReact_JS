import React, { useContext, useState } from 'react';
import { Button, Popconfirm, Space, Table, message, Switch, Select } from 'antd';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import Search from 'antd/es/transfer/search';

const sortOptions = [
  { value: 'name', label: 'Імʼя' },
  { value: 'email', label: 'Email' },
  { value: 'username', label: 'Username' },
];

export default function AdminsEditor() {
  const { user, users, setUsers } = useContext(UserContext);
  const [messageApi, contextHolder] = message.useMessage();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const onDelete = (username) => {
    setUsers(users.filter(u => u.username !== username));
    messageApi.success("Користувача видалено");
  };

  const onChange = (record) => (checked) => {
    const updatedUsers = users.map(u =>
      u.username === record.username
        ? { ...u, role: checked ? 'admin' : 'user' }
        : u
    );
    setUsers(updatedUsers);
    messageApi.success(`Роль користувача ${record.username} змінено`);
  };

  const filtered = users.filter(user =>
    user.name?.toLowerCase().includes(search.toLowerCase()) ||
    user.email?.toLowerCase().includes(search.toLowerCase()) ||
    user.username?.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) =>
    (a[sortBy] || '').localeCompare(b[sortBy] || '')
  );

  const columns = [
    {
      title: 'Імʼя',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Опис',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Пароль',
      dataIndex: 'password',
      key: 'password',
    },
    {
      title: 'Роль',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Дії',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Switch checked={record.role === "admin"} onChange={onChange(record)} />
          <Link to="/edit-user">
            {record.username === user.username ? (
              <Button type="primary" disabled>Редагувати (не можна)</Button>
            ) : (
              <Button type="primary">Редагувати</Button>
            )}
          </Link>
          <Popconfirm
            title="Видалити користувача?"
            description={`Ви впевнені, що хочете видалити ${record.username}?`}
            onConfirm={() => onDelete(record.username)}
            okText="Так"
            cancelText="Ні"
          >
            {record.username === user.username ? (
              <Button danger disabled>Видалити (не можна)</Button>
            ) : (
              <Button danger>Видалити</Button>
            )}
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <div style={{ marginBottom: 16 }}>
        <Search
          placeholder="Пошук користувача..."
          allowClear
          onChange={e => setSearch(e.target.value)}
          style={{ width: 300, marginRight: 16 }}
        />
        <Select
          value={sortBy}
          onChange={setSortBy}
          options={sortOptions}
          style={{ width: 180, marginTop:20 }}
        />
      </div>

      <h2>Список користувачів</h2>

      <Table
        columns={columns}
        dataSource={sorted.map((u, i) => ({ ...u, key: u.username || i }))}
      />
    </>
  );
}
