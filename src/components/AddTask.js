import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";

const AddTask = ({ isOpen, onClose, onAddTask }) => {
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");

  const handleAddTask = async () => {
    try {
      const newTask = {
        name: taskName,
        description: taskDescription,
        status: "In-progress",
      };

      const response = await fetch(
        "https://todolist-server-sage.vercel.app/save",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newTask),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add task");
      }
      onAddTask();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <div >
      <div className="flex items-center bg-[#25273D] rounded-xl my-5 pl-2  lg:w-[35vw] w-full">
        <div className="px-2.5">
          <button
            onClick={handleAddTask}
            className="border text-white p-2 rounded-full"
          >
            <FaPlus size={10} style={{ fontWeight: 'normal' }} />
          </button>
        </div>
        <div>
          <div className="text-[18px] p-4">
            <input
              type="text"
              id="taskName"
              value={taskName}
              placeholder="Create a new todo..."
              onChange={(e) => setTaskName(e.target.value)}
              className="bg-transparent rounded-md w-full outline-none"
            />
          </div>

          <div className="text-[12px] px-4 pb-4">
            <input
              type="text"
              id="taskDesc"
              placeholder="Description"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              className="bg-transparent rounded-md w-full outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTask;
