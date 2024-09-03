// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    // const response = await fetch('http://localhost:3000/');
    const response = await fetch('https://crud-wuzh.onrender.com');
    const data = await response.json();
    setUsers(data.data);
  };

  const addUser = async () => {
    const response = await fetch('https://crud-wuzh.onrender.com/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, name }),
    });

    if (response.ok) {
      fetchUsers();
      setId("");
      setName("");
    }
  };

  const deleteUser = async (id) => {
    const response = await fetch('https://crud-wuzh.onrender.com/remove', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });

    if (response.ok) {
      fetchUsers();
    }
  };

  const editUser = (user) => {
    setEditingUser(user);
    setId(user.id);
    setName(user.name);
  };

  const updateUser = async () => {
    const response = await fetch(`https://crud-wuzh.onrender.com/${editingUser.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, name }),
    });

    if (response.ok) {
      fetchUsers();
      setEditingUser(null);
      setId("");
      setName("");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      
      <div className="mb-4">
        <input
          className="border p-2 mr-2"
          placeholder="ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
          disabled={!!editingUser} // Disable editing the ID when updating
        />
        <input
          className="border p-2 mr-2"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {editingUser ? (
          <button onClick={updateUser} className="bg-green-500 text-white px-4 py-2">
            Update User
          </button>
        ) : (
          <button onClick={addUser} className="bg-blue-500 text-white px-4 py-2">
            Add User
          </button>
        )}
      </div>

      <ul>
        {users.map((user) => (
          <li key={user.id} className="flex justify-between items-center mb-2">
            <span>{user.name}</span>
            <div>
              <button
                onClick={() => editUser(user)}
                className="bg-yellow-500 text-white px-4 py-2 mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => deleteUser(user.id)}
                className="bg-red-500 text-white px-4 py-2"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
