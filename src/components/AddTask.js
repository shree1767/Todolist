import React, { useState, useEffect } from 'react';

const AddTask = ({ isOpen, onClose, onAddTask }) => {
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');

  const handleAddTask = async () => {
    try {
      const newTask = {
        name: taskName,
        description: taskDescription,
        status: 'In-progress', 
      };
  
      const response = await fetch('https://todolist-server-sage.vercel.app/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });
  
      if (!response.ok) {
        throw new Error('Failed to add task');
      }
      onAddTask();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };
  

  return (
    <div className={`modal ${isOpen ? 'block' : 'hidden'}`}>
      <div className="bg-transparent border rounded-lg mt-5 w-[40vw] ">
        <div className="text-[18px] p-4">
          <input
            type="text"
            id="taskName"
            value={taskName}
            placeholder='Task Name'
            onChange={(e) => setTaskName(e.target.value)}
            className=" bg-transparent rounded-md w-full"
          />
        </div>

        <div className="text-[12px] px-4 pb-4">
          <input
            type="text"
            id="taskDesc"
            placeholder="Description"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            className=" bg-transparent rounded-md w-full"
          />
        </div>
        <div className="h-[0.5px] mt-2 bg-white"></div>
        <div className="flex justify-end space-x-5 px-2 text-[14px] py-3">
            <button onClick={onClose}>Cancel</button>
          <button onClick={handleAddTask} className="bg-[#DC4C4B] text-white px-4  py-1.5 rounded">
            Add Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTask