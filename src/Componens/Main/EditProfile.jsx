import { useContext, useEffect } from 'react';
import { Button, Form, Input, Space, message } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { changeUserProfile } from '../Services/FavoritesUsers.service';
const { TextArea } = Input;

const tailLayout = {
    wrapperCol: { offset: 4, span: 16 },
};

const EditProfile = () => {
    const api = "http://localhost:5219/api";

    const { user, setUser } = useContext(UserContext);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        if (user) {
            console.log("user", user)
            form.setFieldsValue({
                username: user.username,
                name: user.name,
                email: user.email,
                description: user.description,
                avatar: user.avatar,
            });
        }
    }, [user, form]);

    if (!user) {
        return <div>Завантаження даних профілю...</div>;
    }

 const onSubmit = async (values) => {
    const updatedUser = {
        ...user,
        username: values.username,
        name: values.name,
        email: values.email,
        description: values.description || "",
        avatar: values.avatar
    };

    console.log("Updated user data:", updatedUser);


    changeUserProfile(user.username, updatedUser, setUser);

    messageApi.success("Профіль успішно оновлено ✅");
    navigate('/pr');
};

    return (
        <>
            {contextHolder}
            <h2>Edit Profile</h2>
            <Form
                form={form}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                style={{ maxWidth: 600 }}
                onFinish={onSubmit}
            >
                <Form.Item label="Username" name="username">
                    <Input />
                </Form.Item>
                <Form.Item label="Name" name="name">
                    <Input />
                </Form.Item>
                <Form.Item label="Email" name="email">
                    <Input />
                </Form.Item>
                <Form.Item label="Description" name="description">
                    <TextArea rows={3} />
                </Form.Item>
                <Form.Item label="Avatar" name="avatar">
                    <Input />
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Space>
                        <Button type="primary" htmlType="submit">
                            Save
                        </Button>
                        <Button htmlType="button" onClick={() => navigate('/pr')}>
                            Cancel
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </>
    );
};

export default EditProfile;