import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3001",
});

const ticketsSlice = createSlice({
  name: "tickets",
  initialState: {
    tickets: [],
    filters: {
      status: 'all',
      priority: 'all',
      category: 'all',
      search: ''
    }
  },
  reducers: {
    setTickets: (state, action) => {
      state.tickets = action.payload;
    },

    addTicket: (state, action) => {
      state.tickets.push(action.payload);
    },

    deleteTicket: (state, action) => {
      state.tickets = state.tickets.filter(
        (ticket) => ticket.id !== action.payload
      );
    },

    updateTicket: (state, action) => {
      const index = state.tickets.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.tickets[index] = action.payload;
      }
    },

    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    clearFilters: (state) => {
      state.filters = {
        status: 'all',
        priority: 'all',
        category: 'all',
        search: ''
      };
    }
  },
});

export const {
  setTickets,
  addTicket,
  deleteTicket,
  updateTicket,
  setFilters,
  clearFilters
} = ticketsSlice.actions;

export default ticketsSlice.reducer;
