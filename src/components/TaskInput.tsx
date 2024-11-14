import React, { useState } from "react";

export enum PriorityEnum {
  Low = "Low",
  Medium = "Medium",
  High = "High",
}

interface TaskInputProps {
  onTaskAdd: (title: string, priority: PriorityEnum) => void;
}

  
const TaskInput: React.FC<TaskInputProps> = ({ onTaskAdd}) => {
  const [title, setTitle] = useState<string>("");
  const [priority, setPriority] = useState<PriorityEnum>(PriorityEnum.Low);

  const handleAddTask = () => {
    if (title.trim()) {
      onTaskAdd(title, priority);
      setTitle("");
      setPriority(PriorityEnum.Low);
    }
  };

  
    return (
      <div className="w-full relative  max-w-md mx-auto bg-card text-card-foreground  rounded-lg ">
        <h2 className="text-2xl font-semibold text-foreground mb-4">Add a New Task</h2>
       

        <div className="flex gap-1 items-center justify-center">
       
          <div className="mb-4 flex-1">
            <label htmlFor="taskTitle" className="block text-sm text-left font-medium text-muted-foreground">
              Task Title
            </label>
            <input
              id="taskTitle"
              type="text"
              className=" w-full px-4 py-2 mt-1 border border-muted rounded-md focus:ring-2 focus:ring-primary focus:outline-none text-foreground bg-background"
              placeholder="e.g., Appointment at 5pm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Priority Dropdown */}
          <div className="mb-4">
            <label htmlFor="taskPriority" className="block text-sm font-medium text-muted-foreground">
              Priority
            </label>
            <select
              id="taskPriority"
              className="w-full py-2 text-center pr-1 bg-secondary mt-1 border border-muted rounded-md focus:ring-2 focus:ring-primary focus:outline-none text-foreground"
              value={priority}
              onChange={(e) => setPriority(e.target.value as PriorityEnum)}
            >
              {Object.values(PriorityEnum).map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

        </div>
        {/* Add Task Button */}
        <button
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 px-4 rounded-md transition duration-300"
          onClick={handleAddTask}
        >
          Add Task
        </button>
      </div>
    );
};

export default TaskInput;
