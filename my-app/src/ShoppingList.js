import React, { useState } from 'react';
import MembersModal from './MembersModal';
import { useTranslation } from 'react-i18next';
import './App.css';

function ShoppingList({ list, setLists, lists, user, onDelete }) {
  const [itemName, setItemName] = useState('');
  const [showMembers, setShowMembers] = useState(false);
  const { t } = useTranslation();

  const addItem = () => {
    if (itemName) {
      fetch('http://localhost:5000/api/addItem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ listId: list._id, itemName })
      })
        .then(response => response.json())
        .then(updatedList => {
          setLists(lists.map(l => l._id === list._id ? updatedList : l));
          setItemName('');
        })
        .catch(error => console.error('Error adding item:', error));
    }
  };

  const markItemAsResolved = (itemId) => {
    fetch('http://localhost:5000/api/markItemAsResolved', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ listId: list._id, itemId })
    })
      .then(response => response.json())
      .then(updatedList => {
        setLists(lists.map(l => l._id === list._id ? updatedList : l));
      })
      .catch(error => console.error('Error marking item as resolved:', error));
  };

  const deleteItem = (itemId) => {
    fetch('http://localhost:5000/api/deleteItem', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ listId: list._id, itemId })
    })
      .then(response => response.json())
      .then(updatedList => {
        setLists(lists.map(l => l._id === list._id ? updatedList : l));
      })
      .catch(error => console.error('Error deleting item:', error));
  };

  return (
    <div>
      <h2>{list.name}</h2>
      <button onClick={onDelete}>{t("delete_list")}</button>
      <button onClick={() => setShowMembers(true)}>{t("manage_members")}</button>
      <input
        type="text"
        placeholder={t("add_item")}
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
      />
      <button onClick={addItem}>{t("add_item")}</button>
      {list.items && (
        <ul className="item-list">
          {list.items.map(item => (
            <li key={item._id} className={`item ${item.status === 'resolved' ? 'resolved' : ''}`}>
              {item.itemName}
              {item.status !== 'resolved' && <button className="mark-resolved" onClick={() => markItemAsResolved(item._id)}>✔</button>}
              <button className="remove-item" onClick={() => deleteItem(item._id)}>✖</button>
            </li>
          ))}
        </ul>
      )}
      {showMembers && <MembersModal list={list} setLists={setLists} user={user} setShowMembers={setShowMembers} />}
    </div>
  );
}

export default ShoppingList;
