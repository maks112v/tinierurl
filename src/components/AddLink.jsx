import React from 'react';
import { store } from '../config/firebase';

export default function AddLink() {
  const allowedDomains = [];

  return (
    <>
      <form action="">
        <input type="text" placeholder="Long Link" />
        <select />
      </form>
    </>
  );
}
