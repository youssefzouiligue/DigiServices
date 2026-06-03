import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FileText, FolderOpen, AlertTriangle, CheckCircle2, Clock, Loader2 } from 'lucide-react';
import { api, setTickets } from '../../store/ticketsSlice';
import { calculateStats } from '../utils/ticketUtils';
import StatCard from '../StatCard';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { tickets } = useSelector(state => state.tickets);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tickets.length === 0) {
      setLoading(true);
      api.get('/tickets')
        .then(res => {
          dispatch(setTickets(res.data));
          setLoading(false);
        })
        .catch(err => {
          console.error('Erreur:', err);
          setLoading(false);
        });
    }
  }, [dispatch, tickets.length]);

  const stats = calculateStats(tickets);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-slate-800 mb-2">Tableau de Bord</h1>
          <p className="text-lg text-slate-600">Vue d'ensemble des tickets et statistiques en temps réel</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard icon={FileText} value={stats.totalTickets} label="Total Tickets" color="primary" />
          <StatCard icon={FolderOpen} value={stats.openTickets} label="Tickets Ouverts" color="warning" />
          <StatCard icon={AlertTriangle} value={stats.overdueTickets} label="En Retard (> 48h)" color="danger" />
          <StatCard icon={CheckCircle2} value={`${stats.resolutionRate}%`} label="Taux de Résolution" color="success" />
        </div>

        {/* More Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col">
            <div className="flex items-center space-x-3 mb-4">
              <Clock className="w-6 h-6 text-indigo-500" />
              <h4 className="text-xl font-bold text-slate-800">Temps Moyen de Résolution</h4>
            </div>
            <div className="text-4xl font-extrabold font-mono text-indigo-500 mb-2">{stats.avgResolutionTime}h</div>
            <p className="text-slate-500">Basé sur {stats.resolvedTickets} tickets résolus</p>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-6">
            <h4 className="text-xl font-bold text-slate-800 mb-6">Distribution des Statuts</h4>
            <div className="space-y-4">
              {['Nouveau', 'En cours', 'Résolu', 'Fermé'].map(status => {
                const count = tickets.filter(t => t.status === status).length;
                const percentage = tickets.length > 0 ? Math.round((count / tickets.length) * 100) : 0;

                return (
                  <div key={status}>
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold text-slate-700">{status}</span>
                      <span className="font-bold font-mono text-slate-800">{count} ({percentage}%)</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Overdue Alert */}
        {stats.overdueTickets > 0 && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 flex items-start space-x-4">
            <AlertTriangle className="w-8 h-8 text-red-600 flex-shrink-0" />
            <div>
              <strong className="text-red-900 text-lg block mb-1">
                Attention: {stats.overdueTickets} ticket{stats.overdueTickets > 1 ? 's' : ''} en retard
              </strong>
              <p className="text-red-800">
                Ces tickets nécessitent une attention immédiate (plus de 48h depuis la création)
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
