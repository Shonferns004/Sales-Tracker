import { today } from './date';

export const emptyForm = () => ({
  name: '',
  phone: '',
  stage: 'Not contacted',
  priority: 'mid',
  note: '',
  isDone: false,
  followUpDate: '',
  createdDate: today(),
});

export function toFormState(lead) {
  return {
    name: lead.name,
    phone: lead.phone,
    stage: lead.stage,
    priority: lead.priority,
    note: lead.note ?? '',
    isDone: Boolean(lead.isDone),
    followUpDate: lead.followUpDate ?? '',
    createdDate: lead.createdDate,
  };
}

export function toLeadInput(form) {
  const note = form.note?.trim() || null;
  const isDone = Boolean(form.isDone);
  return {
    name: form.name,
    phone: form.phone,
    stage: form.stage,
    priority: form.priority,
    note,
    isDone,
    followUpDate: note || isDone ? null : form.followUpDate || null,
    createdDate: form.createdDate,
  };
}
