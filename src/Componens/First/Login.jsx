import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { FavoriteUsersContext } from "../context/FavoriteUsersContext";
import { Button, Form, Input, Space } from "antd";
import { useNavigate } from "react-router-dom";
import validateLogin from "../validation/validateLogin";
import { getFavUsers } from "../Services/FavoritesUsers.service";

export default function Login() {
  const { setUser } = useContext(UserContext);
  const { getUserSources } = useContext(FavoriteUsersContext);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  
  const allUser = getFavUsers();

  const onFinish = async ({ username, password }) => {
    const validMsg = await validateLogin(username, password);
    if (!validMsg.success) {
      alert(validMsg.message);
      return;
    }

    const found = allUser.find(u => u.username === username && u.password === password);
    if (found) {

      const sourcesUser = getUserSources(username);
      
      const u = {
        name: found.name,
        description: found.description,
        email: found.email,
        avatar: found.avatar,
        username: found.username,
        role: found.role,
        sourcesUser: sourcesUser
      };

      setUser(u);
      navigate("/home");
    } else {
      alert("Невірний логін або пароль");
    }
  };

  return (
    <Form 
      form={form} 
      layout="vertical"
      onFinish={onFinish} 
      style={{ maxWidth: 400, margin: "40px auto" }}
    >
      <Form.Item 
        label="Username" 
        name="username" 
        rules={[{ required: true, message: "Будь ласка, введіть username!" }]}
      >
        <Input />
      </Form.Item>
      
      <Form.Item 
        label="Password" 
        name="password" 
        rules={[{ required: true, message: "Будь ласка, введіть пароль!" }]}
      >
        <Input.Password />
      </Form.Item>
      
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            Увійти
          </Button>
          <Button onClick={() => navigate("/")}>
            Реєстрація
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}