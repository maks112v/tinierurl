import React, { useState, useContext, useEffect } from 'react';
import { store } from '../config/firebase';

import { Input, Card, Select, Form, Button, message } from 'antd';

import copy from 'copy-to-clipboard';

import { authContext } from '../hooks/Auth';

function validateInput({ value, type }) {
  if (type === 'url') {
    return /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(
      value,
    )
      ? 'success'
      : 'error';
  }
}

export default function AddLink() {
  const user = useContext(authContext);

  const [isLoading, setIsLoading] = useState(true);
  const [longLink, setLongLink] = useState({ value: '', val: '' });
  const [domain, setDomain] = useState('');
  const [selectDomains, setSelectDomains] = useState([]);
  function submitHandler(e) {
    e.preventDefault();
    setIsLoading(true);
    const hostName = selectDomains.find(x => x.id === domain).hostname;
    store
      .collection('domains')
      .doc(domain)
      .collection('redirects')
      .add({
        url: longLink.value,
        owner: user.uid,
        hostname: hostName,
      })
      .then(res => {
        setLongLink({ value: '', val: '' });
        setIsLoading(false);
        copy(`${hostName}/${res.id}`);
        message.success('Link Copied to Clipboard');
      });
  }

  useEffect(() => {
    const unsubscribe = store
      .collection('domains')
      .where('public', '==', true)
      .onSnapshot(snapShot => {
        let domains = [];
        snapShot.forEach(doc => {
          const id = doc.id;
          const { hostname } = doc.data();
          domains.push({ id, hostname });
        });
        setSelectDomains(domains);
        setIsLoading(false);
      });

    return () => unsubscribe();
  }, []);

  return (
    <Card
      style={{ margin: '30px 0', backgroundColor: 'white' }}
      title="Create Link"
    >
      <Form onSubmit={submitHandler}>
        <div style={{ display: 'flex' }}>
          <Form.Item
            hasFeedback
            validateStatus={longLink.val}
            style={{ marginRight: 10, flexGrow: 1 }}
          >
            <Input
              placeholder="Long Url"
              value={longLink.value}
              onChange={e =>
                setLongLink({
                  value: e.target.value,
                  val: validateInput({ value: e.target.value, type: 'url' }),
                })
              }
            />
          </Form.Item>
          <Form.Item hasFeedback style={{ width: '25%', marginRight: 10 }}>
            <Select
              showSearch
              onChange={e => setDomain(e)}
              placeholder="Select a Domain"
            >
              {selectDomains.map(({ id, hostname }) => (
                <Select.Option key={id} value={id}>
                  {hostname}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button
              disabled={
                longLink.val !== 'success' || domain === '' || isLoading
              }
              type="primary"
              loading={isLoading}
              htmlType="submit"
            >
              Submit
            </Button>
          </Form.Item>
        </div>
      </Form>
    </Card>
    // <form onSubmit={submitHandler}>
    //   <input
    //     type="text"
    //     placeholder="Long Link"
    //     value={longLink}
    //     onChange={e => setLongLink(e.target.value)}
    //     disabled={isLoading}
    //   />
    //   <select
    //     disabled={isLoading}
    //     value={domain}
    //     onChange={e => setDomain(e.target.value)}
    //   >
    //     <option value="">Select a Domain</option>
    //     {selectDomains.map(({ id, hostname }) => (
    //       <option key={id} value={id}>
    //         {hostname}
    //       </option>
    //     ))}
    //   </select>
    //   <button type="submit">Create</button>
    // </form>
  );
}
