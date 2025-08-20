import React, { useContext, useState } from 'react';
import { Button, Popconfirm, Space, Table, message, Switch, Select } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import Search from 'antd/es/transfer/search';
import { changeUserRole, deleteUser, getFavUsers } from '../Services/FavoritesUsers.service';

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

  const allUser = getFavUsers();


  const onDelete = (username) => {
    console.log("Deleting user:", username);
    deleteUser(username);
    setUsers(users.filter(u => u.username !== username));
    messageApi.success("Користувача видалено");
  };

  const onChange = (record) => (checked) => {
    const newRole = checked ? 'admin' : 'user';

    changeUserRole(record.username, newRole);

    const updatedUsers = users.map(u =>
      u.username === record.username
        ? { ...u, role: newRole }
        : u
    );

    setUsers(updatedUsers);
    messageApi.success(`Роль користувача ${record.username} змінено на ${newRole}`);
  };

  const filtered = users.filter(user =>
    user.name?.toLowerCase().includes(search.toLowerCase()) ||
    user.email?.toLowerCase().includes(search.toLowerCase()) ||
    user.username?.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) =>
    (a[sortBy] || '').localeCompare(b[sortBy] || '')
  );
    const navigate = useNavigate();

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
          {record.username === user.username ?
            <Switch checked={record.role === "admin"} disabled />
            :
            <Switch checked={record.role === "admin"} onChange={onChange(record)} />
          }
          <Link 
            to="/edituser"
            state={{ user: record }}>

            {record.username === user.username ? (
              <Button type="primary" disabled>Редагувати (не можна)</Button>
            ) : (
              <Button  type="primary">Редагувати</Button>
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
          style={{ width: 180, marginTop: 20 }}
        />
      </div>

      <h2>Список користувачів</h2>

      <Table
        columns={columns}
        dataSource={allUser.map((u, i) => ({ ...u, key: u.username || i }))}
      />
    </>
  );
}
