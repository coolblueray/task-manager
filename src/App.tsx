import React, { useState, useEffect } from 'react';
import { openDB } from 'idb';
// import { v4 as uuidv4 } from 'uuid';

interface Task {
  id: number;
  title: string;
  reminder: boolean;
}

const TaskManager = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [reminder, setReminder] = useState(false);
  const [showReminder, setShowReminder] = useState(false);

  useEffect(() => {
    const db = openDB('taskDB', 1, {
      upgrade(db) {
        db.createObjectStore('tasks', { keyPath: 'id', autoIncrement: true });
      },
    });

    db.then((db) => {
      const tx = db.transaction('tasks', 'readonly');
      const store = tx.objectStore('tasks');
      return store.getAll();
    }).then((data) => {
      setTasks(data);
    });
  }, []);

  const addTask = () => {
    const newTask: Task = {
      id: tasks.length + 1,
      title,
      reminder,
    };
    openDB('taskDB', 1).then((db) => {
      const tx = db.transaction('tasks', 'readwrite');
      const store = tx.objectStore('tasks');
      store.add(newTask);
      return tx.done;
    }).then(() => {
      setTasks([...tasks, newTask]);
      setTitle('');
      setReminder(false);
    });
  };

  const deleteTask = (id: number) => {
    openDB('taskDB', 1).then((db) => {
      const tx = db.transaction('tasks', 'readwrite');
      const store = tx.objectStore('tasks');
      store.delete(id);
      return tx.done;
    }).then(() => {
      const updatedTasks = tasks.filter((task) => task.id !== id);
      setTasks(updatedTasks);
    });
  };

  const toggleReminder = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, reminder: !task.reminder } : task
      )
    );
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-md shadow-md">
      <h1 className="text-3xl font-bold mb-4">Task Manager</h1>
      <form className="mb-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          className="w-full p-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
        />
        <div className="flex items-center mb-2">
          <input
            type="checkbox"
            checked={reminder}
            onChange={(e) => setReminder(e.target.checked)}
            className="mr-2"
          />
          <label>Reminder</label>
        </div>
        <button
          type="button"
          onClick={addTask}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring focus:border-blue-500"
        >
          Add Task
        </button>
      </form>
      <ul>
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex justify-between items-center mb-2 p-2 border border-gray-300 rounded-md"
          >
            <span
              className={`${task.reminder ? 'text-red-500' : 'text-gray-600'
                } font-bold`}
            >
              {task.title}
            </span>
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => toggleReminder(task.id)}
                className="mr-2 text-gray-600 hover:text-blue-500"
              >
                {task.reminder ? 'Disable Reminder' : 'Enable Reminder'}
              </button>
              <button
                type="button"
                onClick={() => deleteTask(task.id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => setShowReminder(!showReminder)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring focus:border-blue-500"
      >
        {showReminder ? 'Hide Reminders' : 'Show Reminders'}
      </button>
      {showReminder && (
        <ul>
          {tasks
            .filter((task) => task.reminder)
            .map((task) => (
              <li
                key={task.id}
                className="flex justify-between items-center mb-2 p-2 border border-gray-300 rounded-md"
              >
                <span className="text-red-500 font-bold">{task.title}</span>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default TaskManager;