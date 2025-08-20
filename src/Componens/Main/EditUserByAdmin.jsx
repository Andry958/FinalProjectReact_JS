import React, { useEffect } from 'react';
import { Button, Form, Input, Space, message, Select } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { changeUserProfile } from '../Services/FavoritesUsers.service';

const { TextArea } = Input;
const { Option } = Select;

const tailLayout = {
    wrapperCol: { offset: 4, span: 16 },
};

const EditUserByAdmin = () => {
    const api = "http://localhost:5219/api";
    
    const location = useLocation();
    const { user } = location.state || {};
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        if (user) {
            console.log("user", user);
            form.setFieldsValue({
                username: user.username,
                name: user.name,
                email: user.email,
                description: user.description,
                avatar: user.avatar,
                password: user.password,
                role: user.role,
                sourcesUser: user.sourcesUser,
            });
        }
    }, [user, form]);

    if (!user) {
        return <div>Завантаження даних користувача...</div>;
    }

    const onSubmit = async (values) => {
        const updatedUser = {
            ...user,
            username: values.username,
            name: values.name,
            email: values.email,
            description: values.description || "",
            avatar: values.avatar,
            password: values.password,
            role: values.role,
            sourcesUser: values.sourcesUser || user.sourcesUser,
        };



        try {

            const dummySetUser = () => {};
            await changeUserProfile(user.username, updatedUser, dummySetUser);
            
            messageApi.success("Користувача успішно оновлено ✅");
            navigate('/admins'); 
        } catch (error) {
            messageApi.error("Помилка при оновленні користувача");
            console.error("Error updating user:", error);
        }
    };

    const handleCancel = () => {
        navigate('/admins')
    };

    return (
        <>
            {contextHolder}
            <h2>Редагування користувача (Адміністратор)</h2>
            <p>Редагування профілю користувача: <strong>{user.name}</strong></p>
            
            <Form
                form={form}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                style={{ maxWidth: 600 }}
                onFinish={onSubmit}
            >
                <Form.Item 
                    label="Username" 
                    name="username"
                    rules={[{ required: true, message: 'Будь ласка, введіть username!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item 
                    label="Name" 
                    name="name"
                    rules={[{ required: true, message: 'Будь ласка, введіть ім\'я!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item 
                    label="Email" 
                    name="email"
                    rules={[
                        { required: true, message: 'Будь ласка, введіть email!' },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item label="Description" name="description">
                    <TextArea rows={3} placeholder="Опис користувача" />
                </Form.Item>

                <Form.Item label="Avatar" name="avatar">
                    <Input placeholder="URL аватара" />
                </Form.Item>

                <Form.Item 
                    label="Password" 
                    name="password"
                    rules={[{ required: true, message: 'Будь ласка, введіть пароль!' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item 
                    label="Role" 
                    name="role"
                    rules={[{ required: true, message: 'Будь ласка, оберіть роль!' }]}
                >
                    <Select placeholder="Оберіть роль">
                        <Option value="admin">Адміністратор</Option>
                        <Option value="user">Користувач</Option>
                        <Option value="athor">Модератор</Option>
                    </Select>
                </Form.Item>

                <Form.Item label="Sources" name="sourcesUser">
                    <Select
                        mode="multiple"
                        placeholder="Оберіть джерела"
                        style={{ width: '100%' }}
                    >
                        <Option value="default-source">Default Source</Option>
                        <Option value="CBS News">CBS News</Option>
                        <Option value="BBC News">BBC News</Option>
                        <Option value="CNN">CNN</Option>
                        <Option value="Reuters">Reuters</Option>
                    </Select>
                </Form.Item>

                <Form.Item {...tailLayout}>
                    <Space>
                        <Button type="primary" htmlType="submit">
                            Зберегти зміни
                        </Button>
                        <Button htmlType="button" onClick={handleCancel}>
                            Скасувати
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </>
    );
};

export default EditUserByAdmin;