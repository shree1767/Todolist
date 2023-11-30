import React, { useState } from "react";

const UpdateTaskForm = ({ task,onCancel, onUpdate }) => {
  const [updatedName, setUpdatedName] = useState(task.name);
  const [updatedDescription, setUpdatedDescription] = useState(task.description);

  const handleUpdate = async () => {
    try {
      const updatedTask = {
        ...task,
        name: updatedName,
        description: updatedDescription,
      };

      const response = await fetch(
        `https://todolist-server-sage.vercel.app/update/${task._id}`,
        {
          method: "PATCH", // Assuming your API supports updating via PUT
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedTask),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      // Trigger a callback to fetch updated data
      onUpdate();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <div className="flex items-center justify-between bg-[#25273D] rounded-lg pb-2 lg:w-[35vw] w-full">
    <div className="flex px-6 justify-between">
      <div className="mx-8">
        <div className="text-[18px] px-4 pt-2">
          <input
            type="text"
            id="taskName"
            value={updatedName}
            placeholder='Task Name'
            onChange={(e) => setUpdatedName(e.target.value)}
            className="bg-transparent rounded-md w-full outline-none"
          />
        </div>
        <div className="text-[12px] px-4 ">
          <input
            type="text"
            id="taskDesc"
            placeholder="Description"
            value={updatedDescription}
            onChange={(e) => setUpdatedDescription(e.target.value)}
            className="bg-transparent rounded-md w-full outline-none"
          />
        </div>
      </div>
    </div>
  
    <div className="h-[0.5px] mt-2 bg-white"></div>
  
    <div className="flex justify-end space-x-5 px-5 text-[14px]">
      <button onClick={onCancel}>x</button>
      <button onClick={handleUpdate} className="bg-[#DC4C4B] text-white px-4 py-1.5 rounded">
        Update
      </button>
    </div>
  </div>
  
  );
};

export default UpdateTaskForm;
