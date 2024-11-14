import React from 'react';
import { TaskInter } from './pages/DashBoard';
import { MdOutlineTaskAlt, MdDelete } from 'react-icons/md';
import { FaExclamationCircle, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa'; // Priority icons
import { motion, AnimatePresence } from 'framer-motion';
import { PriorityEnum } from './TaskInput';
import { BiEdit } from "react-icons/bi";

interface RenderTaskProps {
  tasks: TaskInter[];
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onEdit: (id: string) => void;
}

export const getPriorityStyles = (priority: string) => {
  switch (priority) {
    case 'High':
      return {
        color: 'text-red-500',
        icon: <FaExclamationCircle className="text-red-700 bg-white rounded-full text-xl" />,
      };
    case 'Medium':
      return {
        color: 'text-yellow-500',
        icon: <FaExclamationTriangle className="text-yellow-500 text-xl" />,
      };
    case 'Low':
      return {
        color: 'text-green-500',
        icon: <FaCheckCircle className="text-green-500 text-xl" />,
      };
    default:
      return {
        color: 'text-muted-foreground',
        icon: null,
      };
  }
};

const RenderTask: React.FC<RenderTaskProps> = ({ tasks, onDelete, onToggleComplete, onEdit  }) => {
  return (
    <div className="mt-6 flex flex-col gap-6 lg:grid md:grid md:grid-cols-2 lg:grid-cols-3">
      <AnimatePresence>
        {[...tasks].reverse().map((task) => {
          const priorityStyles = getPriorityStyles(task.priority);

          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className={`w-full bg-card ${
                task.priority === PriorityEnum.Medium
                  ? 'bg-yellow-800 border-2 border-yellow-600'
                  : task.priority === PriorityEnum.Low
                  ? 'bg-green-900 border-2 border-green-600'
                  : 'bg-red-800 border-2 border-red-600'
              } text-card-foreground rounded-xl shadow-lg border border-muted flex flex-col justify-between p-5`}
            >
              {/* Task Header: Title and Priority */}
              <div className="flex items-center justify-between mb-4">
                <h3
                  className="text-lg flex-1 font-semibold text-primary-foreground text-left"
                  title={task.title}
                >
                  {task.title.length > 50 ? task.title.substring(0, 49) + "..." : task.title}
                </h3>
                {/* Priority Icon and Delete Button */}
                <div className="flex items-center gap-3">
                  {priorityStyles.icon}

                  <button
                    className="flex items-center rounded-full     bg-transparent p-1   transition duration-200 shadow-md"
                    onClick={() => onEdit(task.id)}
                  >
                    <BiEdit className='text-lg' />
                  </button>
            
                  <button
                    className="flex items-center rounded-full   text-red-700  bg-transparent p-1  bg-white transition duration-200 shadow-md"
                    onClick={() => onDelete(task.id)}
                  >
                    <MdDelete className="text-lg " />
                  </button>
                </div>
              </div>

              {/* Task Actions */}
              <div className="mt-auto flex items-center justify-between gap-3">
                <button
                  className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium shadow-md transition ${
                    task.isCompleted
                      ? 'bg-green-500 hover:bg-green-400 text-white'
                      : 'bg-blue-500 hover:bg-blue-400 text-white'
                  }`}
                  onClick={() => onToggleComplete(task.id)}
                >
                  <MdOutlineTaskAlt />
                  {task.isCompleted ? 'Completed' : 'Mark as Done'}
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default RenderTask;
