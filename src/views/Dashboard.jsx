import React, { useState } from 'react';

import AddLink from '../components/AddLink';

import { PageHeader, Button, Tabs, Tag, Typography, Table } from 'antd';

import { useSession, authHandler } from '../hooks/Auth';

import image1 from '../assets/pale-list-is-empty.png';
import image2 from '../assets/done-5.png';
import image3 from '../assets/success-3.png';

export default function Dashboard() {
  const user = useSession();
  function greeting() {
    const hrs = new Date().getHours();
    if (hrs < 12) {
      return 'Good Morning';
    } else if (hrs >= 12 && hrs <= 17) {
      return 'Good Afternoon';
    } else if (hrs >= 17 && hrs <= 24) {
      return 'Good Evening';
    }
  }
  const [currentTab, setCurrentTab] = useState('1');
  return (
    <>
      <PageHeader
        onBack={() => window.history.back()}
        title={`${greeting()} ${user.displayName}`}
        subTitle="Add and manage links"
        // tags={<Tag color="red">Warning</Tag>}
        extra={[
          <Button key="logout" onClick={authHandler}>
            Logout
          </Button>,
        ]}
        footer={
          <Tabs defaultActiveKey="1" onChange={e => setCurrentTab(e)}>
            <Tabs.TabPane tab="All Links" key="1" />
            <Tabs.TabPane tab="New Link" key="2" />
          </Tabs>
        }
      >
        <div
          className="wrap"
          style={{
            display: 'flex',
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          <div style={{ margin: 10 }}>
            <img src={image1} alt="" style={{ width: '100%' }} />
            <Typography.Title level={4}>
              Own + amplify your brand
            </Typography.Title>
            <Typography.Paragraph>
              Drive engagement across every device and channel. Using Tinier,
              you can create custom, recognizable call-to-action links that
              drive brand equity.
            </Typography.Paragraph>
          </div>
          <div style={{ margin: 10 }}>
            <img src={image2} alt="" style={{ width: '100%' }} />
            <Typography.Title level={4}>
              Analyze + optimize your campaigns
            </Typography.Title>
            <Typography.Paragraph>
              Turn your prospects into buyers. With Tinier, you’ll have access
              to strong data and analytics tools so you can measure your
              cross-channel performance in real-time.
            </Typography.Paragraph>
          </div>
          <div style={{ margin: 10 }}>
            <img src={image3} alt="" style={{ width: '100%' }} />
            <Typography.Title level={4}>
              Connect + inspire your customers
            </Typography.Title>
            <Typography.Paragraph>
              Engage your audience on the right channels at the right time.
              Tinier helps you build stronger relationships with the people that
              matter most.
            </Typography.Paragraph>
          </div>
        </div>
      </PageHeader>
      {currentTab === '1' && (
        <div style={{ margin: '30px 0', backgroundColor: 'white' }}>
          <Table
            pagination={false}
            columns={[{ title: 'Url', dataIndex: 'url' }, {}]}
            dataSource={[{ url: 'asdfasdf', key: 1 }]}
            bordered={true}
          />
        </div>
      )}
      {currentTab === '2' && <AddLink />}
    </>
  );
}
