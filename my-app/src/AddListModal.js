import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './App.css';

function AddListModal({ setLists, lists, user, setShowAddList }) {
  const { t } = useTranslation();
  const [listName, setListName] = useState('');

  const addList = () => {
    if (listName) {
      fetch('http://localhost:5000/api/createShoppingList', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: listName, owner: user.username })
      })
        .then(response => response.json())
        .then(newList => {
          setLists([...lists, newList]);
          setListName('');
          setShowAddList(false);
        })
        .catch(error => console.error('Error creating shopping list:', error));
    }
  };

  return (
    <>
      <div className="modal-overlay" onClick={() => setShowAddList(false)}></div>
      <div className="modal">
        <span className="modal-close" onClick={() => setShowAddList(false)}>✖</span>
        <h2>{t('add_new_list')}</h2>
        <input
          type="text"
          placeholder={t('list_name')}
          value={listName}
          onChange={(e) => setListName(e.target.value)}
        />
        <button onClick={addList}>{t('add')}</button>
      </div>
    </>
  );
}

export default AddListModal;
