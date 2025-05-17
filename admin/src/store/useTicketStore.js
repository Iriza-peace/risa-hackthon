import { create } from 'zustand';

const useTicketStore = create((set) => ({
  tickets: [],
  setTickets: (tickets) => set({ tickets })
}));

export default useTicketStore;
