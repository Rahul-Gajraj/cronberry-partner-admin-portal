import { createSlice } from "@reduxjs/toolkit";

const partnerApprovalsSlice = createSlice({
  name: "partnerApprovals",
  initialState: [
    {
      id: 1,
      name: "Riya Sharma",
      email: "riya@example.com",
      mobile: "9876543210",
      company: "Growthify Pvt Ltd",
      city: "Jaipur",
      state: "Rajasthan",
      pan: "riya_pan.pdf",
      gst: "riya_gst.pdf",
      status: "Pending",
    },
    {
      id: 2,
      name: "Amit Mehra",
      email: "amit@example.com",
      mobile: "9123456789",
      company: "TechNova Solutions",
      city: "Bangalore",
      state: "Karnataka",
      pan: "amit_pan.pdf",
      gst: "amit_gst.pdf",
      status: "Pending",
    },
    {
      id: 3,
      name: "Gourav",
      email: "gourav@example.com",
      mobile: "1234567890",
      company: "NVIDIA",
      city: "Mumbai",
      state: "Maharashtra",
      pan: "gourav_pan.pdf",
      gst: "gourav_gst.pdf",
      status: "Pending",
    },
    {
      id: 4,
      name: "Nisha",
      email: "nisha@example.com",
      mobile: "8912345670",
      company: "Lowe's",
      city: "Pune",
      state: "Maharashtra",
      pan: "nisha_pan.pdf",
      gst: "nisha_gst.pdf",
      status: "Pending",
    },
    {
      id: 5,
      name: "Rahul",
      email: "rahul@example.com",
      mobile: "7890123456",
      company: "Netflix",
      city: "Bengaluru",
      state: "Karnataka",
      pan: "rahul_pan.pdf",
      gst: "rahul_gst.pdf",
      status: "Pending",
    },
    {
      id: 6,
      name: "Manish",
      email: "manish@example.com",
      mobile: "9753124680",
      company: "Spotify",
      city: "Bengaluru",
      state: "Karnataka",
      pan: "manish_pan.pdf",
      gst: "manish_gst.pdf",
      status: "Pending",
    },
  ],
  reducers: {
    removePartnerApproval(state, action) {
      state = state.filter((data) => data.id != action.payload);
      return state;
    },
  },
});

export default partnerApprovalsSlice.reducer;

export const { removePartnerApproval } = partnerApprovalsSlice.actions;
