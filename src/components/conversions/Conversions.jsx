import React, { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";

const mockCustomers = [
  {
    id: 1,
    customerName: "Rahul Verma",
    email: "rahul@example.com",
    phone: "9876543210",
    plan: "Pro Annual",
    totalPaid: 12000,
    partnerName: "Ananya Gupta",
    joinedOn: "2025-04-01",
    renewalDate: "2026-04-01",
    status: "Active",
    statusColor: "green",
    customNotes: "High value customer. Renew early.",
    consversionType: "pending",
  },
  {
    id: 2,
    customerName: "Sneha Kapoor",
    email: "sneha@example.com",
    phone: "9123456789",
    plan: "Starter Monthly",
    totalPaid: 1000,
    partnerName: "Ravi Kumar",
    joinedOn: "2025-04-03",
    renewalDate: "2025-05-03",
    status: "Inactive",
    statusColor: "red",
    customNotes: "Follow-up pending.",
    consversionType: "pending",
  },
];

function formatDateTime(date = new Date()) {
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

const getStatusBadge = (status, color) => (
  <span
    className={`inline-block px-2 py-1 text-xs font-semibold text-${color}-700 bg-${color}-100 rounded`}
  >
    {status}
  </span>
);

function Drawer({
  customer,
  onClose,
  revenueToAdd,
  setRevenueToAdd,
  handleInputChange,
  handleAddRevenue,
  auditTrail,
  handleNoteAdd,
  handleConversionTypeChange,
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [noteInput, setNoteInput] = useState("");
  const [showNoteField, setShowNoteField] = useState(false);

  const handleSave = () => setShowConfirm(true);
  const confirmSave = () => {
    setShowConfirm(false);
    alert("Changes saved successfully.");
  };

  if (!customer) return null;

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-40 flex justify-end z-50">
      <div className="bg-white w-full max-w-2xl h-full overflow-y-auto p-6 relative shadow-xl rounded-xl">
        <button
          className="absolute right-4 top-4 text-gray-500 cursor-pointer"
          onClick={onClose}
        >
          <XCircle className="w-5 h-5" />
        </button>
        <div className="space-y-4 text-sm">
          <div className="flex items-center gap-4 mb-4 border-b pb-4">
            <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold">
              {customer?.customerName?.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-blue-800">
                {customer.customerName}
              </h2>
              <p className="text-gray-600 text-sm">
                {customer.email} | {customer.phone}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <p>
              <strong>Plan:</strong> {customer.plan}
            </p>
            <p>
              <strong>Partner:</strong> {customer.partnerName}
            </p>
            <p>
              <strong>Joined On:</strong> {customer.joinedOn}
            </p>
            <div>
              <label className="block text-sm font-medium mb-1">Status:</label>
              <select
                className="w-full border p-2 rounded"
                value={customer.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t pt-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Total Paid:
              </label>
              <div className="flex items-center gap-2">
                <span className="text-gray-800 font-medium text-base">
                  ₹{customer.totalPaid.toLocaleString()}
                </span>
                <input
                  type="number"
                  className="border p-2 rounded w-24"
                  placeholder="+ Add"
                  value={revenueToAdd}
                  onChange={(e) => setRevenueToAdd(e.target.value)}
                />
                <button
                  onClick={handleAddRevenue}
                  className="px-3 py-1 text-sm rounded bg-green-600 text-white cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Renewal Date:
              </label>
              <input
                type="date"
                value={customer.renewalDate}
                onChange={(e) =>
                  handleInputChange("renewalDate", e.target.value)
                }
                className="w-full border p-2 rounded shadow-sm"
              />
            </div>
          </div>

          <div className="mt-4">
            {!showNoteField ? (
              <button
                onClick={() => setShowNoteField(true)}
                className="text-sm text-blue-600 underline cursor-pointer"
              >
                + Add Note
              </button>
            ) : (
              <div className="space-y-2">
                <textarea
                  className="w-full border p-2 rounded"
                  rows={3}
                  placeholder="Type your note here..."
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowNoteField(false)}
                    className="text-sm px-3 py-1 rounded border cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      handleNoteAdd(noteInput);
                      setNoteInput("");
                      setShowNoteField(false);
                    }}
                    className="text-sm px-3 py-1 rounded bg-blue-600 text-white cursor-pointer"
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 border-t pt-4">
            <h4 className="text-md font-semibold mb-2">Audit Trail</h4>
            {auditTrail.length === 0 ? (
              <p className="text-gray-400 text-xs italic">No changes yet.</p>
            ) : (
              <ul className="space-y-2 text-xs text-gray-700">
                {auditTrail.map((entry, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span
                      className={`h-2 w-2 mt-1 rounded-full ${entry.color}`}
                    ></span>
                    <span>
                      <strong>{entry.label}</strong> - {entry.note}{" "}
                      <span className="text-gray-400 ml-2">
                        {entry.timestamp}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-8 flex gap-4">
            <button
              onClick={() => {
                handleConversionTypeChange(customer.id, "approved");
                alert("Approved");
                onClose();
              }}
              className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle size={16} /> Approve
            </button>
            <button
              onClick={() => {
                const reason = prompt("Enter reason for rejection:");
                handleConversionTypeChange(customer.id, "rejected", reason);
                alert("Rejected");
                onClose();
              }}
              className="bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2 cursor-pointer"
            >
              <XCircle size={16} /> Reject
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-700 text-white rounded cursor-pointer"
            >
              Save Changes
            </button>
          </div>
          {/* <div className="mt-6">
          </div> */}
        </div>

        {showConfirm && (
          <div className="fixed inset-0 bg-opacity-0 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-xl text-center w-full max-w-sm">
              <h3 className="text-lg font-semibold mb-4">Confirm Save</h3>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to save these changes?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 rounded border border-gray-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const Conversions = () => {
  const [customers, setCustomers] = useState(mockCustomers);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [revenueToAdd, setRevenueToAdd] = useState(0);
  const [auditTrail, setAuditTrail] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [filteredResults, setFilteredResults] = useState(mockCustomers);
  const [currentPage, setCurrentPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const itemsPerPage = 5;

  const filtered = filteredResults.filter(
    (p) => p.consversionType === activeTab
  );
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const handleConversionTypeChange = (id, newConversionType, reason = null) => {
    const updated = customers.map((p) =>
      p.id === id
        ? {
            ...p,
            consversionType: newConversionType,
            ...(reason && { rejectReason: reason }),
          }
        : p
    );
    setCustomers(updated);
    setFilteredResults(updated);
    setDrawerOpen(false);
  };

  const handleInputChange = (field, value) => {
    setSelectedCustomer((prev) => {
      const updated = { ...prev, [field]: value };
      setAuditTrail((prevTrail) => [
        ...prevTrail,
        {
          label: `${field.charAt(0).toUpperCase() + field.slice(1)} updated`,
          note: value,
          timestamp: formatDateTime(),
          color: "bg-blue-500",
        },
      ]);
      return updated;
    });
  };

  const handleAddRevenue = () => {
    const amount = parseFloat(revenueToAdd || 0);
    setSelectedCustomer((prev) => {
      const updated = { ...prev, totalPaid: prev.totalPaid + amount };
      setAuditTrail((prevTrail) => [
        ...prevTrail,
        {
          label: "Revenue updated",
          note: `₹${amount}`,
          timestamp: formatDateTime(),
          color: "bg-green-500",
        },
      ]);
      return updated;
    });
    setRevenueToAdd(0);
  };

  const handleNoteAdd = (note) => {
    if (note.trim()) {
      setAuditTrail((prev) => [
        ...prev,
        {
          label: "Note added",
          note,
          timestamp: formatDateTime(),
          color: "bg-yellow-500",
        },
      ]);
    }
  };

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold mb-4">Customer Conversions</h1>
      <div className="flex gap-4 border-b pb-2 mb-4">
        {["Pending", "Approved", "Rejected"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 text-sm font-medium border-b-2 cursor-pointer ${
              activeTab === tab.toLowerCase()
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500"
            }`}
            onClick={() => setActiveTab(tab.toLowerCase())}
          >
            {tab}
          </button>
        ))}
      </div>
      <table className="w-full table-auto border rounded">
        <thead className="bg-gray-100 text-sm">
          <tr>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Phone</th>
            <th className="px-4 py-2 text-left">Plan</th>
            <th className="px-4 py-2 text-left">Total Paid</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((customer) => (
            <tr key={customer.id} className="border-t text-sm">
              <td className="px-4 py-2">{customer.customerName}</td>
              <td className="px-4 py-2">{customer.email}</td>
              <td className="px-4 py-2">{customer.phone}</td>
              <td className="px-4 py-2">{customer.plan}</td>
              <td className="px-4 py-2">
                ₹{customer.totalPaid.toLocaleString()}
              </td>
              <td className="px-4 py-2">
                {getStatusBadge(customer.status, customer.statusColor)}
              </td>
              <td className="px-4 py-2">
                <button
                  className="text-blue-600 underline text-sm cursor-pointer"
                  onClick={() => {
                    setSelectedCustomer(customer);
                    setAuditTrail([]);
                    setRevenueToAdd(0);
                  }}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedCustomer && (
        <Drawer
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          revenueToAdd={revenueToAdd}
          setRevenueToAdd={setRevenueToAdd}
          handleInputChange={handleInputChange}
          handleAddRevenue={handleAddRevenue}
          auditTrail={auditTrail}
          handleNoteAdd={handleNoteAdd}
          handleConversionTypeChange={handleConversionTypeChange}
        />
      )}
    </div>
  );
};

export default Conversions;
