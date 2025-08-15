import React, { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { FavoriteUsersContext } from "../context/FavoriteUsersContext";
import { Button, Form, Input, Space, Select } from "antd";
import { useNavigate } from "react-router-dom";
import validateLogin from "../validation/validateLogin";
import { AllNewsContext } from "../context/AllContext";

export default function Register() {
  const api = "https://localhost:5173/api/";
  const { users, setUsers, setUser, roles } = useContext(UserContext);
  const { addSource } = useContext(FavoriteUsersContext);
  const { passwordForAdmin } = useContext(AllNewsContext);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async ({ name, description, email, username, password, role, avatar }) => {
    const validMsg = await validateLogin(username, password);
    if (!validMsg.success) {
      alert(validMsg.message);
      return;
    }

    if (users.find(u => u.username === username)) {
      alert("Користувач вже існує");
      return;
    }

    if (role === "admin") {
      const password_ = prompt("Введіть пароль для адміністратора:");
      if (password_ !== passwordForAdmin) {
        alert("Невірний пароль адміністратора");
        return;
      }
    }

    const newUser = {
      name,
      description,
      email,
      username,
      password,
      role,
      sourcesUser: [],
      avatar
    };

    setUsers([...users, newUser]);
    setUser(newUser);

    const keyUsers = 'fav-users';
    const existingUsers = JSON.parse(localStorage.getItem(keyUsers) || '[]');
    existingUsers.push(newUser);
    localStorage.setItem(keyUsers, JSON.stringify(existingUsers));

    navigate("/home");
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      style={{ maxWidth: 600, margin: "40px auto" }}
    >
      <Form.Item 
        label="Name" 
        name="name" 
        rules={[{ required: true, message: "Будь ласка, введіть ім'я!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item 
        label="Description" 
        name="description" 
        rules={[{ required: true, message: "Будь ласка, введіть опис!" }]}
      >
        <Input.TextArea style={{ height: 60 }} />
      </Form.Item>

      <Form.Item 
        label="Email" 
        name="email" 
        rules={[
          { required: true, message: "Будь ласка, введіть email!" },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item 
        label="Username" 
        name="username" 
        rules={[{ required: true, message: "Будь ласка, введіть username!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item 
        label="Avatar" 
        name="avatar" 
        rules={[{ required: true, message: "Будь ласка, введіть посилання на аватар!" }]}
      >
        <Input placeholder="URL посилання на зображення" />
      </Form.Item>

      <Form.Item 
        label="Password" 
        name="password" 
        rules={[{ required: true, message: "Будь ласка, введіть пароль!" }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item 
        label="Role" 
        name="role" 
        rules={[{ required: true, message: "Будь ласка, оберіть роль!" }]}
      >
        <Select 
          placeholder="Оберіть роль"
          options={roles.map(r => ({ value: r, label: r }))} 
        />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            Реєстрація
          </Button>
          <Button onClick={() => navigate("/login")}>
            Увійти
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}