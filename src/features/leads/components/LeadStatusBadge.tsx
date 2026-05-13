import * as React from 'react';
import { Badge, BadgeProps } from '../../../components/ui/Badge';
import { LeadStatus } from '../types/lead.types';
import { cn } from '../../../lib/utils';

interface Props {
  status: LeadStatus;
  className?: string;
}

const statusConfig: Record<LeadStatus, { label: string, variant: BadgeProps['variant'] }> = {
  NEW: { label: 'New', variant: 'info' },
  CONTACTED: { label: 'Contacted', variant: 'warning' },
  QUALIFIED: { label: 'Qualified', variant: 'default' },
  CONVERTED: { label: 'Converted', variant: 'success' },
  LOST: { label: 'Lost', variant: 'destructive' },
};

export function LeadStatusBadge({ status, className }: Props) {
  const config = statusConfig[status];
  if (!config) return null;
  return (
    <Badge variant={config.variant} className={cn("uppercase text-[10px] tracking-wider font-bold", className)}>
      {config.label}
    </Badge>
  );
}
