import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import { Button, EditableText, InputGroup, Toaster } from '@blueprintjs/core';

const AppToaster = Toaster.create({ position: 'top-right' });

function App() {
  const [users, setUsers] = useState([]);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newWebsite, setNewWebsite] = useState('');

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((res) => res.json())
      .then((json) => setUsers(json));
  }, []);

  function onChange(id, key, value) {
    setUsers((users) => {
      return users.map((user) => {
        return user.id === id ? { ...user, [key]: value } : user;
      });
    });
  }

  function updateUser(id) {
    const user = users.find((user) => user.id === id);
    fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        user,
      }),
      headers: {
        'Content-Type': 'application/json; charSet=UTF-8',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        AppToaster.show({
          message: 'User Updated',
          intent: 'success',
          timeout: 3000,
        });
      });
  }
  function deleteUser(id) {
    // const confirmDelete = window.confirm('Are you sure you want to delete this user?');
  
    if (confirmDelete) {
      fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
        method: 'DELETE',
      })
        .then((res) => {
          if (res.ok) {
            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
            AppToaster.show({
              message: 'User deleted',
              intent: 'success',
              timeout: 3000,
            });
          } else {
            AppToaster.show({
              message: 'Failed to delete user',
              intent: 'danger',
              timeout: 3000,
            });
          }
        })
        .catch((error) => {
          console.error('Error deleting user:', error);
          AppToaster.show({
            message: 'An error occurred while deleting user',
            intent: 'danger',
            timeout: 3000,
          });
        });
    }
  }
  

  function addUser() {
    const name = newName.trim();
    const email = newEmail.trim();
    const website = newWebsite.trim();
    if (name && email && website) {
      fetch('https://jsonplaceholder.typicode.com/users', {
        method: 'POST',
        body: JSON.stringify({
          name,
          email,
          website,
        }),
        headers: {
          'Content-Type': 'application/json; charSet=UTF-8',
        },
      })
        .then((res) => res.json())
        .then((data) => {
            setUsers([...users, data]);
          AppToaster.show({
            message: 'User added',
            intent: 'success',
            timeout: 3000,
          });
          setNewEmail('');
          setNewName('');
          setNewWebsite('');
        });
    }
  }

  return (
    <div className="App">
      <table className="bp4-html-table modifier">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Website</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>
                <EditableText
                  onChange={(value) => onChange(user.id, 'email', value)}
                  value={user.email}
                />
              </td>
              <td>
                <EditableText
                  onChange={(value) => onChange(user.id, 'website', value)}
                  value={user.website}
                />
              </td>
              <td>
                <button intent="primary" onClick={() => updateUser(user.id)}>
                  Update
                </button>
                <button intent="danger" onClick={()=>deleteUser(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td></td>
            <td>
              <InputGroup
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="EnterName..."
              />
            </td>
            <td>
              <InputGroup
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="EnterEmail..."
              />
            </td>
            <td>
              <InputGroup
                value={newWebsite}
                onChange={(e) => setNewWebsite(e.target.value)}
                placeholder="EnterWebsite..."
              />
            </td>
            <td>
              <Button intent="success" onClick={addUser}>
                Add User
              </Button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default App;
