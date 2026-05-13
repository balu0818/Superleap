import { Lead, CreateLeadInput, UpdateLeadInput, LeadStatus } from '../types/lead.types';

const API_BASE = '/api/leads';

export const getLeads = async (params?: { status?: string, q?: string }): Promise<Lead[]> => {
  const url = new URL(API_BASE, window.location.origin);
  if (params?.status) url.searchParams.append('status', params.status);
  if (params?.q) url.searchParams.append('q', params.q);
  
  const response = await fetch(url.toString());
  if (!response.ok) throw new Error('Failed to fetch leads');
  return response.json();
};

export const getLead = async (id: string): Promise<Lead> => {
  const response = await fetch(`${API_BASE}/${id}`);
  if (!response.ok) throw new Error('Failed to fetch lead');
  return response.json();
};

export const createLead = async (data: CreateLeadInput): Promise<Lead> => {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create lead');
  return response.json();
};

export const updateLead = async (id: string, data: UpdateLeadInput): Promise<Lead> => {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update lead');
  return response.json();
};

export const updateLeadStatus = async (id: string, status: LeadStatus): Promise<Lead> => {
  const response = await fetch(`${API_BASE}/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to update lead status');
  }
  return response.json();
};

export const deleteLead = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Failed to delete lead');
};

export const bulkDeleteLeads = async (ids: string[]) => {
  const results = await Promise.allSettled(ids.map(id => deleteLead(id)));
  
  const successful = results.filter(r => r.status === 'fulfilled').length;
  const failed = results.filter(r => r.status === 'rejected').length;
  return {
    total: ids.length,
    successful,
    failed,
    results: results.map((r, index) => ({
      index,
      success: r.status === 'fulfilled',
      id: ids[index],
      error: r.status === 'rejected' ? r.reason.message : undefined
    }))
  };
};

export const bulkUpdateLeadStatus = async (leads: { id: string, status: LeadStatus }[]) => {
  const results = await Promise.allSettled(
    leads.map(({ id, status }) => updateLeadStatus(id, status))
  );
  
  const successful = results.filter(r => r.status === 'fulfilled').length;
  const failed = results.filter(r => r.status === 'rejected').length;
  return {
    total: leads.length,
    successful,
    failed,
    results: results.map((r, index) => ({
      index,
      success: r.status === 'fulfilled',
      lead: r.status === 'fulfilled' ? r.value : undefined,
      error: r.status === 'rejected' ? r.reason.message : undefined
    }))
  };
};
