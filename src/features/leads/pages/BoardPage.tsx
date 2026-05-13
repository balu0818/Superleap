import * as React from 'react';
import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  DndContext, 
  DragOverlay, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragStartEvent,
  DragEndEvent
} from '@dnd-kit/core';
import { 
  SortableContext, 
  arrayMove, 
  sortableKeyboardCoordinates,
  rectSortingStrategy
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Search } from 'lucide-react';

import { useLeads, useUpdateLeadStatus } from '../hooks/useLeads';
import { Lead, LeadStatus } from '../types/lead.types';
import { LeadStatusBadge } from '../components/LeadStatusBadge';
import { cn } from '../../../lib/utils';

const STATUSES: LeadStatus[] = ['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'LOST'];

export default function BoardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('q') || '';
  
  const { data: leads, isLoading } = useLeads({ q: search });
  const updateStatusMutation = useUpdateLeadStatus();

  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const columns = useMemo(() => {
    if (!leads) return {} as Record<LeadStatus, Lead[]>;
    const cols: Record<LeadStatus, Lead[]> = {
      NEW: [],
      CONTACTED: [],
      QUALIFIED: [],
      CONVERTED: [],
      LOST: []
    };
    leads.forEach(lead => {
      cols[lead.status].push(lead);
    });
    return cols;
  }, [leads]);

  const activeLead = useMemo(() => leads?.find(l => l.id === activeId), [activeId, leads]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const getValidNextStatuses = (currentStatus: LeadStatus): LeadStatus[] => {
    if (currentStatus === 'CONVERTED' || currentStatus === 'LOST') return [];
    if (currentStatus === 'NEW') return ['NEW', 'CONTACTED', 'LOST'];
    if (currentStatus === 'CONTACTED') return ['CONTACTED', 'QUALIFIED', 'LOST'];
    if (currentStatus === 'QUALIFIED') return ['QUALIFIED', 'CONVERTED', 'LOST'];
    return [currentStatus];
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const leadId = active.id as string;
    const overId = over.id as string;

    const lead = leads?.find(l => l.id === leadId);
    if (!lead) return;

    // Check if over is a column
    let newStatus = overId as LeadStatus;
    
    // If over is another card, find its status
    if (!STATUSES.includes(overId as LeadStatus)) {
      const overLead = leads?.find(l => l.id === overId);
      if (overLead) newStatus = overLead.status;
    }

    if (lead.status === newStatus) return; // No change

    const validTransitions = getValidNextStatuses(lead.status);
    
    if (validTransitions.includes(newStatus)) {
      updateStatusMutation.mutate({ id: lead.id, status: newStatus });
    } else {
      // Invalid transition, reject visually (dnd-kit will snap back since we don't update state)
      alert(`Invalid transition from ${lead.status} to ${newStatus}`);
    }
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading board...</div>;

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="px-6 py-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Board</h1>
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search leads..."
            value={search}
            onChange={(e) => {
              const newParams = new URLSearchParams(searchParams);
              if (e.target.value) newParams.set('q', e.target.value);
              else newParams.delete('q');
              setSearchParams(newParams);
            }}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
      </div>

      <div className="flex-1 overflow-x-auto p-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-6 h-full items-start">
            {STATUSES.map(status => (
              <Column key={status} status={status} leads={columns[status] || []} />
            ))}
          </div>

          <DragOverlay>
            {activeLead ? <LeadCard lead={activeLead} isOverlay /> : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}

const Column: React.FC<{ status: LeadStatus, leads: Lead[] }> = ({ status, leads }) => {
  // Use status as the id for the column so we can drop onto empty columns
  const colIds = leads.map(l => l.id);

  return (
    <div className="flex flex-col w-72 flex-shrink-0 max-h-full">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <LeadStatusBadge status={status} />
          <span className="text-xs font-medium text-gray-500">{leads.length}</span>
        </div>
      </div>
      
      <div className={cn(
        "flex-1 bg-gray-100/50 rounded-lg p-3 overflow-y-auto border border-gray-200/50 min-h-[150px]",
        (status === 'CONVERTED' || status === 'LOST') && "opacity-75"
      )}>
        <SortableContext id={status} items={colIds} strategy={rectSortingStrategy}>
          <div className="space-y-3">
            {leads.map(lead => (
              <SortableLeadCard key={lead.id} lead={lead} />
            ))}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}

const SortableLeadCard: React.FC<{ lead: Lead }> = ({ lead }) => {
  const isLocked = lead.status === 'CONVERTED' || lead.status === 'LOST';
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: lead.id, data: lead, disabled: isLocked });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className={cn("touch-none", isDragging && "opacity-0", isLocked && "cursor-not-allowed")}>
      <LeadCard lead={lead} />
    </div>
  );
}

function LeadCard({ lead, isOverlay }: { lead: Lead, isOverlay?: boolean }) {
  const isLocked = lead.status === 'CONVERTED' || lead.status === 'LOST';

  return (
    <div className={cn(
      "bg-white p-3 rounded-md border border-gray-200 shadow-sm transition-shadow",
      isOverlay ? "shadow-xl rotate-2 cursor-grabbing" : "hover:shadow cursor-grab",
      isLocked && !isOverlay && "opacity-75 bg-gray-50"
    )}>
      <div className="font-medium text-sm text-gray-900 mb-1">{lead.name}</div>
      <div className="text-xs text-gray-500 mb-3 truncate">{lead.email}</div>
      <div className="flex items-center justify-between mt-auto">
        <span className="text-[10px] text-gray-400 capitalize bg-gray-100 px-1.5 py-0.5 rounded">
          {lead.source || 'Direct'}
        </span>
        <span className="text-[10px] text-gray-400">
          {format(new Date(lead.updated_at), 'MMM d')}
        </span>
      </div>
    </div>
  );
}
