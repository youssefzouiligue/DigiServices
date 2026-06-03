import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Edit, Trash2, Clock, Calendar, Mail, User, AlertCircle } from 'lucide-react';
import { addTicket, api, deleteTicket } from '../../store/ticketsSlice';

export default function Ticket() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const ticket = useSelector((state) =>
    state.tickets.tickets.find((t) => Number(t.id) === Number(id))
  );

  const [elapsedTime, setElapsedTime] = useState('');
  const [isOverdue, setIsOverdue] = useState(false);

  useEffect(() => {
    if (!ticket) {
      api.get(`/tickets/${Number(id)}`)
        .then((res) => {
          dispatch(addTicket(res.data));
        })
        .catch(() => {
          navigate('/tickets');
        })
    } 
  }, [ticket, Number(id), dispatch, navigate]);
  useEffect(() => {
    if (!ticket) return;
    const updateElapsedTime = () => {
      const now = new Date();
      const created = new Date(ticket.createdAt);
      const diffInMs = now - created;
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      const diffInDays = Math.floor(diffInHours / 24);
      const remainingHours = diffInHours % 24;

      if (diffInDays > 0) {
        setElapsedTime(`${diffInDays} jour${diffInDays > 1 ? 's' : ''} ${remainingHours}h`);
      } else {
        setElapsedTime(`${diffInHours}h`);
      }

      if (ticket.status !== 'Résolu' && ticket.status !== 'Fermé') {
        setIsOverdue(diffInHours > 48);
      } else {
        setIsOverdue(false);
      }
    };

    updateElapsedTime();
    const interval = setInterval(updateElapsedTime, 60000);
    return () => clearInterval(interval);
  }, [ticket]);

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="mb-4">Ticket introuvable</h1>
            <Link
              to="/tickets"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Retour à la liste
            </Link>
          </div>
        </div>
      </div>
    );
  }
  const handleDelete = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce ticket ?')) return;

    try {
      await api.delete(`/tickets/${id}`);
      dispatch(deleteTicket(id));
      navigate('/tickets');
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la suppression du ticket");
    }
  };


  const priorityColors = {
    Basse: 'bg-green-100 text-green-800',
    Moyenne: 'bg-yellow-100 text-yellow-800',
    Haute: 'bg-orange-100 text-orange-800',
    Urgente: 'bg-red-100 text-red-800',
  };

  const statusColors = {
    Nouveau: 'bg-yellow-100 text-yellow-800',
    'En cours': 'bg-blue-100 text-blue-800',
    Résolu: 'bg-green-100 text-green-800',
    Fermé: 'bg-gray-100 text-gray-800',
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-md p-8 mb-6">
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="mb-0">Ticket #{ticket.id}</h1>
                  {isOverdue && (
                    <span className="flex items-center bg-red-100 text-red-800 px-3 py-1 rounded-full">
                      <AlertCircle size={16} className="mr-1" />
                      En retard
                    </span>
                  )}
                </div>
                <h2 className="text-gray-700 mb-4">{ticket.title}</h2>
                <div className="flex flex-wrap gap-2">
                  <span className={`px-3 py-1 rounded-full ${priorityColors[ticket.priority]}`}>
                    {ticket.priority}
                  </span>
                  <span className={`px-3 py-1 rounded-full ${statusColors[ticket.status]}`}>
                    {ticket.status}
                  </span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                    {ticket.category}
                  </span>
                </div>
              </div>

              <div className="flex space-x-2">
                <Link
                  to={`/tickets/modifier/${id}`}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit size={18} />
                  <span>Modifier</span>
                </Link>
                <button
                  onClick={handleDelete}
                  className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 size={18} />
                  <span>Supprimer</span>
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Calendar className="text-blue-600" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Créé le</p>
                  <p className="text-gray-900">{formatDate(ticket.createdAt)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className={`${isOverdue ? 'bg-red-100' : 'bg-green-100'} p-2 rounded-lg`}>
                  <Clock className={isOverdue ? 'text-red-600' : 'text-green-600'} size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Temps écoulé</p>
                  <p className={isOverdue ? 'text-red-600' : 'text-gray-900'}>{elapsedTime}</p>
                </div>
              </div>

              {ticket.resolvedAt && (
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Calendar className="text-green-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Résolu le</p>
                    <p className="text-gray-900">{formatDate(ticket.resolvedAt)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-8 mb-6">
            <h3 className="mb-4">Description</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-8">
            <h3 className="mb-6">Informations Client</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <User className="text-purple-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Nom du client</p>
                  <p className="text-gray-900">{ticket.clientName}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <Mail className="text-orange-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <a
                    href={`mailto:${ticket.clientEmail}`}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    {ticket.clientEmail}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
