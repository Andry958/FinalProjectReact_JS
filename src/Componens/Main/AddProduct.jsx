import { useState, useContext } from 'react';
import { Button, Form, Input, Select, Space } from 'antd';
import { AllNewsContext } from '../context/AllContext';
import { Link, Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { SourcesContext } from '../context/SourcesContext';
import {  message } from 'antd';
const { TextArea } = Input;

const tailLayout = {
    wrapperCol: { offset: 4, span: 16 },
};



const AddProduct = () => {
    const { value, setValue } = useContext(AllNewsContext);
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const { sources } = useContext(SourcesContext);
    const [form] = Form.useForm();

    const { user } = useContext(UserContext);

    const onSubmit = async (values) => {
        const newProduct = {
            author: values.author ?? user.username,
            content: values.content,
            description: values.description,
            publishedAt: values.publishedAt || new Date().toISOString(),
            source: {
                id: values.id,
                name: values.name,
            },
            title: values.title,
            url: values.url,
            urlToImage: values.urlToImage,
        };

        messageApi.success(`Об'єкт з джерелом "${newProduct.source.name}" створено`);

        setValue([newProduct, ...value]);
        form.resetFields();
        navigate("/newslist");
    };
    return (
        <>
            {contextHolder}
            <h2>Create New Product</h2>
            <Form
                form={form}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                style={{ maxWidth: 600 }}
                onFinish={onSubmit}
                initialValues={{
                    publishedAt: new Date().toISOString(),
                    author: user?.role === 'author' ? user.username : '',
                }}
            >
                <Form.Item label="Title" name="title">
                    <Input />
                </Form.Item>
                {user?.role == 'author' ?
                    <Form.Item label="Author" name="author">
                        <Input disabled value="" />
                    </Form.Item>
                    :
                    <Form.Item label="Author" name="author">
                        <Input />
                    </Form.Item>
                }

                <Form.Item label="Description" name="description">
                    <TextArea rows={3} />
                </Form.Item>

                <h3>source</h3>
                <Form.Item label="Id" name="id">
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Please select a source name!' }]}
                >
                    <Select
                        options={sources.map((name, index) =>  ({ label: name, value: name, key: name }))}
                        placeholder="Select a source name"
                        allowClear
                    />
                </Form.Item>
                <h3>Url</h3>
                <Form.Item label="Url for news" name="url">
                    <Input />
                </Form.Item>
                <Form.Item
                    name="urlToImage"
                    label="UrlToImage"
                >
                    <Input placeholder="Enter product image URL" />
                </Form.Item>

                <Form.Item {...tailLayout}>
                    <Space>
                        <Button type="primary" htmlType="submit">
                            Create
                        </Button>
                        <Button htmlType="button">
                            Cancel
                        </Button>
                        <Link to="/newslist">Back</Link>
                    </Space>
                </Form.Item>
            </Form >
        </>
    );
};
export default () => <AddProduct />;