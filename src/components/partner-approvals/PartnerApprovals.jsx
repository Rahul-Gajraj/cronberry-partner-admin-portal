import React, { useState } from "react";
import { Eye, X, CheckCircle, XCircle, Filter, Search } from "lucide-react";

const mockPartners = [
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
];

const mockSlabs = [
  { id: 1, name: "Flat 10% Commission" },
  { id: 2, name: "₹5000 Bonus on 5 Sales" },
  { id: 3, name: "₹25000 Bonus on ₹5L Revenue" },
];

const PartnerApprovals = () => {
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [statusFilter, setStatusFilter] = useState("Pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSlabs, setSelectedSlabs] = useState([]);
  const itemsPerPage = 5;

  const filteredPartners = mockPartners.filter(
    (p) =>
      (!statusFilter || p.status === statusFilter) &&
      (p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const paginatedPartners = filteredPartners.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredPartners.length / itemsPerPage);

  const openDrawer = (partner) => {
    setSelectedPartner(partner);
    setShowDrawer(true);
    setSelectedSlabs([]);
  };

  const handleApprove = () => {
    if (selectedSlabs.length === 0) {
      alert("Please assign at least one commission slab before approving.");
      return;
    }
    alert(
      "Partner Approved with Slabs: " +
        selectedSlabs.map((s) => s.name).join(", ")
    );
    setShowDrawer(false);
  };

  const handleReject = () => {
    setShowRejectModal(false);
    alert(`Partner Rejected: ${rejectReason}`);
    setShowDrawer(false);
    setRejectReason("");
  };

  const toggleSlab = (slab) => {
    if (selectedSlabs.some((s) => s.id === slab.id)) {
      setSelectedSlabs(selectedSlabs.filter((s) => s.id !== slab.id));
    } else {
      setSelectedSlabs([...selectedSlabs, slab]);
    }
  };

  return (
    <div className="p-6 mx-auto w-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Partner Approvals</h1>
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2 border rounded p-2">
            <Filter size={18} className="text-gray-500" />
            <select
              className="text-sm cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ outline: "none" }}
            >
              <option value="">All</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <div className="flex items-center gap-2 border rounded p-2">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search by name/email"
              className="text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                outline: "none",
              }}
            />
          </div>
        </div>
      </div>

      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-2">Name</th>
            <th className="text-left p-2">Email</th>
            <th className="text-left p-2">Mobile</th>
            <th className="text-left p-2">Company</th>
            <th className="text-left p-2">City</th>
            <th className="text-left p-2">State</th>
            <th className="text-left p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedPartners.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="p-2">{p.name}</td>
              <td className="p-2">{p.email}</td>
              <td className="p-2">{p.mobile}</td>
              <td className="p-2">{p.company}</td>
              <td className="p-2">{p.city}</td>
              <td className="p-2">{p.state}</td>
              <td className="p-2">
                <button
                  onClick={() => openDrawer(p)}
                  className="text-blue-600 underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <Eye size={14} /> View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4 text-sm">
        <p>
          Page {currentPage} of {totalPages}
        </p>
        <div className="flex gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
          >
            Previous
          </button>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
          >
            Next
          </button>
        </div>
      </div>

      {showDrawer && selectedPartner && (
        <div className="fixed inset-0 bg-black/40 flex justify-end z-50">
          <div className="bg-white w-full max-w-xl h-full p-6 shadow-xl rounded-l-2xl overflow-y-auto relative">
            <button
              className="absolute top-4 right-4 text-gray-600 cursor-pointer"
              onClick={() => setShowDrawer(false)}
            >
              <X size={20} />
            </button>
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-blue-100 text-blue-600 rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
                {selectedPartner.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-semibold">
                  {selectedPartner.name}
                </h2>
                <p className="text-gray-500 text-sm">Pending Approval</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">Email</p>
                <p>{selectedPartner.email}</p>
              </div>
              <div>
                <p className="font-medium">Mobile</p>
                <p>{selectedPartner.mobile}</p>
              </div>
              <div>
                <p className="font-medium">Company</p>
                <p>{selectedPartner.company}</p>
              </div>
              <div>
                <p className="font-medium">Location</p>
                <p>
                  {selectedPartner.city}, {selectedPartner.state}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <p className="font-medium mb-2">Documents</p>
              <div className="flex gap-4">
                <a href="#" className="text-blue-600 underline text-sm">
                  {selectedPartner.pan}
                </a>
                <a href="#" className="text-blue-600 underline text-sm">
                  {selectedPartner.gst}
                </a>
              </div>
            </div>

            <div className="mt-6">
              <p className="font-medium mb-2">Assign Commission Slabs</p>
              <div className="flex flex-col gap-2">
                {mockSlabs.map((slab) => (
                  <label key={slab.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedSlabs.some((s) => s.id === slab.id)}
                      onChange={() => toggleSlab(slab)}
                    />
                    <span>{slab.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <button
                onClick={handleApprove}
                className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle size={16} /> Approve
              </button>
              <button
                onClick={() => setShowRejectModal(true)}
                className="bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2 cursor-pointer"
              >
                <XCircle size={16} /> Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {showRejectModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-xl w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Reject Partner</h3>
            <textarea
              className="w-full border p-2 rounded mb-4"
              rows={4}
              placeholder="Enter reason for rejection..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            ></textarea>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 border rounded cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-red-600 text-white rounded cursor-pointer"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnerApprovals;
