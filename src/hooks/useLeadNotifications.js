import { useEffect } from 'react';
import { today } from '../utils/date';

export function useLeadNotifications(leads) {
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    if (typeof Notification === 'undefined') return undefined;
    if (!window.isSecureContext) return undefined;

    const notifyDueLeads = () => {
      if (Notification.permission !== 'granted') return;

      leads.forEach((lead) => {
        if (lead.followUpDate !== today()) return;
        const key = `lead-reminder-${lead.id}-${lead.followUpDate}`;
        try {
          if (localStorage.getItem(key)) return;

          new Notification(`Follow-up due: ${lead.name || 'Lead'}`, {
            body: `${lead.phone || 'No phone number'} is scheduled for follow-up today.`,
          });
          localStorage.setItem(key, 'sent');
        } catch (error) {
          console.error('Notification dispatch failed.', error);
        }
      });
    };

    notifyDueLeads();
    const interval = window.setInterval(notifyDueLeads, 60000);
    return () => window.clearInterval(interval);
  }, [leads]);
}
