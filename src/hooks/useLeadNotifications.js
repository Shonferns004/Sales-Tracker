import { useEffect } from 'react';
import { today } from '../utils/date';

export function useLeadNotifications(leads) {
  useEffect(() => {
    if (typeof Notification === 'undefined') return undefined;

    const notifyDueLeads = () => {
      if (Notification.permission !== 'granted') return;

      leads.forEach((lead) => {
        if (lead.followUpDate !== today()) return;
        const key = `lead-reminder-${lead.id}-${lead.followUpDate}`;
        if (localStorage.getItem(key)) return;

        new Notification(`Follow-up due: ${lead.name}`, {
          body: `${lead.phone} is scheduled for follow-up today.`,
        });
        localStorage.setItem(key, 'sent');
      });
    };

    notifyDueLeads();
    const interval = window.setInterval(notifyDueLeads, 60000);
    return () => window.clearInterval(interval);
  }, [leads]);
}
