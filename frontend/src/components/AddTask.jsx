import { useState, useEffect } from 'react';
import useTasks from '../hooks/useTasks';

const AddTask = ({ isOpen, onClose, task }) => {

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo');

  const { addTask, editTask } = useTasks()

  useEffect(() => {
    if (isOpen) {
      setTitle(task ? task.title : ''); // Reset title
      setDescription(task ? task.description : ''); // Reset description
      setStatus(task ? task.taskProgress : 'todo'); // Reset status
    }
  }, [isOpen, task]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (task) {
        // Edit task
        const id = task._id
        await editTask({ id,title, description, status});

      } 
      else {
        // Add new task
        await addTask({ title, description, status });
      }
      onClose();
      
    } catch (error) {
      console.error("Failed to save task:", error);
    }
    
  }

  return (
    <div
      className={`fixed inset-0 z-10 ${
        isOpen ? 'block' : 'hidden'
      }`}
      style={{
        backgroundColor: 'rgba(0,0,0,0.5)',
      }}
    >
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white rounded-3xl shadow-2xl p-4 w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 max-w-lg mx-auto flex flex-col"
        style={{

          boxShadow : '0px 0px 20px rgba(0,0,0,0.5)',
        }}
        >
          <h2 className='text-2xl font-bold mb-4'>
            {task ? "Edit Task" : "Add Task"}
            </h2>
          <form onSubmit={handleSubmit}>
            <label className="block mb-2">
              Title:
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </label>
            <label className="block mb-2">
              Description:
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                rows={6}
              />
            </label>
            <label className="block mb-2">
              Status:
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="todo">TODO</option>
                <option value="inprogress">IN PROGRESS</option>
                <option value="done">DONE</option>
              </select>
            </label>
          </form>
          <div className='flex justify-end space-x-2 mt-4'>
          <button
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleSubmit}
            >
              {task ? "Update" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTask;