import React from 'react';
import { FaTimes, FaTasks, FaCalendarAlt } from 'react-icons/fa';

const TaskDetailsModal = ({ isOpen, onClose, task }) => {
  if (!task) return null;

  return (
    <div
      className={`fixed inset-0 z-10 overflow-y-auto ${isOpen ? 'block' : 'hidden'}`}
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className="flex items-center justify-center min-h-screen">
        <div
          className="bg-white rounded-lg shadow-xl p-6 w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 mx-auto"
          style={{ maxHeight: '90vh' }}
        >
          {/* Header Section */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold flex items-center">
              <FaTasks className="mr-2 text-blue-500" /> Task Details
            </h2>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={onClose}
            >
              <FaTimes size={24} />
            </button>
          </div>

          {/* Task Details Section */}
          <div className="space-y-4 text-left">
            <div>
              <h3 className="text-lg font-semibold">Title</h3>
              <p className="text-gray-600">{task.title}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Description</h3>
              <p className="text-gray-600">{task.description}</p>
            </div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold">Status:</h3>
              <span className={`px-2 py-1 rounded-lg text-white ${task.taskProgress === 'done' ? 'bg-green-500' : task.taskProgress === 'inprogress' ? 'bg-yellow-500' : 'bg-blue-500'}`}>
                {task.taskProgress.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <FaCalendarAlt className="text-gray-500" />
              <p className="text-gray-600">Created At: {new Date(task.createdAt).toLocaleString()}</p>
            </div>
          </div>

          {/* Footer Section */}
          <div className="flex justify-end mt-6">
            <button
              className="bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded-lg"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsModal;
