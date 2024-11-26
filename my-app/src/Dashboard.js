import React, { useState, useEffect } from 'react';
import ShoppingList from './ShoppingList';

function Dashboard({ user, onLogout }) {
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/getShoppingLists?username=${user.username}`)
      .then(response => response.json())
      .then(data => setLists(data));
  }, [user.username]);

  const addList = () => {
    const newListName = prompt("Enter list name:");
    if (newListName) {
      console.log('Sending request to create shopping list:', newListName);
      fetch('http://localhost:5000/api/createShoppingList', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: newListName, owner: user.username })
      })
        .then(response => response.json())
        .then(newList => {
          console.log('New list created:', newList);
          setLists([...lists, newList]);
        })
        .catch(error => console.error('Error creating shopping list:', error));
    }
  };

  const deleteList = () => {
    if (selectedList) {
      fetch('http://localhost:5000/api/deleteShoppingList', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ listId: selectedList._id, username: user.username })
      })
        .then(response => response.json())
        .then(() => {
          setLists(lists.filter((list) => list !== selectedList));
          setSelectedList(null);
        })
        .catch(error => console.error('Error deleting shopping list:', error));
    }
  };

  const handleListClick = (list) => {
    setSelectedList(list);
  };

  useEffect(() => {
    if (selectedList) {
      const updatedList = lists.find((l) => l.name === selectedList.name);
      setSelectedList(updatedList);
    }
  }, [lists, selectedList]);

  return (
    <div className="dashboard">
      <h1>Welcome, {user.username}</h1>
      <button onClick={onLogout}>Logout</button>
      <button onClick={addList}>Add List</button>

      <div className="list-overview">
        {lists.map((list, index) => (
          <div key={index} className="list-name" onClick={() => handleListClick(list)}>
            {list.name}
          </div>
        ))}
      </div>

      {selectedList && (
        <ShoppingList
          list={selectedList}
          setLists={setLists}
          lists={lists}
          user={user}
          onDelete={deleteList}
        />
      )}
    </div>
  );
}

export default Dashboard;
