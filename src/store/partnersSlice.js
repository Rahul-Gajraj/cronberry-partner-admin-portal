import { createSlice } from "@reduxjs/toolkit";

const partnersSlice = createSlice({
  name: "partners",
  initialState: [
    {
      id: 101,
      name: "Ananya Gupta",
      email: "ananya@domain.com",
      mobile: "9876543210",
      company: "BrightTech",
      status: "Approved",
      approvedOn: "2025-04-07",
      pan: "https://example.com/ananya_pan.pdf",
      gst: "https://example.com/ananya_gst.pdf",
      customersOnboarded: 12,
      revenueGenerated: 250000,
      lastSaleDate: "2025-04-06",
      assignedSlabs: [
        { id: 1, name: "Flat 10% Commission", type: "fixed" },
        { id: 2, name: "₹5000 Bonus on 5 Sales", type: "bonus" },
      ],
    },
  ],
  reducers: {
    updatePartners(state, action) {
      state = [action.payload, ...state];
      return state;
    },
  },
});

export default partnersSlice.reducer;

export const { updatePartners } = partnersSlice.actions;
