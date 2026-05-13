import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../../../components/ui/Button';
import { Lead, CreateLeadInput } from '../types/lead.types';

const leadSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  source: z.string().optional(),
});

type LeadFormData = z.infer<typeof leadSchema>;

interface Props {
  initialData?: Lead;
  onSubmit: (data: CreateLeadInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function LeadForm({ initialData, onSubmit, onCancel, isLoading }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: initialData?.name || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      source: initialData?.source || '',
    },
    mode: 'onChange',
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <label className="text-sm font-medium">Name *</label>
        <input
          {...register('name')}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g. Aman Gupta"
        />
        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Email *</label>
        <input
          {...register('email')}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g. aman@example.com"
        />
        {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Phone</label>
        <input
          {...register('phone')}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g. +91 9876543210"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Source</label>
        <select
          {...register('source')}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">Select source...</option>
          <option value="website">Website</option>
          <option value="referral">Referral</option>
          <option value="campaign">Campaign</option>
          <option value="cold-outreach">Cold Outreach</option>
          <option value="event">Event</option>
        </select>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={!isValid || isLoading}>
          {isLoading ? 'Saving...' : initialData ? 'Save Changes' : 'Create Lead'}
        </Button>
      </div>
    </form>
  );
}
