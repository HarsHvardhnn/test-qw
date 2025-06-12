import React, { useState } from 'react';
import { Calendar, Clock, DollarSign, MessageSquare, AlertCircle, CheckCircle, ChevronLeft, FileText, Users, Plus, UserPlus } from 'lucide-react';
import { TaskList } from './TaskList';
import { TaskForm } from '../projects/TaskForm';
import { Task } from './types';
import { ChangeOrderButton } from './ChangeOrderButton';
import { AssignStakeholderModal } from './AssignStakeholderModal';
import axiosInstance from '../../../axios';
import { useConversation } from '../../../customer/context/ConversationContext';
import { jwtDecode } from 'jwt-decode';

interface ProjectDetails {
  id: number;
  name: string;
  customerName: string;
  projectType: string;
  status: 'in-progress' | 'completed' | 'on-hold' | 'active';
  progress: number;
  nextMilestone: string;
  nextPayment: string;
  dueDate: string;
  totalAmount: string;
  isApproved?: boolean;
  tasks: Task[];
  stakeholders: Array<{
    id: string;
    name: string;
    role: string;
    email: string;
    phone: string;
  }>;
  documents: Array<{
    id: string;
    name: string;
    type: string;
    date: string;
    url: string;
  }>;
}

interface ProjectManagementProps {
  project: ProjectDetails;
  onBack: () => void;
  quoteId:string;
}

