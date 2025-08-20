import React, { useContext } from "react";
import {
  Card,
  Avatar,
  Button,
  Descriptions,
  Space,
  Divider,
  Tag,
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import { UserContext } from "../context/UserContext";
import { Link } from "react-router-dom";
import { getFavUsers } from "../Services/FavoritesUsers.service";

const Profile = () => {
  const { user, sourcesUser } = useContext(UserContext);
  const allUser = getFavUsers()
  let alleditions = allUser.filter(u => u.username === user.username);
  let ed = alleditions[0].sourcesUser;
  console.log("ed", ed);
  console.log(alleditions)
  if (!user) {
    return <h2>Login to see your profile</h2>;
  }
  const userr = {
    name: user.name,
    username: user.username,
    email: user.email,
    bio: user.description,
    avatarUrl: user.avatar ?? "https://i.pravatar.cc/150?img=11",
  };

  return (
    <>


      <div style={{ padding: "24px", maxWidth: 600, margin: "0 auto" }}>
        <Card style={{ borderRadius: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.1)" }}>
          <Space direction="vertical" size="large" style={{ width: "100%", alignItems: "center" }}>
            <Avatar size={120} src={userr.avatarUrl} />
            <div style={{ textAlign: "center" }}>
              <h2>{userr.name}</h2>
              <p style={{ margin: -10, color: "gray" }}>@{userr.username}</p>
              <p style={{ maxWidth: 400, margin: "8px auto" }}>{userr.email}</p>

              <Link to="/editpr">
                <Button icon={<EditOutlined />} type="primary">
                  Редагувати профіль
                </Button>
              </Link>
            </div>

            <Divider />

            <Descriptions title="Інформація" column={1}>
              <Descriptions.Item label="Опис профілю">
                {userr.bio}
              </Descriptions.Item>
              <Descriptions.Item label="Вибрані видання">
                {alleditions.length > 0 && alleditions[0].sourcesUser?.length > 0 ? (
                  <Space wrap>
                    {alleditions[0].sourcesUser.map((src, idx) => (
                      <Tag key={idx} color="blue">
                        {src}
                      </Tag>
                    ))}
                  </Space>
                ) : (
                  "Немає вибраних видань"
                )}
              </Descriptions.Item>
            </Descriptions>
          </Space>
        </Card>
      </div>


    </>

  );
};

export default Profile; 