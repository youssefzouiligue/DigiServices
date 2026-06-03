import { formatDistanceToNow, differenceInHours, format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const getElapsedTime = (createdAt) => {
  return formatDistanceToNow(new Date(createdAt), { 
    addSuffix: true, 
    locale: fr 
  });
};

export const isTicketOverdue = (createdAt, status) => {
  if (status === 'Résolu' || status === 'Fermé') return false;
  
  const hours = differenceInHours(new Date(), new Date(createdAt));
  return hours > 48;
};

export const getResolutionTime = (createdAt, resolvedAt) => {
  if (!resolvedAt) return null;
  
  const hours = differenceInHours(new Date(resolvedAt), new Date(createdAt));
  if (hours < 24) {
    return `${hours}h`;
  }
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  return `${days}j ${remainingHours}h`;
};

export const formatDate = (date) => {
  return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: fr });
};

export const getPriorityColor = (priority) => {
  const colors = {
    'Basse': 'success',
    'Moyenne': 'info',
    'Haute': 'warning',
    'Urgente': 'danger'
  };
  return colors[priority] || 'secondary';
};

export const getStatusColor = (status) => {
  const colors = {
    'Nouveau': 'primary',
    'En cours': 'warning',
    'Résolu': 'success',
    'Fermé': 'secondary'
  };
  return colors[status] || 'secondary';
};

export const calculateStats = (tickets) => {
  const openTickets = tickets.filter(t => 
    t.status === 'Nouveau' || t.status === 'En cours'
  ).length;

  const overdueTickets = tickets.filter(t => 
    isTicketOverdue(t.createdAt, t.status)
  ).length;

  const resolvedTickets = tickets.filter(t => 
    t.status === 'Résolu' && t.resolvedAt
  );

  let avgResolutionTime = 0;
  if (resolvedTickets.length > 0) {
    const totalHours = resolvedTickets.reduce((sum, ticket) => {
      return sum + differenceInHours(
        new Date(ticket.resolvedAt), 
        new Date(ticket.createdAt)
      );
    }, 0);
    avgResolutionTime = Math.round(totalHours / resolvedTickets.length);
  }

  const resolutionRate = tickets.length > 0 
    ? Math.round((resolvedTickets.length / tickets.length) * 100) 
    : 0;

  return {
    openTickets,
    overdueTickets,
    avgResolutionTime,
    resolutionRate,
    totalTickets: tickets.length,
    resolvedTickets: resolvedTickets.length
  };
};
