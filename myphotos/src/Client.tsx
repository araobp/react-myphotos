import React from 'react';

function Client() {
  
  const GetRecords = () => {
    fetch('https://myphotos1088001.herokuapp.com/records', {mode:'cors'})
    .then(res => {
      let data = res.json();
    })
  }

  GetRecords();

  return (
    <h2>Client</h2>
  );
}

export default Client;
