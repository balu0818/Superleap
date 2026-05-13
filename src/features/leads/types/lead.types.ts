export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CONVERTED' | 'LOST';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  status: LeadStatus;
  source: string | null;
  created_at: string;
  updated_at: string;
}

export type CreateLeadInput = {
  name: string;
  email: string;
  phone?: string;
  source?: string;
};

export type UpdateLeadInput = Partial<CreateLeadInput>;
