import React, { useState, useEffect } from 'react';
import { X, DollarSign, Calendar, AlertCircle, User, Clock, Plus, Minus, Ruler } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { TaskForm } from './TaskForm';
import { TaskList, Task } from './TaskList';
import { getStandardTasks } from './standardTasks';
import { PaymentScheduleButton } from './PaymentScheduleButton';
import { PaymentScheduleForm } from './PaymentScheduleForm';
import { MaterialsStore } from './MaterialsStore';

interface PendingQuoteCardProps {
  projectName: string;
  customerName: string;
  projectType: string;
}

const projectTypes = {
  "Interior Renovation & Remodeling": [
    "Kitchen Remodeling",
    "Bathroom Renovation",
    "Basement Finishing & Remodeling",
    "Attic Conversion",
    "Whole Home Renovation",
    "Interior Wall Removal & Open Concept Conversion",
    "Garage Conversion",
    "Laundry Room Upgrade or Expansion",
    "Walk-in Closet Addition or Expansion",
    "Mudroom Addition or Renovation"
  ],
  "Home Additions & Expansions": [
    "Single-Room Home Addition",
    "Multi-Room Home Addition", 
    "Second Story Addition",
    "Sunroom Addition",
    "In-Law Suite Addition",
    "ADU Construction",
    "Garage Addition",
    "Covered Patio or Porch Addition"
  ],
  "Roofing & Exterior Renovation": [
    "Roof Replacement or Repair",
    "Gutter Installation or Replacement",
    "Siding Replacement or Exterior Cladding",
    "Exterior Painting or Refinishing",
    "Window Replacement & Installation",
    "Door Replacement",
    "Chimney Repair & Restoration"
  ],
  "Landscaping & Outdoor Living": [
    "General Landscaping Design & Installation",
    "Lawn Irrigation System Installation",
    "Driveway Paving or Replacement",
    "Patio or Deck Construction",
    "Outdoor Kitchen Installation",
    "Pergola or Gazebo Installation",
    "Fire Pit or Outdoor Fireplace Installation",
    "Fence Installation or Repair",
    "Retaining Wall Installation",
    "Swimming Pool Construction",
    "Hot Tub or Spa Installation",
    "Pond or Water Feature Installation",
    "Outdoor Lighting Installation"
  ],
  "Structural & Utility Work": [
    "Foundation Repair or Reinforcement",
    "Crawl Space Encapsulation",
    "Seismic Retrofitting",
    "Energy-Efficient Window & Door Upgrades",
    "Waterproofing & Drainage Solutions"
  ],
  "Electrical & Smart Home Upgrades": [
    "General Electrical Work & Rewiring",
    "Home Automation & Smart Home Installation",
    "EV Charging Station Installation",
    "Solar Panel Installation",
    "Backup Generator Installation",
    "Security System & Surveillance Installation",
    "Indoor/Outdoor Lighting Upgrades"
  ],
  "Plumbing & HVAC": [
    "General Plumbing Work",
    "Water Heater Replacement or Tankless Upgrade",
    "Whole-House Repiping",
    "Sewer Line Repair or Replacement",
    "Gas Line Installation or Repair",
    "Well Water & Filtration System Installation",
    "HVAC System Replacement or Installation",
    "Ductwork Installation or Cleaning",
    "Radiant Floor Heating Installation",
    "Whole-House Humidifier or Dehumidifier Installation"
  ],
  "Specialty & Custom Projects": [
    "Custom Home Build",
    "Tiny Home Construction",
    "Barn or Shed Construction",
    "Home Theater or Media Room Installation",
    "Wine Cellar or Home Bar Installation",
    "Home Office Buildout or Soundproofing",
    "Custom Staircase Installation",
    "Safe Room or Storm Shelter Installation",
    "Pet-Friendly Home Modifications"
  ]
};

const primaryCategories = Object.keys(projectTypes);

