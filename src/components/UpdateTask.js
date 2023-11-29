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
      // Handle the error appropriately (e.g., display an error message)
    }
  };

  return (
    <div className="bg-transparent border rounded-lg mt-5 w-[40vw]  ">
       <div className="text-[18px] p-4">
          <input
            type="text"
            id="taskName"
            value={updatedName}
            placeholder='Task Name'
            onChange={(e) => setUpdatedName(e.target.value)}
            className=" bg-transparent rounded-md w-full"
          />
        </div>
        <div className="text-[12px] px-4 pb-4">
          <input
            type="text"
            id="taskDesc"
            placeholder="Description"
            value={updatedDescription}
            onChange={(e) => setUpdatedDescription(e.target.value)}
            className=" bg-transparent rounded-md w-full"
          />
        </div>
        <div className="h-[0.5px] mt-2 bg-white"></div>
        <div className="flex justify-end space-x-5 px-2 text-[14px] py-3">
            <button onClick={onCancel}>Cancel</button>
          <button onClick={handleUpdate} className="bg-[#DC4C4B] text-white px-4  py-1.5 rounded">
            Update
          </button>
        </div>
    </div>
  );
};

export default UpdateTaskForm;
