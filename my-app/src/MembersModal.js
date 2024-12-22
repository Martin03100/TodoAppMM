import React, { useState, useEffect } from 'react';
import './App.css';

function MembersModal({ list, setLists, user, setShowMembers }) {
  const [username, setUsername] = useState('');
  const [members, setMembers] = useState([]);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
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
        console.log('Members fetched:', data.members);
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };

    fetchMembers();
  }, [list]);

  useEffect(() => {
    const checkIfOwner = async () => {
      try {
        console.log('Checking owner with user:', user);
        const response = await fetch('http://localhost:5000/api/checkOwner', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ listId: list._id, userId: user._id })
        });
        const data = await response.json();
        setIsOwner(data.isOwner);
        console.log('Is Owner:', data.isOwner);
      } catch (error) {
        console.error('Error checking owner:', error);
      }
    };

    if (user && user._id) {
      console.log('User ID is defined:', user._id);
      checkIfOwner();
    } else {
      console.error('User ID is undefined:', user);
    }
  }, [list, user]);

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
        console.log('Member invited:', updatedList.members);
      })
      .catch(error => console.error('Error inviting member:', error));
  };

  const removeMember = (memberId) => {
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
        console.log('Member removed:', updatedList.members);
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
              {member.username} 
              {isOwner && member._id !== user._id && (
                <button className="remove-member" onClick={() => removeMember(member._id)} style={{ backgroundColor: 'yellow', color: 'black' }}>
                  Remove {member.username}
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default MembersModal;

