import React, { useState, useEffect } from 'react';

import { store } from '../config/firebase';
import { Layout, Spin, Typography, Icon, Button, Skeleton } from 'antd';

import { Link } from 'react-router-dom';

import metaData from 'url-metadata';

export default function ToLInk({ match: { isExact, params }, ...rest }) {
  const [state, setState] = useState({
    redirectUrl: '',
    linkId: '',
    isLoading: true,
    metaData: false,
    path: '',
    error: false,
  });
  const domain = window.location.host;

  function getMeta(url) {
    metaData(`https://cors-anywhere.herokuapp.com/${url}`).then(
      function(metadata) {
        setState({
          ...state,
          redirectUrl: url,
          isLoading: false,
          metaData: {
            title: metadata.title,
            description: metadata.description,
          },
        });
      },
      function(error) {
        // failure handler
        console.log(error);
      },
    );
  }

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
              const { url, views, active } = snapShot.data();
              if (snapShot.exists && active) {
                getMeta(url);
                setState({
                  ...state,
                  isLoading: false,
                  redirectUrl: url,
                  linkId: snapShot.id,
                  path: snapShot.ref.path,
                  views: views,
                  error: false,
                  metaData: false,
                });
                if (params.options === 'd' && !document.hidden) {
                  window.open(url);
                }
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

  // Making sure stats only get updated once per reload
  useEffect(() => {
    if (!state.error && !state.isLoading) {
      store.doc(state.path).update({ views: state.views + 1 });
    }
  }, [state.error, state.isLoading]);

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
            <br />
            <Link to="/">Make A Link</Link>
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
        <div style={{ maxWidth: 600, padding: '1rem' }}>
          <Icon
            type="smile"
            theme="twoTone"
            twoToneColor="#52c41a"
            style={{ fontSize: 50, marginBottom: 20 }}
          />
          <br />

          {state.metaData && (
            <>
              <Typography.Title level={2}>
                {state.metaData.title}
              </Typography.Title>
              <Typography.Title level={4} style={{ color: '#757575' }}>
                {state.metaData.description}
              </Typography.Title>
            </>
          )}
          <Typography.Text>{state.redirectUrl}</Typography.Text>
          <br />
          <Button
            type="primary"
            icon="link"
            size="large"
            href={state.redirectUrl}
            style={{ margin: '20px 0' }}
          >
            Open Link
          </Button>
          <br />
          <Link to="/">Make A Link</Link>
        </div>
      </Layout.Content>
    </Layout>
  );
}