export const ProjectManagement: React.FC<ProjectManagementProps> = ({
  project,
  onBack,
  quoteId
}) => {
  console.log('project details',project);
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'stakeholders' | 'documents'>('overview');
  const [showTaskForm, setShowTaskForm] = useState(false);
 const [tasks, setTasks] = useState<Task[]>(
   [...project.tasks].sort((a, b) => {
     const dateA = a.startDate ? new Date(a.startDate) : null;
     const dateB = b.startDate ? new Date(b.startDate) : null;

     if (!dateA && !dateB) return 0;
     if (!dateA) return 1;
     if (!dateB) return -1;

     return dateA.getTime() - dateB.getTime();
   })
 );

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [stakeholders, setStakeholders] = useState(project?.stakeholders || []);
  const { addConversation , clearconvo} = useConversation();


  const addTaskToQuote = async (quoteId, taskData) => {
    try {
      const response = await axiosInstance.post(`/quote/v2/single/${quoteId}/tasks`, taskData);
      return response.data;
    } catch (error) {
      console.error("Error adding task:", error.response?.data || error.message);
      throw error;
    }
  };

  const handleAddTask = async (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`
    };
    console.log('new task',taskData)
 await addTaskToQuote(quoteId, {
   ...taskData, // preserve existing fields
   isAdditional: true, // or false, based on your logic
 });

    setTasks(prev => [...prev, newTask]);

    setShowTaskForm(false);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
  };

  const handleAssignStakeholders = (newStakeholders: Array<{
    id: string;
    name: string;
    role: string;
    company: string;
  }>) => {
    // Convert the assigned stakeholders to the project's stakeholder format
    const formattedStakeholders = newStakeholders.map(stakeholder => ({
      id: stakeholder.id,
      name: stakeholder.name,
      role: stakeholder.role,
      email: `${stakeholder.name.toLowerCase().replace(' ', '.')}@${stakeholder.company.toLowerCase().replace(' ', '')}.com`,
      phone: '(555) 123-4567' // In a real app, this would come from the stakeholder data
    }));

    // Add new stakeholders to the existing list
    setStakeholders(prev => [...prev, ...formattedStakeholders]);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

 const getStatusColor = (status: string) => {
   switch (status) {
     case "completed":
       return "bg-green-100 text-green-800";
     case "in-progress":
       return "bg-blue-100 text-blue-800";
     case "on-hold":
       return "bg-yellow-100 text-yellow-800";
     case "active":
       return "bg-purple-100 text-purple-800";
     default:
       return "bg-gray-100 text-gray-800";
   }
 };


  const handleMessageClick = () => {
    clearconvo()
    const token = localStorage.getItem('token');
    const userId = jwtDecode(token).id;
    console.log('project',project);
    addConversation(userId);
    addConversation(project?.customerId);

 setTimeout(()=>{
  const dashboardLayout = document.querySelector('.min-h-screen.bg-gray-100');
  if (!dashboardLayout) return;

  const messagesButton = dashboardLayout.querySelector('button[aria-label="Open Messages"]');
  if (messagesButton instanceof HTMLButtonElement) {
    messagesButton.click();
  }
 },300)
  };

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              {project.name}
            </h1>
            <p className="text-gray-500">Project ID: P-{project?.projectId?.toString().substring(0,6)}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleMessageClick}
            className="px-4 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors flex items-center"
          >
            {/* do here */}
            <MessageSquare className="w-4 h-4 mr-2" />
            Message Customer
          </button>
          <span
            className={`px-3 py-1 text-sm font-medium rounded-full capitalize ${getStatusColor(
              project.status
            )}`}
          >
           {project?.status=="active"?"Approved":project?.status}
          </span>
        </div>
      </div>

      {/* Project Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-50 text-blue-700">
              <DollarSign className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-blue-600">
              Total Amount
            </span>
          </div>
          <h3 className="text-2xl font-semibold text-gray-900">
            {Number(project.totalAmount).toFixed(2)}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Next Payment: {project.nextPayment}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-green-50 text-green-700">
              <CheckCircle className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-green-600">Progress</span>
          </div>
          <h3 className="text-2xl font-semibold text-gray-900">
            {project.progress}%
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Next: {project.nextMilestone}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-purple-50 text-purple-700">
              <Clock className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-purple-600">
              Timeline
            </span>
          </div>
          <h3 className="text-2xl font-semibold text-gray-900">
            {formatDate(project.dueDate)}
          </h3>
          <p className="text-sm text-gray-500 mt-1">Project Due Date</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-orange-50 text-orange-700">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-orange-600">
              Stakeholders
            </span>
          </div>
          <h3 className="text-2xl font-semibold text-gray-900">
            {stakeholders.length}
          </h3>
          <p className="text-sm text-gray-500 mt-1">Active Members</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === "overview"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("tasks")}
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === "tasks"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Tasks & Milestones
            </button>
            <button
              onClick={() => setActiveTab("stakeholders")}
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === "stakeholders"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Stakeholders
            </button>
            <button
              onClick={() => setActiveTab("documents")}
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === "documents"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Documents
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Project Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Project Details
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Customer</p>
                      <p className="text-sm font-medium text-gray-900">
                        {project.customerName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Project Type</p>
                      <p className="text-sm font-medium text-gray-900">
                        {project.projectType}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          project.status
                        )}`}
                      >
                        {project.status.charAt(0).toUpperCase() +
                          project.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Recent Activity
                  </h3>
                  <div className="space-y-4">
                    {tasks.slice(0, 3).map((task) => (
                      <div key={task.id} className="flex items-start">
                        <div
                          className={`p-2 rounded-lg mr-3 ${
                            task.status === "completed"
                              ? "bg-green-100"
                              : task.status === "in-progress"
                              ? "bg-blue-100"
                              : "bg-gray-100"
                          }`}
                        >
                          {task.status === "completed" ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : task.status === "in-progress" ? (
                            <Clock className="w-4 h-4 text-blue-600" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-gray-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {task.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Due: {formatDate(task.dueDate)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Progress Timeline */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Progress Timeline
                </h3>
                <div className="relative">
                  <div className="absolute top-0 left-5 h-full w-0.5 bg-gray-200"></div>
                  <div className="space-y-6">
                    {tasks.map((task, index) => (
                      <div key={task.id} className="relative flex items-start">
                        <div
                          className={`absolute left-5 w-3 h-3 rounded-full transform -translate-x-1.5 mt-1.5 ${
                            task.status === "completed"
                              ? "bg-green-500"
                              : task.status === "in-progress"
                              ? "bg-blue-500"
                              : "bg-gray-300"
                          }`}
                        ></div>
                        <div className="ml-10">
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-gray-900">
                              {task.title}
                            </p>
                            {task.paymentAmount && (
                              <span
                                className={`ml-3 px-2 py-0.5 text-xs font-medium rounded-full ${
                                  task.paymentStatus === "approved"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                ${task.paymentAmount.toLocaleString()}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Due: {formatDate(task.dueDate)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === "tasks" && (
            <div className="space-y-6">
              {/* Buttons Row */}
              {!showTaskForm && (
                <div className="mb-6 flex flex-wrap gap-4">
                  <button
                    onClick={() => setShowTaskForm(true)}
                    className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    {project.status === "active"
                      ? "Add Additional Scope"
                      : "Add Task"}
                  </button>

                  {project.status === "active" && (
                    <ChangeOrderButton
                      tasks={tasks}
                      onCreateChangeOrder={(changeOrder) => {
                        console.log("Change order created:", changeOrder);
                      }}
                    />
                  )}
                </div>
              )}

              {/* Task Form */}
              {showTaskForm && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Add New Task
                  </h3>
                  <TaskForm
                    isAdditional={project.status == "active"}
                    onSubmit={handleAddTask}
                    onCancel={() => setShowTaskForm(false)}
                  />
                </div>
              )}

              {/* Task List */}
              <TaskList tasks={tasks} onUpdateTask={handleUpdateTask} />
            </div>
          )}

          {activeTab === "stakeholders" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Project Stakeholders
                </h3>
                <button
                  onClick={() => setShowAssignModal(true)}
                  className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors flex items-center"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Stakeholder
                </button>
              </div>

              {stakeholders.map((stakeholder) => (
                <div
                  key={stakeholder.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        {stakeholder.name}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {stakeholder.role}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-xs text-gray-500">
                          {stakeholder.email}
                        </span>
                        <span className="text-xs text-gray-500">
                          {stakeholder.phone}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={handleMessageClick}
                      className="px-3 py-1.5 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      Message
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "documents" && (
            <div className="space-y-4">
              {project.documents?.map((document) => (
                <div
                  key={document.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <FileText className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          {document.name}
                        </h4>
                        <p className="text-xs text-gray-500">
                          Added on {formatDate(document.date)}
                        </p>
                      </div>
                    </div>
                    <button className="text-sm text-blue-600 hover:text-blue-800">
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Assign Stakeholder Modal */}
      <AssignStakeholderModal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        onAssign={handleAssignStakeholders}
        existingStakeholders={stakeholders}
      />
    </div>
  );
};