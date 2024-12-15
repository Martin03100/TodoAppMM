import React, { useState, useEffect } from 'react';
import './App.css';

function MembersModal({ list, setLists, user, setShowMembers }) {
  const [username, setUsername] = useState('');
  const [members, setMembers] = useState([]);

  useEffect(() => {
    // Načítanie zoznamu členov z backendu
    const fetchMembers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/getMembers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ listId: list._id })
        });
        if (!response.ok) {
          throw new Error('Failed to fetch members');
        }
        const data = await response.json();
        setMembers(data.members);
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };

    fetchMembers();
  }, [list]);

  const inviteMember = () => {
    fetch('http://localhost:5000/api/inviteMember', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ listId: list._id, username, owner: user.username })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to invite member');
        }
        return response.json();
      })
      .then(updatedList => {
        setLists(prevLists => prevLists.map(l => l._id === list._id ? updatedList : l));
        setUsername('');
        setMembers(updatedList.members);  // Aktualizácia zoznamu členov
      })
      .catch(error => console.error('Error inviting member:', error));
  };

  const removeMember = (memberId) => {
    // API volanie pre odstránenie člena zo zoznamu
    fetch('http://localhost:5000/api/removeMember', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ listId: list._id, memberId })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to remove member');
        }
        return response.json();
      })
      .then(updatedList => {
        setLists(prevLists => prevLists.map(l => l._id === list._id ? updatedList : l));
        setMembers(updatedList.members);
      })
      .catch(error => console.error('Error removing member:', error));
  };

  return (
    <>
      <div className="modal-overlay" onClick={() => setShowMembers(false)}></div>
      <div className="modal">
        <span className="modal-close" onClick={() => setShowMembers(false)}>✖</span>
        <h2>Invite Member</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={inviteMember}>Invite</button>
        <h3>Members</h3>
        <ul>
          {members.map(member => (
            <li key={member._id} className="member-item">
              {member.username} {member._id !== user._id && <button className="remove-member" onClick={() => removeMember(member._id)}>✖</button>}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default MembersModal;
