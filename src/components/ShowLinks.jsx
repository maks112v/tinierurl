import React, { useEffect, useState } from 'react';

import { store } from '../config/firebase';

import { Table } from 'antd';

import { useSession } from '../hooks/Auth';

export default function ShowLinks() {
  const user = useSession();

  const [docs, setDocs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let items = [];
    const unsubscribe = store
      .collection('users')
      .doc(user.uid)
      .collection('redirects')
      .onSnapshot(snapShot => {
        snapShot.forEach(getPath => {
          const { path } = getPath.data();
          store.doc(path).onSnapshot(doc => {
            const data = doc.data();
            items.push({ ...data });
          });
        });
      });
    setDocs(items);
    setIsLoading(false);
    return () => unsubscribe();
  }, []);

  console.log(docs);
  return (
    <div style={{ margin: '30px 0', backgroundColor: 'white' }}>
      <Table
        pagination={false}
        loading={isLoading}
        columns={[{ title: 'Url', dataIndex: 'url', key: 'url' }]}
        dataSource={docs}
        bordered={true}
        rowKey="id"
      />
    </div>
  );
}
