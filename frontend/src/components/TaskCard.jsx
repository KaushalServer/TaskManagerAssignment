import React, {useState} from 'react';
import ConfirmationModal from './ConfirmDeleteModal';
// import '../App.css'

const TaskCard = ({ task, onEdit, onDelete, onViewDetails }) => {

  const [isModalOpen, setModalOpen] = useState(false)

  const handleDeleteClick = () => {
    setModalOpen(true)
  }

  const handleConfirmDelete = () => {
    setModalOpen(false)
    onDelete(task)
  }

  return (
    <div className="bg-blue-100 shadow-md p-4 rounded flex flex-col justify-between h-full">
      <h3 className="text-lg font-bold truncate">{task.title}</h3>
      <p className='truncate'>{task.description}</p>
      <p className="text-sm text-gray-500 mt-10">Created at: {new Date(task.createdAt).toLocaleString()}</p>
      {/* <p className="text-sm text-gray-500">Updated at: {new Date(task.updatedAt).toLocaleString()}</p> */}
      {/* Being sorted based on created Date in asc */}
      <div className="mt-4 flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 space-x-2">
        <button
        onClick={handleDeleteClick}
        className="bg-red-500 text-white p-2 rounded w-full flex-shrink-0 sm:w-auto">
          Delete
        </button>
        <button
        onClick={() => onEdit(task)}
        className="bg-yellow-500 text-white p-2 rounded w-full flex-shrink-0 sm:w-auto">
          Edit
        </button>
        <button
        onClick={() => onViewDetails(task)}
        className="bg-blue-500 text-white p-2 rounded w-full flex-shrink-0 sm:w-auto">
          View Details
        </button>
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default TaskCard;
