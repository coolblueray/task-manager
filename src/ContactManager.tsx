import React, { useState, useEffect } from 'react';
import { openDB } from 'idb';
import { v4 as uuidv4 } from 'uuid';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
}

const ContactManager = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentContact, setCurrentContact] = useState({} as Contact);

  useEffect(() => {
    const db = openDB('contactDB', 1, {
      upgrade(db) {
        db.createObjectStore('contacts', { keyPath: 'id' });
      },
    });

    db.then((db) => {
      const tx = db.transaction('contacts', 'readonly');
      const store = tx.objectStore('contacts');
      return store.getAll();
    }).then((data) => {
      setContacts(data);
    });
  }, []);

  const handleAddContact = () => {
    const newContact: Contact = {
      id: uuidv4(),
      name,
      email,
      phone,
    };

    openDB('contactDB', 1).then((db) => {
      const tx = db.transaction('contacts', 'readwrite');
      const store = tx.objectStore('contacts');
      store.add(newContact);
      return tx.done;
    }).then(() => {
      setContacts([...contacts, newContact]);
      setName('');
      setEmail('');
      setPhone('');
    });
  };

  const handleEditContact = (contact: Contact) => {
    setIsEditing(true);
    setCurrentContact(contact);
    setName(contact.name);
    setEmail(contact.email);
    setPhone(contact.phone);
  };

  const handleUpdateContact = () => {
    const updatedContact: Contact = {
      id: currentContact.id,
      name,
      email,
      phone,
    };

    openDB('contactDB', 1).then((db) => {
      const tx = db.transaction('contacts', 'readwrite');
      const store = tx.objectStore('contacts');
      store.put(updatedContact);
      return tx.done;
    }).then(() => {
      const updatedContacts = contacts.map((contact) => {
        if (contact.id === currentContact.id) {
          return updatedContact;
        }
        return contact;
      });
      setContacts(updatedContacts);
      setIsEditing(false);
      setName('');
      setEmail('');
      setPhone('');
    });
  };

  const handleDeleteContact = (id: string) => {
    openDB('contactDB', 1).then((db) => {
      const tx = db.transaction('contacts', 'readwrite');
      const store = tx.objectStore('contacts');
      store.delete(id);
      return tx.done;
    }).then(() => {
      const updatedContacts = contacts.filter((contact) => contact.id !== id);
      setContacts(updatedContacts);
    });
  };

  return (
    <div className="max-w-md mx-auto p-4 mt-10 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-4">Contact Manager</h1>
      <form className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
          Name:
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
          Email:
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
          Phone:
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        {isEditing ? (
          <button
            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={handleUpdateContact}
          >
            Update Contact
          </button>
        ) : (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={handleAddContact}
          >
            Add Contact
          </button>
        )}
      </form>
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id} className="py-2 border-b border-gray-200">
            <div className="flex justify-between">
              <div>
                <p className="text-lg font-bold">{contact.name}</p>
                <p className="text-gray-600">{contact.email}</p>
                <p className="text-gray-600">{contact.phone}</p>
              </div>
              <div>
                <button
                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                  onClick={() => handleEditContact(contact)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                  onClick={() => handleDeleteContact(contact.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContactManager;