import { useState } from 'react';
import TaskInput, { PriorityEnum } from '../TaskInput';
import { nanoid } from 'nanoid';
import { useLocalStorage } from '../hooks/useLocalStorage'; // Custom hook to manage LocalStorage
import toast, { Toaster } from 'react-hot-toast';
import ConfirmDialog from '../modal/ConfirmDialog';
import { FaArrowUp } from 'react-icons/fa';
import RenderTask from '../RenderTask';
import { getPriorityStyles } from '../RenderTask';
import { GiTireIronCross } from 'react-icons/gi';
import EditTask from '../modal/EditTask';

// Task interface definition
export interface TaskInter {
  id: string;
  title: string;
  priority: PriorityEnum;
  isCompleted: boolean;
}

const DashBoard = () => {
  // ------------------- State Management -------------------
  const [tasks, setTasks] = useLocalStorage<TaskInter[]>('tasks', []);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<TaskInter | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<PriorityEnum | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [completionFilter, setCompletionFilter] = useState<'all' | 'completed' | 'incompleted'>('all');
  const [sortOrder, setSortOrder] = useState<'lowToHigh' | 'highToLow' | 'none'>('none');
  const [taskToEdit, setTaskToEdit] = useState<TaskInter | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Map PriorityEnum to numeric values for sorting
  const priorityValueMap = {
    [PriorityEnum.Low]: 0,
    [PriorityEnum.Medium]: 1,
    [PriorityEnum.High]: 2,
  };

  // -------------------- Task Management --------------------

  const handleTaskAdd = (title: string, priority: string) => {
    const newTask: TaskInter = {
      id: nanoid(),
      title,
      priority: priority as PriorityEnum,
      isCompleted: false,
    };
    setTasks([...tasks, newTask]);
    toast.success('Task added successfully');
  };

  const handleTaskDelete = (id: string) => {
    const task = tasks.find((task) => task.id === id);
    if (!task) {
      toast.error('Task not found');
      return;
    }

    if (!task.isCompleted) {
      setIsDialogOpen(true);
      setTaskToDelete(task);
    } else {
      const updatedTasks = tasks.filter((task) => task.id !== id);
      setTasks(updatedTasks);
      toast.success('Task deleted successfully');
    }
  };

  const handleTaskCompletion = (id: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
    );
    setTasks(updatedTasks);
  };

  // -------------------- Edit Task --------------------
  const handleEdit = (id: string) => {
    const task = tasks.find((task) => task.id === id);
    if (task) {
      setTaskToEdit(task);
      setIsEditOpen(true);
    }
  };

  const handleEditSave = (updatedTask: TaskInter) => {
    const updatedTasks = tasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    );
    setTasks(updatedTasks);
    setIsEditOpen(false);
    toast.success('Task updated successfully');
  };

  const handleEditCancel = () => {
    setIsEditOpen(false);
    setTaskToEdit(null);
  };

  // -------------------- Confirmation Dialog --------------------
  const confirmDeletion = () => {
    if (taskToDelete) {
      const updatedTasks = tasks.filter((task) => task.id !== taskToDelete.id);
      setTasks(updatedTasks);
      setIsDialogOpen(false);
      toast.success('Task deleted successfully');
    }
  };

  const cancelDeletion = () => {
    setIsDialogOpen(false);
  };

  // -------------------- Filtering and Sorting --------------------
  const filteredTasks = tasks
    .filter((task) => {
      const matchesPriority = selectedPriority ? task.priority === selectedPriority : true;
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCompletion =
        completionFilter === 'all'
          ? true
          : completionFilter === 'completed'
          ? task.isCompleted
          : !task.isCompleted;

      return matchesPriority && matchesSearch && matchesCompletion;
    })
    .sort((a, b) => {
      if (sortOrder === 'none') return 0;

      const priorityA = priorityValueMap[a.priority];
      const priorityB = priorityValueMap[b.priority];

      return sortOrder === 'highToLow' ? priorityA - priorityB : priorityB - priorityA;
    });

  // -------------------- UI Render --------------------
  return (
    <div>
      <Toaster />

      {/* Task Input Section */}
      <TaskInput onTaskAdd={handleTaskAdd} />

      {/* Separator */}
      <div className="mt-6 flex items-center gap-4">
        <hr className="flex-grow border-t border-primary-foreground" />
        <span className="text-primary font-medium">
          <GiTireIronCross />
        </span>
        <hr className="flex-grow border-t border-secondary-foreground" />
      </div>

      {/* No Tasks Message */}
      {tasks.length === 0 && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 text-center">
          <div className="flex flex-col items-center justify-center space-y-2">
            <FaArrowUp className="text-6xl text-[hsl(var(--foreground))] animate-bounce" />
            <p className="text-lg text-muted-foreground">Add your task above!</p>
          </div>
          <p className="text-xl text-[hsl(var(--foreground))] mb-4">
            📝 No task created yet! Let's add your first task!
          </p>
        </div>
      )}

      {/* Search and Filter */}
      {tasks.length > 0 && (
        <div className="my-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            type="search"
            className="w-full sm:w-auto flex-grow px-4 py-2 border border-muted rounded-md focus:ring-2 focus:ring-primary focus:outline-none text-foreground bg-background"
            placeholder="Search here"
          />
          <div className="flex items-center gap-2 flex-wrap">
            {Object.values(PriorityEnum).map((level) => {
              const { color, icon } = getPriorityStyles(level);
              return (
                <button
                  key={level}
                  onClick={() => setSelectedPriority(level === selectedPriority ? null : level)}
                  className={`px-3 py-1 rounded-md border ${
                    level === selectedPriority ? 'bg-primary text-primary-foreground' : color
                  } text-sm font-medium transition hover:opacity-80`}
                >
                  <div className="flex gap-2">
                    {icon}
                    {level}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Completion Filter and Sorting */}
     {tasks.length > 0 &&  <div className="flex gap-4 mb-6 flex-wrap">
        <button
          onClick={() => setCompletionFilter('all')}
          className={`px-4 py-2 rounded-md ${
            completionFilter === 'all' ? 'bg-primary text-primary-foreground' : 'bg-background'
          }`}
        >
          All
        </button>

        <button
          onClick={() => setCompletionFilter('incompleted')}
          className={`px-4 py-2 rounded-md ${
            completionFilter === 'incompleted' ? 'bg-primary text-primary-foreground' : 'bg-background'
          }`}
        >
          TODO
        </button>

        <button
          onClick={() => setCompletionFilter('completed')}
          className={`px-4 py-2 rounded-md ${
            completionFilter === 'completed' ? 'bg-primary text-primary-foreground' : 'bg-background'
          }`}
        >
          Completed
        </button>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as 'lowToHigh' | 'highToLow' | 'none')}
          className="px-4 py-2 rounded-md border bg-background text-foreground"
        >
          <option value="none">Original Order</option>
          <option value="lowToHigh">Priority: Low to High</option>
          <option value="highToLow">Priority: High to Low</option>
        </select>
      </div>}

      {/* Task List */}
      {filteredTasks.length > 0 ? (
        <RenderTask tasks={filteredTasks} onDelete={handleTaskDelete} onToggleComplete={handleTaskCompletion} onEdit={handleEdit} />
      ) : tasks.length > 0 ? (
        <p className="text-center text-muted-foreground">No Task Found 🗒️</p>
      ) : null}

      {/* Confirmation Dialog */}
      {isDialogOpen && (
        <ConfirmDialog
          message="Are you sure you want to delete this task?"
          secMessage="This task is not completed yet*"
          isOpen={isDialogOpen}
          onConfirm={confirmDeletion}
          onCancel={cancelDeletion}
        />
      )}

      {/* Edit Task Modal */}
      {isEditOpen && taskToEdit && (
        <EditTask task={taskToEdit} onSave={handleEditSave} onCancel={handleEditCancel} />
      )}
    </div>
  );
};

export default DashBoard;
