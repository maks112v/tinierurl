import React, { useEffect, useState } from 'react';

import { store } from '../config/firebase';

import { Table } from 'antd';

import { useSession } from '../hooks/Auth';

export default function ShowLinks() {
  const user = useSession();

  const [docs, setDocs] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = store
      .collection('users')
      .doc(user.uid)
      .collection('redirects')
      .onSnapshot(snapShot => {
        const shorts = {};
        snapShot.forEach(doc => {
          const { path } = doc.data();
          store.doc(path).onSnapshot(doc => {
            const data = doc.data();
            console.log(data);
            shorts[doc.id] = data;
          });
        });
        setDocs(shorts);
        setIsLoading(false);
      });

    return () => unsubscribe();
  }, []);

  console.log(JSON.stringify(docs));

  return (
    <div style={{ margin: '30px 0', backgroundColor: 'white' }}>
      <Table
        pagination={false}
        loading={isLoading}
        columns={[{ title: 'Url', dataIndex: 'url', key: 'url' }]}
        dataSource={Object.values(docs)}
        bordered={true}
        rowKey="id"
      />
    </div>
  );
}
