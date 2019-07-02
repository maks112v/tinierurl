import React, { useEffect, useState } from 'react';

import { store } from '../config/firebase';

import { Table, Divider, message } from 'antd';

import { useSession } from '../hooks/Auth';

import copy from 'copy-to-clipboard';

export default function ShowLinks() {
  const user = useSession();

  const [docs, setDocs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  function copyUrl(url) {
    copy(url);
    message.success('Link Copied to Clipboard');
  }

  useEffect(() => {
    const unsubscribe = store
      .collectionGroup('redirects')
      .where('owner', '==', user.uid)
      .onSnapshot(snapshot => {
        let items = [];
        // console.log(snapshot);
        snapshot.forEach(async doc => {
          // console.log(doc);
          // const data = await store.doc(doc.ref.parent.parent.path).get();
          // console.log(data.data());
          const data = doc.data();
          items.push({
            id: doc.id,
            path: doc.ref.path,
            shortLink: `${data.hostname}/${doc.id}`,
            ...data,
          });
        });
        setDocs(items);
        setIsLoading(false);
      });

    return () => unsubscribe();
  }, []);

  return (
    <div style={{ margin: '30px 0', backgroundColor: 'white' }}>
      <Table
        pagination={false}
        loading={isLoading}
        dataSource={docs}
        bordered={true}
        rowKey="id"
      >
        <Table.Column title="Url" dataIndex="url" />
        <Table.Column title="Views" dataIndex="views" />
        <Table.Column title="Domain" dataIndex="hostname" />
        <Table.Column title="Short Link" dataIndex="shortLink" />
        <Table.Column
          title="Action"
          key="action"
          render={(text, record) => (
            <span>
              <a href="javascript:;" onClick={() => copyUrl(record.shortLink)}>
                Copy Url
              </a>
              <Divider type="vertical" />
              <a href="javascript:;">Delete</a>
            </span>
          )}
        />
      </Table>
    </div>
  );
}
