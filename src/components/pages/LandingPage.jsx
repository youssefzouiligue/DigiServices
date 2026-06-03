import React from 'react';
import { Link } from 'react-router-dom';
// import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Headset, Clock, BarChart3, Users } from 'lucide-react';

export default function LandingPage() {
  const teamMembers = [
    {
      name: 'Hamza Fajri',
      role: 'Développeur Full Stack',
    },
    {
      name: 'Youssef Zouiligue',
      role: 'Développeur Full Stack',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="mb-6 text-blue-900">
            DigiServices - Gestion de Tickets Support
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Une solution complète pour gérer efficacement les demandes d'assistance de vos 200 employés à Casablanca. 
            Suivez, priorisez et résolvez les tickets en temps réel.
          </p>
          <Link
            to="/dashboard"
            className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
          >
            Accéder à l'Application
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Headset className="text-blue-600" size={24} />
            </div>
            <h3 className="mb-2">Support Centralisé</h3>
            <p className="text-gray-600">
              Gérez tous vos tickets d'assistance depuis une seule plateforme
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Clock className="text-green-600" size={24} />
            </div>
            <h3 className="mb-2">Suivi en Temps Réel</h3>
            <p className="text-gray-600">
              Calculez automatiquement le temps écoulé et les tickets en retard
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <BarChart3 className="text-purple-600" size={24} />
            </div>
            <h3 className="mb-2">Statistiques Détaillées</h3>
            <p className="text-gray-600">
              Visualisez les performances et le taux de résolution
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Users className="text-orange-600" size={24} />
            </div>
            <h3 className="mb-2">Gestion d'Équipe</h3>
            <p className="text-gray-600">
              Organisez le travail de votre équipe IT efficacement
            </p>
          </div>
        </div>

        {/* Project Description */}
        <div className="bg-white rounded-2xl shadow-xl p-12 mb-16">
          <h2 className="text-center mb-8 text-blue-900">À Propos du Projet</h2>
          <div className="max-w-4xl mx-auto space-y-6 text-gray-700">
            <p>
              DigiServices est une entreprise IT basée à Casablanca avec 2 employés. Face à un volume croissant de 
              demandes d'assistance quotidiennes, nous avons développé ce système centralisé pour optimiser la gestion 
              des tickets support.
            </p>
            <p>
              Notre application permet de créer, modifier et suivre les tickets avec des fonctionnalités avancées telles que :
            </p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li>Classification par catégorie (Technique, Matériel, Compte, Facturation)</li>
              <li>Priorisation intelligente (Basse, Moyenne, Haute, Urgente)</li>
              <li>Suivi des statuts (Nouveau, En cours, Résolu, Fermé)</li>
              <li>Détection automatique des tickets en retard (&gt; 48h)</li>
              <li>Calcul du temps moyen de résolution</li>
              <li>Tableaux de bord statistiques en temps réel</li>
            </ul>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-center mb-12 text-blue-900">Notre Équipe</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform">
                {/* <ImageWithFallback
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                /> */}
                <div className="p-6 text-center">
                  <h3 className="mb-2">{member.name}</h3>
                  <p className="text-blue-600">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 DigiServices - Tous droits réservés</p>
        </div>
      </footer>
    </div>
  );
}
