import { today } from './date';

export const emptyForm = () => ({
  name: '',
  phone: '',
  stage: 'Not contacted',
  priority: 'mid',
  followUpDate: '',
  createdDate: today(),
});

export function toFormState(lead) {
  return {
    name: lead.name,
    phone: lead.phone,
    stage: lead.stage,
    priority: lead.priority,
    followUpDate: lead.followUpDate ?? '',
    createdDate: lead.createdDate,
  };
}

export function toLeadInput(form) {
  return {
    name: form.name,
    phone: form.phone,
    stage: form.stage,
    priority: form.priority,
    followUpDate: form.followUpDate || null,
    createdDate: form.createdDate,
  };
}
