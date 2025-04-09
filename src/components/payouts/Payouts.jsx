import React, { useState } from "react";
import { Eye, X } from "lucide-react";

const Payouts = () => {
  const [payouts, setPayouts] = useState([
    {
      id: 1,
      partner: "Ananya Gupta",
      companyName: "BrightTech",
      email: "ananya@brighttech.com",
      phone: "9876543210",
      amount: 15000,
      date: "2025-04-01",
      status: "Requested",
      bankDetails: {
        accountHolder: "Ananya Gupta",
        accountNumber: "123456789012",
        ifsc: "BRIG0000123",
        bank: "Bright Bank",
      },
    },
    {
      id: 2,
      partner: "Ravi Kumar",
      companyName: "NextGen Solutions",
      email: "ravi@nextgen.com",
      phone: "9123456789",
      amount: 12000,
      date: "2025-04-02",
      status: "Approved",
    },
    {
      id: 3,
      partner: "Priya Singh",
      companyName: "TechNest",
      email: "priya@technest.com",
      phone: "9871234567",
      amount: 18000,
      date: "2025-03-29",
      status: "Settled",
    },
    {
      id: 4,
      partner: "Karan Mehta",
      companyName: "DigitalWings",
      email: "karan@digitalwings.com",
      phone: "9988776655",
      amount: 11000,
      date: "2025-03-28",
      status: "Rejected",
      rejectReason: "Missing banking details",
    },
    {
      id: 5,
      partner: "Sneha Verma",
      companyName: "CoreLogic",
      email: "sneha@corelogic.com",
      phone: "9898989898",
      amount: 13500,
      date: "2025-04-03",
      status: "Requested",
    },
  ]);
  const [activeTab, setActiveTab] = useState("Requested");
  const [selected, setSelected] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredResults, setFilteredResults] = useState(payouts);
  const itemsPerPage = 5;

  const filtered = filteredResults.filter((p) => p.status === activeTab);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const handleStatusChange = (id, newStatus, reason = null) => {
    const updated = payouts.map((p) =>
      p.id === id
        ? { ...p, status: newStatus, ...(reason && { rejectReason: reason }) }
        : p
    );
    setPayouts(updated);
    setFilteredResults(updated);
    setDrawerOpen(false);
  };

  const exportToCSV = () => {
    const headers = [
      "Partner",
      "Company Name",
      "Email",
      "Phone",
      "Amount",
      "Status",
      "Date",
    ];
    const rows = payouts.map((p) => [
      p.partner,
      p.companyName,
      p.email,
      p.phone,
      p.amount,
      p.status,
      p.date,
    ]);
    const csvContent = [headers, ...rows]
      .map((row) =>
        row.map((field) => `"${String(field).replace(/"/g, '""')}`).join(",")
      )
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "payouts.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 space-y-6 w-full">
      <div className="space-y-4">
        <div className="flex gap-4 border-b pb-2 mb-4">
          {["Requested", "Approved", "Settled", "Rejected"].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 text-sm font-medium border-b-2 cursor-pointer ${
                activeTab === tab
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab} Payouts
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center gap-4">
          <input
            type="text"
            placeholder="Search by Partner or Company"
            className="border px-3 py-1 rounded text-sm w-1/3"
            onChange={(e) => {
              const val = e.target.value.toLowerCase();
              const filteredList = payouts.filter(
                (p) =>
                  p.partner.toLowerCase().includes(val) ||
                  p.companyName.toLowerCase().includes(val)
              );
              setFilteredResults(filteredList);
            }}
          />
          <button
            onClick={exportToCSV}
            className="px-3 py-1 bg-blue-600 text-white rounded cursor-pointer"
          >
            Export to Excel
          </button>
        </div>

        <table className="w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Partner</th>
              <th className="p-2 text-left">Amount</th>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-2">{p.partner}</td>
                <td className="p-2">₹{p.amount.toLocaleString()}</td>
                <td className="p-2">{p.date}</td>
                <td className="p-2">{p.status}</td>
                <td className="p-2">
                  <button
                    onClick={() => {
                      setSelected(p);
                      setDrawerOpen(true);
                    }}
                    className="text-blue-600 underline text-sm flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-4 h-4" /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
          >
            Next
          </button>
        </div>
      </div>

      {drawerOpen && selected && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-40 flex justify-end z-50">
          <div className="bg-white w-full max-w-md h-full overflow-y-auto p-6 shadow-2xl border-l border-gray-200 relative rounded-l-2xl">
            <button
              onClick={() => setDrawerOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="space-y-6">
              <div className="flex items-center gap-4 border-b pb-4">
                <div className="bg-blue-100 text-blue-700 font-bold w-12 h-12 flex items-center justify-center rounded-full text-lg">
                  {selected.partner
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{selected.partner}</h3>
                  <p className="text-gray-500">{selected.companyName}</p>
                  <p className="text-gray-400 text-sm">{selected.email}</p>
                  <p className="text-gray-400 text-sm">{selected.phone}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Amount</p>
                  <p className="font-medium">₹{selected.amount}</p>
                </div>
                <div>
                  <p className="text-gray-500">Date</p>
                  <p className="font-medium">{selected.date}</p>
                </div>
                <div>
                  <p className="text-gray-500">Status</p>
                  <p className="font-medium">{selected.status}</p>
                </div>
              </div>

              <div className="pt-4 text-sm space-y-2">
                <h4 className="font-semibold text-gray-700">Bank Details</h4>
                <p>
                  <span className="text-gray-500">Account Holder:</span>{" "}
                  {selected.bankDetails?.accountHolder || "—"}
                </p>
                <p>
                  <span className="text-gray-500">Account Number:</span>{" "}
                  {selected.bankDetails?.accountNumber || "—"}
                </p>
                <p>
                  <span className="text-gray-500">IFSC:</span>{" "}
                  {selected.bankDetails?.ifsc || "—"}
                </p>
                <p>
                  <span className="text-gray-500">Bank:</span>{" "}
                  {selected.bankDetails?.bank || "—"}
                </p>
              </div>

              {selected.status === "Requested" && (
                <div className="pt-6 space-y-2">
                  <button
                    className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded cursor-pointer"
                    onClick={() => handleStatusChange(selected.id, "Approved")}
                  >
                    Approve
                  </button>
                  <button
                    className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded cursor-pointer"
                    onClick={() => {
                      const reason = prompt("Enter reason for rejection:");
                      if (reason)
                        handleStatusChange(selected.id, "Rejected", reason);
                    }}
                  >
                    Reject
                  </button>
                </div>
              )}
              {selected.status === "Approved" && (
                <div className="pt-6">
                  <button
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded cursor-pointer"
                    onClick={() => handleStatusChange(selected.id, "Settled")}
                  >
                    Mark as Settled
                  </button>
                </div>
              )}
              {selected.status === "Rejected" && selected.rejectReason && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded mt-6">
                  <strong>Reason:</strong> {selected.rejectReason}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payouts;
