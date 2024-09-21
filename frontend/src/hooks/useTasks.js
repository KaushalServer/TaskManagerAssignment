import { useCallback, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [todoTasks, setTodoTasks] = useState([]);
  const [inProgressTasks, setInProgressTasks] = useState([]);
  const [doneTasks, setDoneTasks] = useState([]);


  const fetchTasks = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/task/allUserTasks', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include', // send cookies with requests
        mode: 'cors',
      });
      const data = await response.json();

      // Sort tasks by updatedAt if available, recent updated task on top
      // const sortedTasks = data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

      // Categorize tasks based on taskProgress
      const todoTasks = data.filter(task => task.taskProgress === 'todo');
      const inProgressTasks = data.filter(task => task.taskProgress === 'inprogress');
      const doneTasks = data.filter(task => task.taskProgress === 'done');

      // Update the state
      setTodoTasks(todoTasks);
      setInProgressTasks(inProgressTasks);
      setDoneTasks(doneTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  }, [])

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async ({ title, description, status }) => {
    setLoading(true)
    try {
      const response = await fetch('/api/task/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify({
          title,
          description,
          taskProgress: status,
          // we have to add taskProgress
        }),
      });
      const data = await response.json();
      // console.log(data);

      if (data.message) {
        toast.success(data.message)
        setTasks(prevTasks => [...prevTasks, data.data]); // what is setTasks is required for

      } else {
        toast.error(data.error)
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false)
    }
  };

  const editTask = async ({ id, title, description, status }) => {

    setLoading(true)
    try {
      const response = await fetch(`/api/task/edit/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify({
          title,
          description,
          taskProgress: status
        }),
      });
      const data = await response.json();

      if (data.message) {
        toast.success(data.message)
        setTasks(prevTasks => prevTasks.map(t => (t.id === id ? data.data : t))); // Assuming response contains a 'task' field
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false)
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const res = await fetch(`/api/task/delete/${taskId}`, {
        method: 'DELETE',
        credentials: 'include',
        mode: 'cors'
      });
      setTasks(tasks.filter((t) => t.id !== taskId));
      toast.success(res.message)
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Update task order or status (similar to editTask but focuses on status changes)
  const updateTaskOrder = async (updatedTask) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/task/edit/${updatedTask._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify({
          title: updatedTask.title,
          description: updatedTask.description,
          taskProgress: updatedTask.status, // Update the task's status (todo, inprogress, done)
        }),
      });
      const data = await response.json();

      if (data.message) {
        toast.success(data.message);
        setTasks(prevTasks => prevTasks.map(t => (t.id === updatedTask.id ? data.data : t)));
        fetchTasks(); // Refresh tasks after reordering
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { tasks, loading, addTask, editTask, deleteTask, fetchTasks, updateTaskOrder, todoTasks, inProgressTasks, doneTasks, };
};

export default useTasks;