import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Search, Filter, AlertCircle, Eye, Pencil, Plus } from 'lucide-react';
import { api, setTickets } from '../../store/ticketsSlice';

export default function ListTickets() {
  const tickets = useSelector((state) => state.tickets.tickets);
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('Toutes');
  const [filterPriority, setFilterPriority] = useState('Toutes');
  const [filterStatus, setFilterStatus] = useState('Tous');

  useEffect(() => {
    if (tickets.length === 0) {
      api
        .get('/tickets')
        .then((res) => dispatch(setTickets(res.data)))
        .catch((err) => console.error(err));
    }
  }, [dispatch, tickets.length]);

  const calculateElapsedTime = (createdAt) => {
    if (!createdAt) return '-';

    const created = new Date(createdAt);
    if (isNaN(created.getTime())) return '-';

    const now = new Date();
    const diffInMs = now - created;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    return diffInDays > 0
      ? `${diffInDays} jour${diffInDays > 1 ? 's' : ''}`
      : `${diffInHours}h`;
  };

  const isOverdue = (ticket) => {
    if (!ticket.createdAt) return false;
    if (ticket.status === 'Résolu' || ticket.status === 'Fermé') return false;

    const created = new Date(ticket.createdAt);
    if (isNaN(created.getTime())) return false;

    const diffInHours = (new Date() - created) / (1000 * 60 * 60);
    return diffInHours > 48;
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      (ticket.title ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ticket.clientName ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ticket.description ?? '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      filterCategory === 'Toutes' || ticket.category === filterCategory;

    const matchesPriority =
      filterPriority === 'Toutes' || ticket.priority === filterPriority;

    const matchesStatus =
      filterStatus === 'Tous' || ticket.status === filterStatus;

    return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
  });

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

  return (
    <div className="min-h-screen bg-gray-50">


      <div className="container mx-auto px-3 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="mb-2">Liste des Tickets</h1>
            <p className="text-gray-600">
              Total : {filteredTickets.length} ticket
              {filteredTickets.length > 1 ? 's' : ''}
            </p>
          </div>
          <div>
            <Link to={'/tickets/ajouter'} className='px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 rounded-md flex items-center justify-center gap-2 transition'><Plus/> Ajouter Ticket</Link>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md mb-6">
          <div className="flex items-center mb-4">
            <Filter className="mr-2 text-gray-600" size={20} />
            <h3>Filtres</h3>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="Toutes">Toutes les catégories</option>
              <option value="Technique">Technique</option>
              <option value="Matériel">Matériel</option>
              <option value="Compte">Compte</option>
              <option value="Facturation">Facturation</option>
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="Toutes">Toutes les priorités</option>
              <option value="Basse">Basse</option>
              <option value="Moyenne">Moyenne</option>
              <option value="Haute">Haute</option>
              <option value="Urgente">Urgente</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="Tous">Tous les statuts</option>
              <option value="Nouveau">Nouveau</option>
              <option value="En cours">En cours</option>
              <option value="Résolu">Résolu</option>
              <option value="Fermé">Fermé</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {filteredTickets.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Aucun ticket trouvé
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3 text-left">Titre</th>
                    <th className="px-3 py-3 text-left">Client</th>
                    <th className="px-3 py-3 text-left">Catégorie</th>
                    <th className="px-3 py-3 text-left">Priorité</th>
                    <th className="px-3 py-3 text-left">Statut</th>
                    <th className="px-3 py-3 text-left">Temps</th>
                    <th className="px-3 py-3 text-left">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTickets.map((ticket) => (
                    <tr key={ticket.id} className="border-t hover:bg-gray-50">

                      <td className="px-3 py-3">
                        <div className="flex items-center">
                          <Link
                            to={`/tickets/${ticket.id}`}
                            className=" text-gray-800 hover:text-blue-600"
                          >
                            {ticket.title}
                          </Link>
                          {isOverdue(ticket) && (
                            <AlertCircle className="ml-2 text-red-500" size={18} />
                          )}
                        </div>
                      </td>

                      <td className="px-3 py-3">{ticket.clientName}</td>
                      <td className="px-3 py-3">{ticket.category}</td>

                      <td className="px-3 py-3">
                        <span
                          className={`px-3 py-1 rounded-full ${priorityColors[ticket.priority]}`}
                        >
                          {ticket.priority}
                        </span>
                      </td>

                      <td className="px-3 py-3">
                        <span
                          className={`px-3 py-1 rounded-full ${statusColors[ticket.status]}`}
                        >
                          {ticket.status}
                        </span>
                      </td>

                      <td className="px-3 py-3">
                        {calculateElapsedTime(ticket.createdAt)}
                      </td>

                      <td className="flex items-center px-3 py-3 space-x-3">
                        <Link
                          to={`/tickets/${ticket.id}`}
                          className=" text-blue-600 hover:text-blue-700"
                        >
                          <Eye width={'20'} className=" text-blue-600" />
                        </Link>
                        <Link
                          to={`/tickets/modifier/${ticket.id}`}
                          className=" text-green-600 hover:text-green-700"
                        >
                          <Pencil className="text-green-600" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
