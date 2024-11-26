import React, { useState, useEffect } from 'react';

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

  return (
    <div>
      <h2>Invite Member</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={inviteMember}>Invite</button>
      <button onClick={() => setShowMembers(false)}>Close</button>
      <h3>Members</h3>
      <ul>
        {members.map(member => (
          <li key={member._id}>{member.username}</li>
        ))}
      </ul>
    </div>
  );
}

export default MembersModal;
