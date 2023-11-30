import React, { useState, useEffect } from "react";
import AddTask from "./AddTask";
import UpdateTaskForm from "./UpdateTask";
import Checkbox from "@mui/material/Checkbox";
import { FaEdit } from 'react-icons/fa';
import { motion } from "framer-motion";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(null);
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


  const updateTaskLocally = (taskId, updatedStatus) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === taskId ? { ...task, status: updatedStatus } : task
      )
    );
  };

  const handleAddTask = () => {
    fetchData();
  };

  const handleUpdate = (task) => {
    setSelectedTask(task);
    setSelectedTaskIndex(task._id);
    setUpdateFormOpen(true);
  };

  const handleUpdateFormClose = () => {
    setUpdateFormOpen(false);
    setSelectedTask(null);
  };

  const handleUpdateFormUpdate = (updatedStatus) => {
    setUpdateFormOpen(false);
    setSelectedTask(null);
    updateTaskLocally(selectedTaskIndex, updatedStatus);
  };

  const toggleStatus = async (taskId) => {
    try {
      const taskToUpdate = tasks.find((task) => task._id === taskId);

      if (taskToUpdate) {
        const updatedStatus =
          taskToUpdate.status === "completed" ? "in-progress" : "completed";
        const response = await fetch(
          `https://todolist-server-sage.vercel.app/update/${taskId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: updatedStatus }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update task status");
        }

        updateTaskLocally(taskId, updatedStatus);
      }
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };
  return (
    <div className="p-10 text-white flex flex-col justify-center items-center h-full">
      <h1 className="text-2xl font-bold ">TODO</h1>
      <AddTask onAddTask={handleAddTask} />
      <div className="bg-[#25273D] rounded-xl p-2">
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
            <motion.div
                key={id}
                className="lg:w-[34vw] w-full"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
            <div className="lg:w-[34vw] w-full">
              <div key={id} className="flex  justify-between ">
                {isUpdateFormOpen && selectedTaskIndex === task._id && (
                  <UpdateTaskForm
                    task={selectedTask}
                    onCancel={handleUpdateFormClose}
                    onUpdate={(updatedStatus) =>
                      handleUpdateFormUpdate(updatedStatus)
                    }
                  />
                )}

                {!isUpdateFormOpen || selectedTaskIndex !== task._id ? (
                  <>
                    <div className="px-3 flex space-x-5 items-center text-white">
                      <Checkbox
                        checked={task.status === "completed"}
                        onChange={() => toggleStatus(task._id)}
                      />
                      <div>
                        <p
                          className={`text-[18px] ${
                            task.status === "completed" ? "line-through" : ""
                          }`}
                        >
                          {task.name}
                        </p>
                        <p
                          className={`text-[12px] ${
                            task.status === "completed" ? "line-through" : ""
                          }`}
                        >
                          {task.description}
                        </p>
                      </div>
                    </div>
                    <div className="px-2 flex justify-between my-5 space-x-5">
                      <button
                        onClick={() =>
                          task.status !== "completed" && handleUpdate(task)
                        }
                      >
                        <FaEdit />
                      </button>
                      <p
                        className={`text-[12px] px-2 py-1 ${
                          task.status === "completed"
                            ? "bg-[#3BA139]"
                            : "bg-[#DC4C4B]"
                        } bg-opacity-40 rounded-lg`}
                      >
                        {task.status}
                      </p>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
            </motion.div>
          ))}
          </div>
    </div>
  );
};

export default TaskList;
