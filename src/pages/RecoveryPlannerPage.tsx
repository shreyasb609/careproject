import React, { useState } from 'react';
import { 
  Plus, 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Edit3, 
  Calendar, 
  Filter, 
  Search,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RecoveryTask, TaskCategory } from '../types';

export const RecoveryPlannerPage: React.FC = () => {
  const { tasks, addTask, updateTask, deleteTask, toggleTaskCompleted } = useApp();

  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<RecoveryTask | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TaskCategory>('general');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');

  const openAddModal = () => {
    setEditingTask(null);
    setTitle('');
    setDescription('');
    setCategory('general');
    setDueDate('');
    setDueTime('');
    setIsModalOpen(true);
  };

  const openEditModal = (task: RecoveryTask) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description || '');
    setCategory(task.category);
    setDueDate(task.dueDate || '');
    setDueTime(task.dueTime || '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingTask) {
      await updateTask({
        ...editingTask,
        title: title.trim(),
        description: description.trim() || undefined,
        category,
        dueDate: dueDate || undefined,
        dueTime: dueTime || undefined
      });
    } else {
      await addTask({
        title: title.trim(),
        description: description.trim() || undefined,
        category,
        dueDate: dueDate || undefined,
        dueTime: dueTime || undefined,
        completed: false
      });
    }
    setIsModalOpen(false);
  };

  const filteredTasks = tasks.filter(task => {
    if (filterCategory !== 'all' && task.category !== filterCategory) return false;
    if (filterStatus === 'pending' && task.completed) return false;
    if (filterStatus === 'completed' && !task.completed) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchDesc = task.description?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc) return false;
    }
    return true;
  });

  const categories: { id: TaskCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All Tasks' },
    { id: 'wound-care', label: 'Wound Care' },
    { id: 'physical-therapy', label: 'Physical Therapy' },
    { id: 'vital-signs', label: 'Vital Signs' },
    { id: 'diet-hydration', label: 'Diet & Fluids' },
    { id: 'equipment', label: 'Equipment & Supplies' },
    { id: 'medication', label: 'Medications' },
    { id: 'appointment', label: 'Appointments' },
    { id: 'general', label: 'General Recovery' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-calm-900 tracking-tight">Recovery Planner</h1>
          <p className="text-sm text-calm-500 mt-1">
            Organize clinician instructions into actionable daily tasks. Everything is saved locally.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2.5 bg-brand-600 text-white font-semibold rounded-xl text-sm shadow hover:bg-brand-700 transition"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Add Recovery Task
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-calm-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-calm-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-calm-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 text-sm border border-calm-300 rounded-lg bg-white text-calm-700 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            >
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 text-sm border border-calm-300 rounded-lg bg-white text-calm-700 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="pending">Outstanding</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-calm-200">
          <p className="text-calm-500 text-sm">No recovery tasks found matching criteria.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map(task => (
            <div
              key={task.id}
              className={`p-4 rounded-xl border transition flex items-start justify-between ${
                task.completed
                  ? 'bg-calm-50/70 border-calm-200 opacity-75'
                  : 'bg-white border-calm-200 hover:border-brand-300 shadow-xs'
              }`}
            >
              <div className="flex items-start space-x-3 flex-1 pr-4">
                <button
                  type="button"
                  onClick={() => toggleTaskCompleted(task.id)}
                  className="mt-0.5 text-calm-400 hover:text-brand-600 focus:outline-none transition"
                  aria-label={task.completed ? 'Mark task as incomplete' : 'Mark task as completed'}
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-sage-600 fill-sage-50" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 text-xs font-semibold uppercase rounded bg-calm-100 text-calm-700">
                      {task.category}
                    </span>
                    {task.dueDate && (
                      <span className="text-xs text-calm-500 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {task.dueDate} {task.dueTime ? `at ${task.dueTime}` : ''}
                      </span>
                    )}
                  </div>
                  <h3 className={`text-base font-semibold ${task.completed ? 'line-through text-calm-500' : 'text-calm-900'}`}>
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className={`text-sm ${task.completed ? 'line-through text-calm-400' : 'text-calm-600'}`}>
                      {task.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-1 flex-shrink-0">
                <button
                  onClick={() => openEditModal(task)}
                  className="p-1.5 text-calm-400 hover:text-calm-700 rounded-lg hover:bg-calm-100 transition"
                  title="Edit task"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-1.5 text-calm-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                  title="Delete task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-calm-200">
            <h2 className="text-lg font-bold text-calm-900 mb-4">
              {editingTask ? 'Edit Recovery Task' : 'Add Recovery Task'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-calm-700 uppercase mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Clean incision with mild soap and pat dry"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-calm-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-calm-700 uppercase mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TaskCategory)}
                  className="w-full px-3 py-2 text-sm border border-calm-300 rounded-lg bg-white text-calm-800 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  <option value="wound-care">Wound Care</option>
                  <option value="physical-therapy">Physical Therapy</option>
                  <option value="vital-signs">Vital Signs</option>
                  <option value="diet-hydration">Diet & Hydration</option>
                  <option value="equipment">Equipment & Supplies</option>
                  <option value="medication">Medication</option>
                  <option value="appointment">Appointment</option>
                  <option value="general">General Recovery</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-calm-700 uppercase mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-calm-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-calm-700 uppercase mb-1">
                    Due Time
                  </label>
                  <input
                    type="time"
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-calm-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-calm-700 uppercase mb-1">
                  Instructions / Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Enter details directly from your doctor's instructions..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-calm-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-calm-700 bg-calm-100 rounded-lg hover:bg-calm-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold text-white bg-brand-600 rounded-lg hover:bg-brand-700 transition"
                >
                  {editingTask ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

