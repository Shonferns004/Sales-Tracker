import LeadForm from '../components/LeadForm';

export default function LeadFormPage({ mode, form, saving, onChange, onSubmit, onCancel, onOpenBulkAdd }) {
  const isEdit = mode === 'edit';

  return (
    <LeadForm
      title={isEdit ? 'Edit Lead' : 'Add Lead'}
      subtitle={
        isEdit
          ? 'Update the record and keep the database and CSV aligned.'
          : 'Create a new lead with follow-up date, created date, stage, and priority.'
      }
      form={form}
      saving={saving}
      onChange={onChange}
      onSubmit={onSubmit}
      onCancel={onCancel}
      onOpenBulkAdd={isEdit ? undefined : onOpenBulkAdd}
    />
  );
}
