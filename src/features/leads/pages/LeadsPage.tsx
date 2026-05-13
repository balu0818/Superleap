import * as React from 'react';
import { useState, useMemo, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useVirtualizer } from '@tanstack/react-virtual';
import { format } from 'date-fns';
import { Search, Plus, MoreHorizontal, Edit, Trash2, CheckCircle2 } from 'lucide-react';
import { useLeads, useCreateLead, useUpdateLead, useDeleteLead, useUpdateLeadStatus, useBulkUpdateLeadStatus, useBulkDeleteLeads } from '../hooks/useLeads';
import { LeadStatusBadge } from '../components/LeadStatusBadge';
import { LeadForm } from '../components/LeadForm';
import { Button } from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import { Modal } from '../../../components/ui/Modal';
import { Lead, LeadStatus, CreateLeadInput } from '../types/lead.types';

const STATUSES: LeadStatus[] = ['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'LOST'];

export default function LeadsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('q') || '';
  const statusFilter = searchParams.get('status') || '';

  const { data: leads, isLoading, isError, error } = useLeads({ q: search, status: statusFilter });

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [deletingLead, setDeletingLead] = useState<Lead | null>(null);
  
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const createMutation = useCreateLead();
  const updateMutation = useUpdateLead();
  const deleteMutation = useDeleteLead();
  const updateStatusMutation = useUpdateLeadStatus();
  const bulkUpdateStatusMutation = useBulkUpdateLeadStatus();
  const bulkDeleteMutation = useBulkDeleteLeads();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newParams = new URLSearchParams(searchParams);
    if (e.target.value) newParams.set('q', e.target.value);
    else newParams.delete('q');
    setSearchParams(newParams);
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newParams = new URLSearchParams(searchParams);
    if (e.target.value) newParams.set('status', e.target.value);
    else newParams.delete('status');
    setSearchParams(newParams);
  };

  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: leads?.length || 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56, // 56px row height
    overscan: 10,
  });

  const toggleSelectAll = () => {
    if (selectedIds.size === leads?.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(leads?.map(l => l.id) || []));
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedIds(newSelected);
  };

  const getValidNextStatuses = (currentStatus: LeadStatus): LeadStatus[] => {
    if (currentStatus === 'CONVERTED' || currentStatus === 'LOST') return [];
    if (currentStatus === 'NEW') return ['CONTACTED', 'LOST'];
    if (currentStatus === 'CONTACTED') return ['QUALIFIED', 'LOST'];
    if (currentStatus === 'QUALIFIED') return ['CONVERTED', 'LOST'];
    return [];
  };

  // UI helpers
  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading leads...</div>;
  if (isError) return <div className="p-8 text-center text-red-500">Error loading leads: {(error as Error).message}</div>;

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
        <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" /> Add Lead
        </Button>
      </div>

      <div className="px-6 py-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-gray-50/50 border-b border-gray-100">
        <div className="flex flex-1 gap-4 w-full sm:w-auto">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={handleSearchChange}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
          <select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">All Statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-md border border-blue-100 text-sm">
            <span className="font-medium text-blue-700">{selectedIds.size} selected</span>
            <div className="h-4 w-px bg-blue-200" />
            
            <select
              className="text-sm bg-white border border-blue-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
              onChange={(e) => {
                const targetStatus = e.target.value as LeadStatus;
                if (!targetStatus) return;
                
                bulkUpdateStatusMutation.mutate(
                  Array.from<string>(selectedIds).map(id => ({ id, status: targetStatus })),
                  {
                    onSuccess: (res) => {
                      setSelectedIds(new Set());
                      alert(`Updated ${res.successful} leads successfully. ${res.failed} failed.`);
                    }
                  }
                );
                e.target.value = '';
              }}
              defaultValue=""
            >
              <option value="" disabled>Change status to...</option>
              {STATUSES.map(s => {
                // Only allow if valid for ALL selected
                const allValid = Array.from(selectedIds).every(id => {
                  const lead = leads?.find(l => l.id === id);
                  return lead && getValidNextStatuses(lead.status).includes(s);
                });
                return <option key={s} value={s} disabled={!allValid}>{s}</option>;
              })}
            </select>
            
            <div className="h-4 w-px bg-blue-200" />
            <Button size="sm" variant="destructive" onClick={() => {
              if (window.confirm(`Delete ${selectedIds.size} leads?`)) {
                bulkDeleteMutation.mutate(Array.from(selectedIds), {
                  onSuccess: (res) => {
                    setSelectedIds(new Set());
                    alert(`Deleted ${res.successful} leads successfully. ${res.failed} failed.`);
                  }
                });
              }
            }}>
              Delete Selected
            </Button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto" ref={parentRef}>
        <div className="min-w-[800px] w-full">
          {/* Table Header */}
          <div className="grid grid-cols-[48px_2fr_2fr_1fr_1fr_1fr_100px] border-b border-gray-200 bg-gray-50 sticky top-0 z-10 px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <div className="flex items-center justify-center">
              <Checkbox 
                checked={leads?.length > 0 && selectedIds.size === leads?.length}
                onChange={toggleSelectAll}
              />
            </div>
            <div>Name</div>
            <div>Email</div>
            <div>Status</div>
            <div>Source</div>
            <div>Last Updated</div>
            <div className="text-right">Actions</div>
          </div>

          {/* Virtualized List */}
          {leads?.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No leads found.</div>
          ) : (
            <div
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                width: '100%',
                position: 'relative',
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const lead = leads![virtualRow.index];
                const isSelected = selectedIds.has(lead.id);
                const nextStatuses = getValidNextStatuses(lead.status);

                return (
                  <div
                    key={lead.id}
                    className="absolute top-0 left-0 w-full grid grid-cols-[48px_2fr_2fr_1fr_1fr_1fr_100px] px-6 py-3 items-center border-b border-gray-100 bg-white hover:bg-gray-50/50 transition-colors"
                    style={{
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    <div className="flex items-center justify-center">
                      <Checkbox 
                        checked={isSelected}
                        onChange={() => toggleSelect(lead.id)}
                      />
                    </div>
                    <div className="font-medium text-gray-900 truncate pr-4">{lead.name}</div>
                    <div className="text-gray-500 text-sm truncate pr-4">{lead.email}</div>
                    <div><LeadStatusBadge status={lead.status} /></div>
                    <div className="text-gray-500 text-sm capitalize">{lead.source || '-'}</div>
                    <div className="text-gray-400 text-sm">
                      {format(new Date(lead.updated_at), 'MMM d, yyyy')}
                    </div>
                    <div className="flex items-center justify-end gap-2">
                       {nextStatuses.length > 0 && (
                         <div className="relative group/actions">
                           <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600">
                             <CheckCircle2 className="w-4 h-4" />
                           </Button>
                           <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg border border-gray-100 p-1 opacity-0 pointer-events-none group-hover/actions:opacity-100 group-hover/actions:pointer-events-auto z-20">
                             <div className="text-xs font-semibold px-2 py-1 text-gray-400 uppercase tracking-wider">Move to</div>
                             {nextStatuses.map(s => (
                               <button 
                                 key={s}
                                 onClick={() => updateStatusMutation.mutate({ id: lead.id, status: s })}
                                 className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-50 rounded text-gray-700"
                               >
                                 {s}
                               </button>
                             ))}
                           </div>
                         </div>
                       )}
                       <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600" onClick={() => setEditingLead(lead)}>
                         <Edit className="w-4 h-4" />
                       </Button>
                       <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-600" onClick={() => setDeletingLead(lead)}>
                         <Trash2 className="w-4 h-4" />
                       </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Lead">
        <LeadForm 
          isLoading={createMutation.isPending}
          onSubmit={(data) => {
            createMutation.mutate(data, {
              onSuccess: () => setIsCreateModalOpen(false)
            });
          }}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editingLead} onClose={() => setEditingLead(null)} title="Edit Lead">
        {editingLead && (
          <LeadForm 
            initialData={editingLead}
            isLoading={updateMutation.isPending}
            onSubmit={(data) => {
              updateMutation.mutate({ id: editingLead.id, data }, {
                onSuccess: () => setEditingLead(null)
              });
            }}
            onCancel={() => setEditingLead(null)}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!deletingLead} onClose={() => setDeletingLead(null)} title="Delete Lead">
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete <span className="font-medium text-gray-900">{deletingLead?.name}</span>? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setDeletingLead(null)}>Cancel</Button>
            <Button variant="destructive" disabled={deleteMutation.isPending} onClick={() => {
              if (deletingLead) {
                deleteMutation.mutate(deletingLead.id, {
                  onSuccess: () => setDeletingLead(null)
                });
              }
            }}>
              {deleteMutation.isPending ? 'Deleting...' : 'Delete Lead'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
