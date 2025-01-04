import React, { useState, useEffect } from 'react';
import ShoppingList from './ShoppingList';
import { useTranslation } from 'react-i18next';
import AddListModal from './AddListModal';

function Dashboard({ user, onLogout }) {
  const { t } = useTranslation();
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [showAddList, setShowAddList] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/api/getShoppingLists?username=${user.username}`)
      .then(response => response.json())
      .then(data => setLists(data));
  }, [user.username]);

  const handleListClick = (list) => {
    setSelectedList(list);
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
          setLists(lists.filter((list) => list._id !== selectedList._id));
          setSelectedList(null);
        })
        .catch(error => console.error('Error deleting shopping list:', error));
    }
  };

  useEffect(() => {
    if (selectedList) {
      const updatedList = lists.find((l) => l.name === selectedList.name);
      setSelectedList(updatedList);
    }
  }, [lists, selectedList]);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="welcome-text">{t("welcome")}, {user.username}</h1>
        <button onClick={onLogout}>{t("logout")}</button>
      </div>
      <div className="dashboard-content">
        <button onClick={() => setShowAddList(true)}>{t("add_list")}</button>
        <div className="list-overview">
          {lists.map((list, index) => (
            <div key={index} className="list-name" onClick={() => handleListClick(list)}>
              {list.name}
            </div>
          ))}
        </div>

        {selectedList && (
          <>
            <ShoppingList
              list={selectedList}
              setLists={setLists}
              lists={lists}
              user={user}
              onDelete={deleteList}
            />
          </>
        )}
        {showAddList && <AddListModal setLists={setLists} lists={lists} user={user} setShowAddList={setShowAddList} />}
      </div>
    </div>
  );
}

export default Dashboard;
