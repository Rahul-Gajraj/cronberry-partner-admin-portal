import React, { useState } from "react";
import { FileText, Eye, XCircle, Edit2 } from "lucide-react";
import { format } from "date-fns";

const mockConversions = [
  {
    id: 1,
    customerName: "Rahul Verma",
    email: "rahul@example.com",
    phone: "9876543210",
    revenue: 5000,
    joinedOn: "2025-04-01",
    status: "Active",
  },
  {
    id: 2,
    customerName: "Sneha Kapoor",
    email: "sneha@example.com",
    phone: "9123456789",
    revenue: 10000,
    joinedOn: "2025-04-03",
    status: "Active",
  },
];

const slabOptions = [
  { id: 1, name: "Flat 10% Commission", type: "fixed" },
  { id: 2, name: "₹5000 Bonus on 5 Sales", type: "bonus" },
  { id: 3, name: "₹25000 Bonus on ₹5L Revenue", type: "bonus" },
];

const RenderConversions = () => {
  return (
    <div className="mt-6">
      <h3 className="font-medium text-gray-700 mb-2">Customer Conversions</h3>
      <div className="overflow-x-auto border rounded">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Revenue</th>
              <th className="px-4 py-2">Joined On</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {mockConversions.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="px-4 py-2">{c.customerName}</td>
                <td className="px-4 py-2">{c.email}</td>
                <td className="px-4 py-2">{c.phone}</td>
                <td className="px-4 py-2">₹{c.revenue.toLocaleString()}</td>
                <td className="px-4 py-2">{c.joinedOn}</td>
                <td className="px-4 py-2">{c.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const PartnerDetailDrawer = ({
  selectedPartner,
  setDrawerOpen,
  setSelectedPartner,
  setShowConversions,
  showConversions,
}) => {
  const [editSlabsMode, setEditSlabsMode] = useState(false);

  const toggleSlabSelection = (slab) => {
    const exists = selectedPartner.assignedSlabs.some((s) => s.id === slab.id);
    const updatedSlabs = exists
      ? selectedPartner.assignedSlabs.filter((s) => s.id !== slab.id)
      : [...selectedPartner.assignedSlabs, slab];
    setSelectedPartner({ ...selectedPartner, assignedSlabs: updatedSlabs });
  };

  const getStatusBadge = (status) => (
    <span className="inline-block px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded">
      {status}
    </span>
  );

  const getInitials = (name) => {
    const words = name.trim().split(" ");
    return words.length >= 2
      ? words[0][0].toUpperCase() + words[1][0].toUpperCase()
      : name.slice(0, 2).toUpperCase();
  };

  const renderSlabs = () => {
    const fixed = selectedPartner.assignedSlabs.filter(
      (s) => s.type === "fixed"
    );
    const bonus = selectedPartner.assignedSlabs.filter(
      (s) => s.type === "bonus"
    );
    return (
      <div>
        <h3 className="font-medium mb-2 text-gray-700 flex items-center justify-between">
          Commission Slabs
          <button
            onClick={() => {
              if (editSlabsMode && selectedPartner.assignedSlabs.length == 0) {
                alert("Select atleast 1 slab");
                return;
              }
              setEditSlabsMode(!editSlabsMode);
            }}
            className="text-sm text-blue-600 flex items-center gap-1 cursor-pointer"
          >
            <Edit2 className="w-4 h-4" /> {editSlabsMode ? "Done" : "Edit"}
          </button>
        </h3>
        {editSlabsMode ? (
          <div className="flex flex-col gap-2">
            {slabOptions.map((slab) => (
              <label key={slab.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selectedPartner.assignedSlabs.some(
                    (s) => s.id === slab.id
                  )}
                  onChange={() => toggleSlabSelection(slab)}
                />
                <span className="px-2 py-1 rounded bg-gray-100">
                  {slab.name} {slab.type === "fixed" ? "🔹" : "🎁"}
                </span>
              </label>
            ))}
          </div>
        ) : (
          <div className="text-sm space-y-2">
            {fixed.length > 0 && (
              <div>
                <p className="font-semibold mb-1 text-green-700">
                  🔹 Fixed Slabs
                </p>
                <ul className="list-disc pl-5 text-gray-700">
                  {fixed.map((s) => (
                    <li key={s.id}>{s.name}</li>
                  ))}
                </ul>
              </div>
            )}
            {bonus.length > 0 && (
              <div className="mt-2">
                <p className="font-semibold mb-1 text-purple-700">
                  🎁 Bonus Slabs
                </p>
                <ul className="list-disc pl-5 text-gray-700">
                  {bonus.map((s) => (
                    <li key={s.id}>{s.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-40 flex justify-end z-50">
      <div className="bg-white w-full max-w-2xl h-full overflow-y-auto p-6 relative shadow-xl">
        <button
          className="absolute right-4 top-4 cursor-pointer"
          onClick={() => setDrawerOpen(false)}
        >
          <XCircle className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-4 mb-6 border-b pb-4">
          <div className="bg-gray-200 rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold">
            {getInitials(selectedPartner.name)}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{selectedPartner.name}</h2>
            <p className="text-gray-500 text-sm">Approved Partner</p>
          </div>
        </div>

        <div className="space-y-6 text-sm">
          <div>
            <h3 className="font-medium mb-2 text-gray-700">Contact Info</h3>
            <div className="grid grid-cols-2 gap-4">
              <p>
                <strong>Email:</strong> {selectedPartner.email}
              </p>
              <p>
                <strong>Mobile:</strong> {selectedPartner.mobile}
              </p>
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-2 text-gray-700">Company Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <p>
                <strong>Company:</strong> {selectedPartner.company}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {getStatusBadge(selectedPartner.status)}
              </p>
              <p>
                <strong>Approved On:</strong>{" "}
                {format(selectedPartner.approvedOn, "yyyy-MM-dd")}
              </p>
              <p>
                <strong>Last Sale:</strong> {selectedPartner.lastSaleDate}
              </p>
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-2 text-gray-700">Performance</h3>
            <div className="grid grid-cols-2 gap-4">
              <p>
                <strong>Total Onboarded:</strong>{" "}
                <button
                  onClick={() => setShowConversions(!showConversions)}
                  className="underline text-blue-600 cursor-pointer"
                >
                  {selectedPartner.customersOnboarded} Customers
                </button>
              </p>
              <p>
                <strong>Total Revenue:</strong> ₹
                {selectedPartner.revenueGenerated.toLocaleString()}
              </p>
            </div>
          </div>

          {renderSlabs()}

          <div>
            <h3 className="font-medium mb-2 text-gray-700">Documents</h3>
            <div className="flex gap-4">
              <a
                href={selectedPartner.pan}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-600 flex items-center"
              >
                <FileText className="w-4 h-4 mr-1" /> PAN
              </a>
              <a
                href={selectedPartner.gst}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-600 flex items-center"
              >
                <FileText className="w-4 h-4 mr-1" /> GST
              </a>
            </div>
          </div>

          {showConversions && <RenderConversions />}
        </div>
      </div>
    </div>
  );
};

export default PartnerDetailDrawer;
