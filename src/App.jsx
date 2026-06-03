import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LandingPage from './components/pages/LandingPage'
import ListTickets from './components/pages/ListTickets'
import 'bootstrap/dist/css/bootstrap.min.css';
import Ticket from './components/pages/Ticket';
import AjouterTicket from './components/pages/AjouterTicket';
import ModifierTicket from './components/pages/ModifierTicket';
import Navigation from './components/Navigation';
import Dashboard from './components/pages/Dashboard';

const App = () => {
  return (
    <>
      <Navigation />
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/dashboard' element={<Dashboard/>}/>
          <Route path='/tickets' element={<ListTickets />} />
          <Route path='/tickets/:id' element={<Ticket />} />
          <Route path='/tickets/ajouter' element={<AjouterTicket />} />
          <Route path='/tickets/modifier/:id' element={<ModifierTicket />} />
        </Routes>
      
    </>
  )
}

export default App