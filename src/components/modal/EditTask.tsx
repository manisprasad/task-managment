import React, { useState } from 'react';
import { TaskInter } from '../pages/DashBoard';
import { PriorityEnum } from '../TaskInput';

interface EditTaskModalProps {
  task: TaskInter;
  onSave: (updatedTask: TaskInter) => void;
  onCancel: () => void;
}

const EditTask: React.FC<EditTaskModalProps> = ({ task, onSave, onCancel }) => {
  const [title, setTitle] = useState(task.title);
  const [priority, setPriority] = useState(task.priority);

  const handleSave = () => {
    if (title.trim() === '') {
      alert('Title cannot be empty');
      return;
    }

    onSave({ ...task, title, priority });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="p-6 bg-[hsl(var(--card))] rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4 text-[hsl(var(--foreground))]">Edit Task</h2>
        <div className="mb-4">
          <label className="block mb-1 font-medium text-[hsl(var(--foreground))]">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded-md bg-[hsl(var(--input))] text-[hsl(var(--foreground))] focus:ring focus:ring-[hsl(var(--primary))] focus:outline-none"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium text-[hsl(var(--foreground))]">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as PriorityEnum)}
            className="w-full px-3 py-2 border rounded-md bg-[hsl(var(--input))] text-[hsl(var(--foreground))] focus:ring focus:ring-[hsl(var(--primary))] focus:outline-none"
          >
            {Object.values(PriorityEnum).map((level) => (
              <option key={level} value={level} className="text-[hsl(var(--foreground))] bg-[hsl(var(--background))]">
                {level}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] rounded-md hover:bg-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--muted))] transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-md hover:bg-opacity-80 transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTask;
