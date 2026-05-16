import { assertSupabaseConfig, supabase } from './supabase';

export const STAGES = [
  'Not contacted',
  'Video sent',
  'First call',
  'Follow up call',
  'Meeting booked',
  'Personal Meet',
  'Proposal sent',
  'Finalization',
];

export const PRIORITIES = ['high', 'mid', 'low'];

const today = () => new Date().toISOString().split('T')[0];

function normalizeText(value) {
  if (value === undefined || value === null) return null;
  const text = String(value).trim();
  return text ? text : null;
}

function normalizePhoneForDb(value) {
  const text = normalizeText(value);
  if (!text) return null;

  const digitsOnly = text.replace(/\D/g, '');
  return digitsOnly || null;
}

export function normalizePriority(value) {
  const priority = String(value || 'mid').toLowerCase();
  return PRIORITIES.includes(priority) ? priority : 'mid';
}

export function normalizeStage(value) {
  return STAGES.includes(value) ? value : 'Not contacted';
}

export function normalizeDate(value) {
  if (!value) return null;

  if (typeof value === 'number') {
    return new Date(value).toISOString().split('T')[0];
  }

  const dateValue = String(value).trim();
  if (!dateValue) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) return dateValue;

  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return null;

  return parsed.toISOString().split('T')[0];
}

function fromRow(row) {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    stage: normalizeStage(row.stage),
    priority: normalizePriority(row.priority),
    note: row.note ?? null,
    notes: row.notes ?? [],
    isDone: Boolean(row.is_done),
    followUpDate: row.follow_up_date,
    createdDate: row.created_date,
    insertedAt: row.inserted_at,
    updatedAt: row.updated_at,
  };
}

function toRow(input) {
  const note = normalizeText(input.note);
  const isDone = Boolean(input.isDone);
  const followUpDate = isDone ? null : normalizeDate(input.followUpDate);

  return {
    name: normalizeText(input.name) ?? '',
    phone: normalizePhoneForDb(input.phone),
    stage: normalizeStage(input.stage),
    priority: normalizePriority(input.priority),
    note,
    notes: Array.isArray(input.notes) ? input.notes : [],
    is_done: isDone,
    follow_up_date: followUpDate,
    created_date: normalizeDate(input.createdDate) ?? today(),
  };
}

export async function listLeads(limit, offset, search) {
  assertSupabaseConfig();

  let query = supabase
    .from('leads')
    .select('*')
    .order('created_date', { ascending: false })
    .order('inserted_at', { ascending: false });

  if (search) query = query.ilike('name', `%${search}%`);
  if (typeof limit === 'number') query = query.range(offset || 0, offset + limit - 1);

  const { data, error } = await query;

  if (error) throw error;
  return data.map(fromRow);
}

export async function countLeads(search) {
  assertSupabaseConfig();

  let query = supabase.from('leads').select('*', { count: 'exact', head: true });
  if (search) query = query.ilike('name', `%${search}%`);

  const { count, error } = await query;
  if (error) throw error;
  return count ?? 0;
}

export async function getLead(id) {
  assertSupabaseConfig();

  const { data, error } = await supabase.from('leads').select('*').eq('id', id).single();
  if (error) throw error;
  return fromRow(data);
}

export async function createLead(input) {
  assertSupabaseConfig();

  const { error } = await supabase.from('leads').insert(toRow(input));
  if (error) throw error;
}

export async function updateLead(id, input) {
  assertSupabaseConfig();

  const { error } = await supabase.from('leads').update(toRow(input)).eq('id', id);
  if (error) throw error;
}

export async function deleteLead(id) {
  assertSupabaseConfig();

  const { error } = await supabase.from('leads').delete().eq('id', id);
  if (error) throw error;
}

export async function updateLeadNotes(id, notes) {
  assertSupabaseConfig();

  const { error } = await supabase.from('leads').update({ notes }).eq('id', id);
  if (error) throw error;
}

export async function importLeads(inputs) {
  if (!inputs.length) {
    return { insertedCount: 0, skippedCount: 0 };
  }

  assertSupabaseConfig();

  const preparedRows = inputs.map(toRow);
  const { error } = await supabase.from('leads').insert(preparedRows);
  if (error) throw error;

  return {
    insertedCount: preparedRows.length,
    skippedCount: 0,
  };
}
