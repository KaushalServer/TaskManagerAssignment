import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import TaskCard from './TaskCard';
import useTasks from '../hooks/useTasks';
import AddTask from './AddTask';
import TaskDetailsModal from './TaskDetailsModal';
import { useAuthContext } from '../context/AuthContext';

const TaskBoard = () => {
  const { authUser } = useAuthContext()
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [isDetailsOpen, setDetailsOpen] = useState(false);
  const { tasks, deleteTask, todoTasks, inProgressTasks, doneTasks, fetchTasks, updateTaskOrder } = useTasks();

  // Adding search query
  const [search , setSearch] = useState("");

  // Adding Sort Options
  const [sort, setSort] = useState("createdAt_asc")
  // Drag and Drop
  const [draggedTask, setDraggedTask] = useState(null);

  const handleSort = (e) => {
    setSort(e.target.value)
  }


  // Handling Tasks Crud and Search Sort Start
  useEffect(() => {
    fetchTasks();
  }, []); 

  const handleAdd = () => {
    setCurrentTask(null); // Set currentTask to null for adding a new task
    setModalOpen(true);
  };

  const handleEdit = async (task) => {
    setCurrentTask(task);
    setModalOpen(true);
  };

  const handleDelete = async (task) => {
    await deleteTask(task._id);
    fetchTasks();
  };

  const handleViewDetails = (task) => {
    setCurrentTask(task);
    setDetailsOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    fetchTasks();
  };

  const handleSearch = (e) => {
    setSearch(e.target.value)
    console.log(search);
  }

  // Implementing Search Functionality
  const filterTasks = (tasks, query) => {
    if (!query) return tasks;
    return tasks.filter((task) =>
      task.title.toLowerCase().includes(query.toLowerCase()) ||
      task.description.toLowerCase().includes(query.toLowerCase())
    );
  };

  // Implementing Sort Functionality
  const sortedTasks = (tasks) => {
    switch (sort) {
      case "createdAt_asc":
        return tasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case "createdAt_desc":
        return tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case "updatedAt_asc":
        return tasks.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));
      case "updatedAt_desc":
        return tasks.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      default:
        return tasks;
    }
  };


  const getList = (id) => {
    switch (id) {
      case 'todo':
        return sortedTasks(filterTasks(todoTasks, search))
      case 'inprogress':
        return sortedTasks(filterTasks(inProgressTasks, search)) //inProgressTasks
      case 'done':
        return sortedTasks(filterTasks(doneTasks, search)) //doneTasks
      default:
        return [];
    }
  };
  // Handling Tasks Crud and Search Sort Stop

  // Handling Drag and Drop
  // Handle Drag Events
  const handleDragStart = (task) => {
    setDraggedTask(task);
  };

  const handleDrop = (listId) => {
    if (draggedTask) {
      const updatedTask = { ...draggedTask, status: listId };  // Assuming 'status' determines the list (todo, inprogress, done)
      updateTaskOrder(updatedTask);
      fetchTasks();  // Fetch the updated tasks after reordering
      setDraggedTask(null); // Reset after drop
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary for allowing the drop
  };

  // DnD End

  return (
    <div>

      {/* Basic Struture remaining strucuture */}
      <div className="container mx-auto p-4">
        <header className="flex justify-between mb-4">
          <h1 className="text-3xl font-bold">{authUser.firstname}'s Tasks</h1>
          <button
            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleAdd}
          >
            Add Task
          </button>
          {/* <AddTask
          isOpen={isModalOpen}
          onClose={handleModalClose}
          task={""} */}
          {/* // key={modalKey} */}
        {/* /> */}
        </header>

        {/* Search and sort container */}
      <div className="flex justify-between mb-4 shadow-md bg-white p-4 rounded">
        <div className='flex items-center mb-2'>
          <label className="mr-2">
            Search: 
          </label>
          <input
            type="search"
            placeholder="Search tasks"
            className="w-full p-2 text-sm text-gray-700"
            value={search}
            onChange={handleSearch}
          />
        </div>
        <div className='flex items-center mb-2'>
          <label className="mr-2">
            Sort by: </label>
          <select className="w-full p-2 text-sm text-gray-700 truncate" value={sort} onChange={handleSort}>
            <option value="">Select an option</option>
            <option value="createdAt_asc">Created Date (ASC)</option>
            <option value="createdAt_desc">Created Date (DESC)</option>
            <option value="updatedAt_asc">Updated Date (ASC)</option>
            <option value="updatedAt_desc">Updated Date (DESC)</option>
          </select>
        </div>
      </div>

      {/* Task Board Structure */}
      <div className="flex flex-wrap justify-center min-h-screen">
        {loading && <p>Loading...</p>}
        {!loading && (
          <>
            {['todo', 'inprogress', 'done'].map((listId) => (
              <div 
              key={listId} 
              className="w-full md:w-1/2 lg:w-1/3 p-4"
              onDragOver={handleDragOver}
                onDrop={() => handleDrop(listId)}
                >
                <div className="bg-white shadow-lg p-4 rounded flex flex-col h-full">
                  <h2 className="text-lg font-bold text-center bg-blue-500 p-2 rounded">
                    {listId.toUpperCase()}
                  </h2>
                  <ul>
                    {getList(listId).map((task, index) => (
                      <li key={task._id} className="mb-2"  draggable
                      onDragStart={() => handleDragStart(task)}>
                        <TaskCard
                          task={task}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                          onViewDetails={handleViewDetails}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
            <AddTask
              isOpen={isModalOpen}
              onClose={handleModalClose}
              task={currentTask}
            />
            <TaskDetailsModal
              isOpen={isDetailsOpen}
              onClose={() => setDetailsOpen(false)}
              task={currentTask}
            />
          </>
          )
        }
        </div>
      </div>
    </div>  // Closing div
  );
};

export default TaskBoard;