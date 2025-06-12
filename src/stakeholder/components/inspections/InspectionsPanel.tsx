import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import { InspectionsSummary } from './InspectionsSummary';
import { InspectionsFilters } from './InspectionsFilters';
import { InspectionsList } from './InspectionsList';
import { InspectionDetailModal } from './InspectionDetailModal';
import { ScheduleInspectionModal } from './ScheduleInspectionModal';
import { InspectionDetailCard } from './InspectionDetailCard';
import { Inspection } from './types';

export const InspectionsPanel: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  
  // Sample inspections data
  const [inspections, setInspections] = useState<Inspection[]>([
    {
      id: 'insp-001',
      projectId: 1,
      projectName: 'Smith Home Remodel',
      contractor: 'J9 Construction',
      milestone: 'Foundation Complete',
      address: '123 Main St, Anytown, CA 90210',
      inspector: 'John Smith',
      scheduledDate: '2025-06-15',
      status: 'scheduled'
    },
    {
      id: 'insp-002',
      projectId: 2,
      projectName: 'Johnson Kitchen Renovation',
      contractor: 'Modern Designs Inc.',
      milestone: 'Cabinets Installed',
      address: '456 Oak Ave, Somewhere, NY 10001',
      inspector: 'Emily Johnson',
      scheduledDate: '2025-06-10',
      status: 'completed',
      report: {
        id: 'rep-001',
        date: '2025-06-10',
        notes: 'All cabinets properly installed according to specifications. Hardware is secure and doors are properly aligned.',
        photos: [
          'https://images.unsplash.com/photo-1556910638-b02598397b3f?auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1556911220-bda9f7b24446?auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1556911261-6bd341186b2f?auto=format&fit=crop&q=80'
        ],
        checklist: [
          { id: 'c1', name: 'Materials Quality', passed: true },
          { id: 'c2', name: 'Installation', passed: true },
          { id: 'c3', name: 'Workmanship', passed: true },
          { id: 'c4', name: 'Safety', passed: true }
        ]
      }
    },
    {
      id: 'insp-003',
      projectId: 3,
      projectName: 'Davis Bathroom Remodel',
      contractor: 'Luxury Bath Solutions',
      milestone: 'Plumbing Rough-In',
      address: '789 Elm St, Elsewhere, TX 75001',
      inspector: 'Michael Brown',
      scheduledDate: '2025-06-08',
      status: 'failed',
      report: {
        id: 'rep-002',
        date: '2025-06-08',
        notes: 'Plumbing rough-in failed inspection due to improper pipe sizing and inadequate support.',
        photos: [
          'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1584622650111-993a426fbf0b?auto=format&fit=crop&q=80'
        ],
        issues: [
          'Drain pipe slope insufficient (less than 1/4" per foot)',
          'Missing pipe supports within 12" of fixtures',
          'Improper venting configuration'
        ],
        checklist: [
          { id: 'c1', name: 'Materials Quality', passed: true },
          { id: 'c2', name: 'Installation', passed: false, notes: 'Improper installation of drain pipes' },
          { id: 'c3', name: 'Workmanship', passed: false, notes: 'Poor workmanship on pipe supports' },
          { id: 'c4', name: 'Safety', passed: true }
        ]
      }
    },
    {
      id: 'insp-004',
      projectId: 4,
      projectName: 'Wilson Basement Finishing',
      contractor: 'Basement Experts LLC',
      milestone: 'Framing Complete',
      address: '101 Pine Rd, Nowhere, IL 60601',
      inspector: 'Sarah Davis',
      scheduledDate: '2025-06-20',
      status: 'scheduled'
    },
    {
      id: 'insp-005',
      projectId: 7,
      projectName: 'Brown Pool Installation',
      contractor: 'Aqua Pools & Spas',
      milestone: 'Plumbing Installation',
      address: '404 Birch Ave, Somewhere Town, AZ 85001',
      scheduledDate: '2025-06-25',
      status: 'pending'
    }
  ]);

  // Projects that need inspection
  const projectsNeedingInspection = [
    { id: 5, name: 'Thompson Roof Replacement', milestone: 'Final Inspection' },
    { id: 6, name: 'Garcia Deck Construction', milestone: 'Foundation & Framing' },
    { id: 7, name: 'Brown Pool Installation', milestone: 'Plumbing Installation' }
  ];

  // Filter inspections based on search term and status filter
  const filteredInspections = inspections.filter(inspection => {
    const matchesSearch = inspection.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inspection.contractor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inspection.milestone.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || inspection.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Handle marking inspection as passed
  const handleMarkAsPassed = (id: string) => {
    setInspections(prev => prev.map(inspection => 
      inspection.id === id ? { 
        ...inspection, 
        status: 'completed',
        report: {
          id: `rep-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          notes: 'Inspection passed successfully. All work meets required standards and specifications.',
          photos: [],
          checklist: [
            { id: 'c1', name: 'Materials Quality', passed: true },
            { id: 'c2', name: 'Installation', passed: true },
            { id: 'c3', name: 'Workmanship', passed: true },
            { id: 'c4', name: 'Safety', passed: true }
          ]
        }
      } : inspection
    ));
    setSelectedInspection(null);
  };

  // Handle marking inspection as failed
  const handleMarkAsFailed = (id: string, reason: string) => {
    setInspections(prev => prev.map(inspection => 
      inspection.id === id ? { 
        ...inspection, 
        status: 'failed',
        report: {
          id: `rep-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          notes: reason,
          photos: [],
          issues: [reason],
          checklist: [
            { id: 'c1', name: 'Materials Quality', passed: true },
            { id: 'c2', name: 'Installation', passed: false, notes: reason },
            { id: 'c3', name: 'Workmanship', passed: false, notes: reason },
            { id: 'c4', name: 'Safety', passed: true }
          ]
        }
      } : inspection
    ));
    setSelectedInspection(null);
  };

  // Handle rescheduling inspection
  const handleReschedule = (id: string, newDate: string) => {
    setInspections(prev => prev.map(inspection => 
      inspection.id === id ? { ...inspection, scheduledDate: newDate } : inspection
    ));
    setSelectedInspection(null);
  };

  // Handle scheduling new inspection
  const handleScheduleInspection = (projectId: number, milestone: string, date: string, inspector: string) => {
    const project = projectsNeedingInspection.find(p => p.id === projectId);
    if (project) {
      const newInspection: Inspection = {
        id: `insp-${Date.now()}`,
        projectId,
        projectName: project.name,
        contractor: 'Contractor Name', // This would come from the project data in a real app
        milestone,
        address: '123 Sample St, City, State 12345', // This would come from the project data in a real app
        inspector,
        scheduledDate: date,
        status: 'scheduled'
      };
      setInspections(prev => [...prev, newInspection]);
    }
    setShowScheduleModal(false);
  };

  // Calculate summary statistics
  const scheduledCount = inspections.filter(i => i.status === 'scheduled').length;
  const completedCount = inspections.filter(i => i.status === 'completed').length;
  const failedCount = inspections.filter(i => i.status === 'failed').length;
  const pendingCount = inspections.filter(i => i.status === 'pending').length;

  // Get upcoming inspections (next 7 days)
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  
  const upcomingInspections = inspections
    .filter(i => i.status === 'scheduled' && new Date(i.scheduledDate) <= nextWeek)
    .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Inspections</h1>
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-500">Last updated: Today, 10:45 AM</span>
        </div>
      </div>

      {/* Summary Cards */}
      <InspectionsSummary 
        scheduledCount={scheduledCount}
        pendingCount={pendingCount}
        completedCount={completedCount}
        failedCount={failedCount}
      />

      {/* Upcoming Inspections */}
      {upcomingInspections.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Inspections</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingInspections.map(inspection => (
              <InspectionDetailCard 
                key={inspection.id} 
                inspection={inspection} 
                onViewFull={() => setSelectedInspection(inspection)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Search and Filter Bar */}
      <InspectionsFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        onScheduleClick={() => setShowScheduleModal(true)}
      />

      {/* Inspections List */}
      <InspectionsList 
        inspections={filteredInspections}
        onSelectInspection={setSelectedInspection}
        onMarkPassed={handleMarkAsPassed}
      />

      {/* Inspection Detail Modal */}
      {selectedInspection && (
        <InspectionDetailModal
          inspection={selectedInspection}
          onClose={() => setSelectedInspection(null)}
          onApprove={handleMarkAsPassed}
          onFail={handleMarkAsFailed}
          onReschedule={handleReschedule}
        />
      )}

      {/* Schedule Inspection Modal */}
      {showScheduleModal && (
        <ScheduleInspectionModal
          onClose={() => setShowScheduleModal(false)}
          onSchedule={handleScheduleInspection}
          projects={projectsNeedingInspection}
        />
      )}
    </div>
  );
};