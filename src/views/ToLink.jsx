import React, { useState, useEffect } from 'react';

import { store } from '../config/firebase';
import { Layout, Menu, Spin, Typography, Icon } from 'antd';

import metaData from 'url-metadata';

export default function ToLInk({ match: { isExact, params }, ...rest }) {
  const [state, setState] = useState({ redirectUrl: '', isLoading: true });
  const domain = window.location.host;

  useEffect(() => {
    const unsubscribe = store
      .collection('domains')
      .limit(1)
      .where('hostname', '==', domain)
      .onSnapshot(snapShot => {
        snapShot.forEach(doc => {
          const path = doc.ref.path;
          store
            .doc(path)
            .collection('redirects')
            .doc(params.id)
            .onSnapshot(snapShot => {
              if (snapShot.exists) {
                const { url } = snapShot.data();
                metaData(url).then(res => {
                  console.log(res);
                });
                setState({ isLoading: false, redirectUrl: url });
                //window.open(url);
              } else {
                setState({
                  isLoading: false,
                  error: true,
                  message: 'Invalid Link',
                });
              }
            });
        });
      });

    return () => unsubscribe();
  }, []);

  if (state.error) {
    return (
      <Layout style={{ backgroundColor: '#F9FBFD' }}>
        <Layout.Content
          style={{
            minHeight: '100vh',
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div>
            <Icon
              type="frown"
              theme="twoTone"
              twoToneColor="#eb2f96"
              style={{ fontSize: 50, marginBottom: 20 }}
            />
            <Typography.Title style={{ fontWeight: 'bold' }}>
              <span style={{ color: '#2196F3' }}>404</span>
              <br /> Link Not Found
            </Typography.Title>
            <Typography.Title level={4} style={{ color: '#757575' }}>
              Please try another link.
            </Typography.Title>
          </div>
        </Layout.Content>
      </Layout>
    );
  }

  if (state.isLoading) {
    return (
      <Layout style={{ backgroundColor: '#F9FBFD' }}>
        <Layout.Content
          style={{
            minHeight: '100vh',
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2rem',
          }}
        >
          <div>
            <Spin size="large" />
            <Typography.Title style={{ fontWeight: 'bold' }}>
              Tinier
              <span style={{ color: '#2196F3' }}>Url</span>
            </Typography.Title>
            <Typography.Title level={4} style={{ color: '#757575' }}>
              Create and share trusted, powerful short links
            </Typography.Title>
          </div>
        </Layout.Content>
      </Layout>
    );
  }
  return (
    <Layout style={{ backgroundColor: '#F9FBFD' }}>
      <Layout.Content
        style={{
          minHeight: '100vh',
          textAlign: 'center',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div>
          <Icon
            type="smile"
            theme="twoTone"
            twoToneColor="#52c41a"
            style={{ fontSize: 50, marginBottom: 20 }}
          />
          <Typography.Title style={{ fontWeight: 'bold' }}>
            <a href={state.redirectUrl}>
              Open Link <Icon type="link" />
            </a>
          </Typography.Title>
          <Typography.Title level={4} style={{ color: '#757575' }}>
            {state.redirectUrl}
          </Typography.Title>
        </div>
      </Layout.Content>
    </Layout>
  );
}
