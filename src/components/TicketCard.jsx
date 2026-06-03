import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Clock, AlertTriangle } from 'lucide-react';
import { getElapsedTime, getPriorityColor, getStatusColor, isTicketOverdue } from './utils/ticketUtils';
// import { 
//   getElapsedTime, 
//   isTicketOverdue, 
//   getPriorityColor, 
//   getStatusColor 
// } from '../../utils/ticketUtils';

const TicketCard = ({ ticket }) => {
  const navigate = useNavigate();
  const overdue = isTicketOverdue(ticket.createdAt, ticket.status);

  const statusColors = {
    'primary': 'badge-primary',
    'warning': 'badge-warning',
    'success': 'badge-success',
    'secondary': 'badge-secondary',
    'danger': 'badge-danger',
    'info': 'badge-info'
  };

  const priorityColors = {
    'success': 'badge-success',
    'info': 'badge-info',
    'warning': 'badge-warning',
    'danger': 'badge-danger'
  };

  return (
    <div 
      className={`ticket-card ${overdue ? 'overdue' : ''}`}
      onClick={() => navigate(`/tickets/${ticket.id}`)}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-1">
            {ticket.titre}
          </h3>
          <div className="text-xs font-semibold font-mono text-slate-500">
            #{ticket.id}
          </div>
        </div>
        {overdue && (
          <div className="badge-overdue flex items-center space-x-1">
            <AlertTriangle className="w-3 h-3" />
            <span>En retard</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        <span className={`badge ${statusColors[getStatusColor(ticket.status)]}`}>
          {ticket.status}
        </span>
        <span className={`badge ${priorityColors[getPriorityColor(ticket.priority)]}`}>
          {ticket.priority}
        </span>
        <span className="badge badge-secondary">
          {ticket.category}
        </span>
      </div>

      <p className="text-slate-600 mb-4 line-clamp-2">
        {ticket.description.substring(0, 100)}...
      </p>

      <div className="flex items-center gap-6 text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4" />
          <span>{ticket.clientName}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>{getElapsedTime(ticket.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
