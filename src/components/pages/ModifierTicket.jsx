import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Save, X, AlertCircle } from 'lucide-react';
import { updateTicket, api } from '../../store/ticketsSlice';

const ModifierTicket = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const ticket = useSelector(state =>
    state.tickets.tickets.find(t => t.id === id)
  );

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Technique',
    priority: 'Moyenne',
    status: 'Nouveau',
    clientName: '',
    clientEmail: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!ticket) {
      navigate('/tickets');
    } else {
      setFormData(ticket);
    }
  }, [ticket, navigate]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est requis';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Le titre doit contenir au moins 5 caractères';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    } else if (formData.description.length < 20) {
      newErrors.description = 'La description doit contenir au moins 20 caractères';
    }

    if (!formData.clientName.trim()) {
      newErrors.clientName = 'Le nom du client est requis';
    }

    if (!formData.clientEmail.trim()) {
      newErrors.clientEmail = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.clientEmail)) {
      newErrors.clientEmail = "Format d'email invalide";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await api.put(`/tickets/${id}`, {
        ...formData,
        updatedAt: new Date().toISOString()
      });

      dispatch(updateTicket(response.data));
      navigate('/tickets');
    } catch (error) {
      console.error(error);
      setErrors({ submit: "Erreur lors de la modification du ticket" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/tickets')}
          className="flex items-center space-x-2 text-slate-600 hover:text-primary-500 mb-8 font-semibold transition-colors "
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour</span>
        </button>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-800 mb-2">
              Modifier le ticket
            </h1>
            <p className="text-slate-600">
              Modifiez les informations du ticket
            </p>
          </div>

          {errors.submit && (
            <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-800">{errors.submit}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Titre du ticket <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ex: Problème de connexion au serveur"
                className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
        ${errors.title ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
      `}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.title}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={5}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Décrivez le problème en détail..."
                className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2
        ${errors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}
      `}
              />
              <p className="text-xs text-gray-500 mt-1">Minimum 20 caractères</p>
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Catégorie
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Technique</option>
                  <option>Matériel</option>
                  <option>Compte</option>
                  <option>Facturation</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priorité
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Basse</option>
                  <option>Moyenne</option>
                  <option>Haute</option>
                  <option>Urgente</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom du client <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                placeholder="Ahmed Benali"
                className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2
        ${errors.clientName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}
      `}
              />
              {errors.clientName && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.clientName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email du client <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="clientEmail"
                value={formData.clientEmail}
                onChange={handleChange}
                placeholder="exemple@digiservices.ma"
                className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2
        ${errors.clientEmail ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}
      `}
              />
              {errors.clientEmail && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.clientEmail}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 rounded-md flex items-center justify-center gap-2 transition"
              >
                <Save size={16} />
                {isSubmitting ? 'Sauvegarde...' : 'Enregistrer'}
              </button>

              <button
                type="button"
                onClick={() => navigate('/tickets')}
                className="flex-1 border border-gray-300 hover:bg-gray-100 font-medium py-2.5 rounded-md flex items-center justify-center gap-2 transition"
              >
                <X size={16} />
                Annuler
              </button>
            </div>

          </form>



        </div>
      </div>
    </div>
  );
};

export default ModifierTicket;
