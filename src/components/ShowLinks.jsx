import React, { useEffect } from 'react';

import { store } from '../config/firebase';

import { Table } from 'antd';

import { useSession } from '../hooks/Auth';

export default function ShowLinks() {
  const user = useSession();

  useEffect(() => {
    store
      .collection('domains')
      .where('owner', '==', user.uid)
      .onSnapshot(snapShot => {
        console.log(snapShot);
      });
  }, []);
  return (
    <div style={{ margin: '30px 0', backgroundColor: 'white' }}>
      <Table
        pagination={false}
        columns={[{ title: 'Url', dataIndex: 'url' }, {}]}
        dataSource={[{ url: 'asdfasdf', key: 1 }]}
        bordered={true}
      />
    </div>
  );
}