export const PendingQuoteCard: React.FC<PendingQuoteCardProps> = ({
  projectName,
  customerName,
  projectType
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Interior Renovation & Remodeling");
  const [selectedType, setSelectedType] = useState(projectType);
  const [showPaymentSchedule, setShowPaymentSchedule] = useState(false);
  const [showMaterialsStore, setShowMaterialsStore] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    const standardTasks = getStandardTasks(selectedCategory, selectedType);
    if (standardTasks.length > 0) {
      const formattedTasks: Task[] = standardTasks.map((task, index) => ({
        id: `standard-${index}`,
        title: task.title,
        description: task.description,
        timeframe: task.timeframe,
        timeframeUnit: task.timeframeUnit,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(new Date().setDate(new Date().getDate() + (task.timeframe * (task.timeframeUnit === 'weeks' ? 7 : 1)))).toISOString().split('T')[0]
      }));
      setTasks(formattedTasks);
    }
  }, [selectedCategory, selectedType]);

  const handleAddTask = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString()
    };
    setTasks(prev => [...prev, newTask]);
    setShowTaskForm(false);
  };

  const handleEditTask = (task: Task) => {
    setTasks(prev => prev.map(t => t.id === task.id ? task : t));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const handleOpenMaterialsStore = (task: Task) => {
    setSelectedTask(task);
    setShowMaterialsStore(true);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
  };

  const handleCreatePaymentSchedule = () => {
    setShowPaymentSchedule(true);
  };

  const handleSubmitForApproval = () => {
    // Handle submission for approval
    console.log('Submitting for approval');
  };

  const handleSavePaymentSchedule = (payments: Array<{taskId: string, amount: number}>) => {
    // Update tasks with payment information
    const updatedTasks = tasks.map(task => {
      const payment = payments.find(p => p.taskId === task.id);
      if (payment) {
        return {
          ...task,
          isMilestonePayment: true,
          paymentAmount: payment.amount
        };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  const calculateProjectSummary = () => {
    const totalMaterialsCost = tasks.reduce((sum, task) => {
      return sum + (task.materials?.reduce((materialSum, material) => 
        materialSum + (material.price * material.quantity), 0) || 0);
    }, 0);

    const totalLaborCost = tasks.reduce((sum, task) => {
      return sum + ((task.labor?.hours || 0) * (task.labor?.rate || 0));
    }, 0);

    const totalTimeframe = tasks.reduce((sum, task) => {
      const multiplier = task.timeframeUnit === 'weeks' ? 7 : task.timeframeUnit === 'months' ? 30 : 1;
      return sum + (task.timeframe * multiplier);
    }, 0);

    return {
      totalCost: totalMaterialsCost + totalLaborCost,
      totalTasks: tasks.length,
      totalDays: totalTimeframe
    };
  };

  const projectSummary = calculateProjectSummary();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatTimeframe = (days: number) => {
    if (days < 7) return `${days} days`;
    if (days < 30) {
      const weeks = Math.floor(days / 7);
      const remainingDays = days % 7;
      return `${weeks} week${weeks > 1 ? 's' : ''}${remainingDays ? ` ${remainingDays} day${remainingDays > 1 ? 's' : ''}` : ''}`;
    }
    const months = Math.floor(days / 30);
    const remainingDays = days % 30;
    return `${months} month${months > 1 ? 's' : ''}${remainingDays ? ` ${remainingDays} day${remainingDays > 1 ? 's' : ''}` : ''}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div 
        className="px-6 py-5 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative inline-block">
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setSelectedType(projectTypes[e.target.value as keyof typeof projectTypes][0]);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="text-xl font-bold text-gray-900 border-0 bg-transparent focus:ring-0 cursor-pointer hover:text-blue-600 transition-colors appearance-none pr-8"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0 center',
                    backgroundSize: '1.25em 1.25em',
                    backgroundRepeat: 'no-repeat'
                  }}
                >
                  {primaryCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <PaymentScheduleButton onClick={handleCreatePaymentSchedule} tasks={tasks} />
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSubmitForApproval();
                }}
              >
                Submit for Approval
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-2 min-w-fit">
              <span className="text-sm font-medium text-gray-500">Customer:</span>
              <span className="text-sm font-semibold text-gray-900">{customerName}</span>
            </div>
            <div className="text-gray-400 hidden sm:block">|</div>
            <div className="relative inline-block">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="text-sm font-medium text-gray-900 border-0 bg-transparent focus:ring-0 cursor-pointer hover:text-blue-600 transition-colors appearance-none pr-8"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 0 center',
                  backgroundSize: '1.25em 1.25em',
                  backgroundRepeat: 'no-repeat'
                }}
              >
                {projectTypes[selectedCategory as keyof typeof projectTypes].map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center text-gray-500 mb-1">
                <DollarSign className="w-4 h-4 mr-1" />
                <span className="text-sm">Total Cost</span>
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {formatCurrency(projectSummary.totalCost)}
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center text-gray-500 mb-1">
                <Clock className="w-4 h-4 mr-1" />
                <span className="text-sm">Total Time</span>
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {formatTimeframe(projectSummary.totalDays)}
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center text-gray-500 mb-1">
                <Calendar className="w-4 h-4 mr-1" />
                <span className="text-sm">Total Tasks</span>
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {projectSummary.totalTasks}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="p-6">
          {showTaskForm ? (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Task</h3>
              <TaskForm
                onSubmit={handleAddTask}
                onCancel={() => setShowTaskForm(false)}
              />
            </div>
          ) : (
            <button
              onClick={() => setShowTaskForm(true)}
              className="mb-6 flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Task
            </button>
          )}

          <TaskList
            tasks={tasks}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onOpenMaterialsStore={handleOpenMaterialsStore}
          />
        </div>
      )}

      {/* Materials Store Modal */}
      <MaterialsStore
        isOpen={showMaterialsStore}
        onClose={() => setShowMaterialsStore(false)}
        task={selectedTask}
        onUpdateTask={handleUpdateTask}
        tasks={tasks}
      />

      {/* Payment Schedule Form */}
      <PaymentScheduleForm
        isOpen={showPaymentSchedule}
        onClose={() => setShowPaymentSchedule(false)}
        customerName={customerName}
        projectName={projectName}
        tasks={tasks}
        onSave={handleSavePaymentSchedule}
      />
    </div>
  );
};