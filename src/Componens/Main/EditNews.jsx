import { useContext } from 'react';
import { Button, Form, Input, Space } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { AllNewsContext } from '../context/AllContext';
const { TextArea } = Input;

const tailLayout = {
    wrapperCol: { offset: 4, span: 16 },
};

const EditNews = () => {
    const { value, setValue, selectedItem } = useContext(AllNewsContext);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    if (!selectedItem) {
        return <div>Новина не вибрана для редагування</div>;
    }

    const onSubmit = (item) => {
        setValue(prevValue => {
            const index = prevValue.findIndex(v => v.title === selectedItem.title);
            if (index === -1) {
                return [item, ...prevValue];
            } else {
                const newArr = [...prevValue];
                newArr[index] = {
                    author: item.author,
                    description: item.description,
                    publishedAt: item.publishedAt,
                    source: {
                        id: item.id,
                        name: item.name,
                    },
                    title: item.title,
                    url: item.url,
                    urlToImage: item.urlToImage,
                };
                return newArr;
            }
        });
        form.resetFields();
        navigate('/newslist');
    };

    return (
        <>
            <h2>Edit News</h2>
            <Form
                form={form}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                style={{ maxWidth: 600 }}
                onFinish={onSubmit}
                initialValues={{
                    title: selectedItem.title,
                    author: selectedItem.author,
                    description: selectedItem.description,
                    publishedAt: selectedItem.publishedAt,
                    id: selectedItem.source?.id ?? '',
                    name: selectedItem.source?.name ?? '',
                    url: selectedItem.url,
                    urlToImage: selectedItem.urlToImage,
                }}
            >
                <Form.Item label="Title" name="title">
                    <Input />
                </Form.Item>
                <Form.Item label="Author" name="author">
                    <Input />
                </Form.Item>
                <Form.Item label="Description" name="description">
                    <TextArea rows={3} />
                </Form.Item>
                <Form.Item label="PublishedAt" name="publishedAt">
                    <Input />
                </Form.Item>
                <h3>Source</h3>
                <Form.Item label="Id" name="id">
                    <Input />
                </Form.Item>
                <Form.Item label="Name" name="name">
                    <Input />
                </Form.Item>
                <h3>Url</h3>
                <Form.Item label="Url for news" name="url">
                    <Input />
                </Form.Item>
                <Form.Item name="urlToImage" label="UrlToImage">
                    <Input placeholder="Enter product image URL" />
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Space>
                        <Button type="primary" htmlType="submit">
                            Edit
                        </Button>
                        <Button htmlType="button" onClick={() => navigate('/newslist')}>
                            Cancel
                        </Button>
                        <Link to="/newslist">Back</Link>
                    </Space>
                </Form.Item>
            </Form>
        </>
    );
};

export default EditNews;