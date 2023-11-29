import React, { useState, useEffect } from "react";
import AddTask from "./AddTask";
import UpdateTaskForm from "./UpdateTask";
import { Checkbox } from "antd";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [isAddTaskModalOpen, setAddTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isUpdateFormOpen, setUpdateFormOpen] = useState(false);

  const fetchData = async () => {
    try {
      const response = await fetch("https://todolist-server-sage.vercel.app/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddTask = () => {
    setAddTaskModalOpen(false);
    fetchData();
  };

  const handleUpdate = (task) => {
    setSelectedTask(task);
    setUpdateFormOpen(true);
  };

  const handleUpdateFormClose = () => {
    setUpdateFormOpen(false);
    setSelectedTask(null);
  };

  const handleUpdateFormUpdate = () => {
    setUpdateFormOpen(false);
    setSelectedTask(null);
    fetchData();
  };

  const toggleStatus = async (taskId) => {
    try {
      const taskToUpdate = tasks.find((task) => task._id === taskId);
  
      if (taskToUpdate) {
        const updatedStatus = taskToUpdate.status === "completed" ? "in-progress" : "completed";
        const response = await fetch(`https://todolist-server-sage.vercel.app/update/${taskId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: updatedStatus }),
        });
  
        if (!response.ok) {
          throw new Error("Failed to update task status");
        }
  
        fetchData();
      }
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };
  
  return (
    <div className="p-10 text-white">
      <h1 className="text-2xl font-bold">All Tasks</h1>
      {tasks !== null &&
        tasks
          .slice()
          .sort((a, b) => {
            if (a.status === "completed" && b.status !== "completed") {
              return 1;
            } else if (a.status !== "completed" && b.status === "completed") {
              return -1;
            } else {
              return 0;
            }
          })
          .map((task, id) => (
            <div className="my-10 w-[40vw] ">
              <div key={id} className="flex justify-between">
                <div className="flex space-x-5 items-center">
                  <Checkbox
                    checked={task.status === "completed"}
                    onChange={() => toggleStatus(task._id)}
                  />
                <div>
                  <p className={`text-[18px] ${task.status === "completed" ? "line-through" : ""}`}>
                    {task.name}
                  </p>
                  <p className={`text-[12px] ${task.status === "completed" ? "line-through" : ""}`}>{task.description}</p>
                </div>
                </div>
              
               
                <div className="flex justify-between my-5 space-x-5">
                  <button onClick={() => task.status!=='completed' && handleUpdate(task)}>E</button>
                  <p className={`text-[12px] px-2 py-1 ${ task.status === "completed"? "bg-[#3BA139]": "bg-[#DC4C4B]"} bg-opacity-40 rounded-lg`}>
                    {task.status}
                  </p>
                </div>
              </div>
              <div className="h-[0.5px] px-2 bg-white"></div>
            </div>
          ))}
      <button className="text-[12px]" onClick={() => setAddTaskModalOpen(true)}>
        Add Task
      </button>
      {isAddTaskModalOpen && (
        <AddTask
          isOpen={isAddTaskModalOpen}
          onClose={() => setAddTaskModalOpen(false)}
          onAddTask={handleAddTask}
        />
      )}
      {isUpdateFormOpen && selectedTask && (
        <UpdateTaskForm
          task={selectedTask}
          onCancel={handleUpdateFormClose}
          onUpdate={handleUpdateFormUpdate}
        />
      )}
    </div>
  );
};

export default TaskList;