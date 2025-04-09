import React, { useState } from "react";

import {
  Pencil,
  Trash2,
  Users,
  Clock,
  PlusCircle,
  MinusCircle,
} from "lucide-react";

import { FileText, Eye, XCircle, Edit2 } from "lucide-react";

const Commissions = () => {
  const [slabs, setSlabs] = useState([
    {
      id: 1,
      name: "10% Flat Commission",
      type: "flat",
      value: 10,
      ranges: [],
      createdAt: new Date().toLocaleString(),
      auditTrail: [
        {
          action: "Created",
          details: "Initial flat commission slab",
          timestamp: new Date().toLocaleString(),
        },
      ],
    },
    {
      id: 2,
      name: "Revenue Based Bonus",
      type: "revenue",
      value: "",
      ranges: [
        { from: 200000, to: 500000, amount: 5000, isPercent: false },
        { from: 500001, to: 1000000, amount: 15000, isPercent: false },
      ],
      createdAt: new Date().toLocaleString(),
      auditTrail: [
        {
          action: "Created",
          details: "Initial revenue slab added",
          timestamp: new Date().toLocaleString(),
        },
      ],
    },
  ]);
  const [type, setType] = useState("flat");
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [ranges, setRanges] = useState([
    { from: "", to: "", amount: "", isPercent: false },
  ]);
  const [editingId, setEditingId] = useState(null);
  const [assignedPartners, setAssignedPartners] = useState({
    1: ["Ravi Kumar", "Neha Singh"],
    2: ["Ankit Verma"],
  });
  const [viewPartnersFor, setViewPartnersFor] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [viewAuditFor, setViewAuditFor] = useState(null);

  const initialAudit = (action, details) => [
    { action, details, timestamp: new Date().toLocaleString() },
  ];

  const handleAddOrUpdateSlab = () => {
    if (
      !name ||
      (type === "flat" && !value) ||
      ((type === "sales" || type === "revenue") &&
        ranges.some((r) => !r.from || !r.to || !r.amount))
    ) {
      alert("Please fill all required fields.");
      return;
    }

    let newAuditTrail = [];
    const existing = slabs.find((s) => s.id === editingId);
    const updatedSlab = {
      id: editingId || Date.now(),
      name,
      type,
      value,
      ranges,
      createdAt: new Date().toLocaleString(),
      auditTrail: existing
        ? [
            ...existing.auditTrail,
            {
              action: "Updated",
              details: `Updated ${name}`,
              timestamp: new Date().toLocaleString(),
            },
          ]
        : initialAudit("Created", name),
    };

    setSlabs((prev) =>
      editingId
        ? prev.map((s) => (s.id === editingId ? updatedSlab : s))
        : [...prev, updatedSlab]
    );
    setName("");
    setValue("");
    setRanges([{ from: "", to: "", amount: "", isPercent: false }]);
    setType("flat");
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (slab) => {
    setEditingId(slab.id);
    setType(slab.type);
    setName(slab.name);
    setValue(slab.value);
    setRanges(
      slab.ranges || [{ from: "", to: "", amount: "", isPercent: false }]
    );
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setSlabs(slabs.filter((s) => s.id !== id));
  };

  const handleRangeChange = (index, field, value) => {
    const updated = [...ranges];
    updated[index][field] = value;
    setRanges(updated);
  };

  const addRange = () => {
    setRanges([...ranges, { from: "", to: "", amount: "", isPercent: false }]);
  };

  const removeRange = (index) => {
    const updated = [...ranges];
    updated.splice(index, 1);
    setRanges(updated);
  };

  const handleAuditView = (slab) => {
    setViewAuditFor(slab);
  };

  const handleViewPartners = (slab) => {
    const partners = assignedPartners[slab.id] || [];
    setViewPartnersFor({ slabName: slab.name, partners });
  };

  return (
    <div className="p-6 mx-auto w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Commission Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded text-sm cursor-pointer"
        >
          + Add Slab
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 p-4 border rounded mb-8">
          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Slab Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border p-2 rounded"
                placeholder="e.g. 10% for all"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Slab Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full border p-2 rounded"
              >
                <option value="flat">Flat %</option>
                <option value="sales">Bonus on Number of Sales</option>
                <option value="revenue">Bonus on Revenue Range</option>
              </select>
            </div>
            {type === "flat" && (
              <div>
                <label className="block mb-1">Commission %</label>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="border p-2 rounded w-full"
                  placeholder="e.g. 10"
                />
              </div>
            )}
            {(type === "sales" || type === "revenue") && (
              <div className="space-y-4">
                {ranges.map((r, i) => (
                  <div key={i} className="grid grid-cols-5 gap-4 items-end">
                    <div>
                      <label className="block text-sm">From</label>
                      <input
                        type="number"
                        value={r.from}
                        onChange={(e) =>
                          handleRangeChange(i, "from", e.target.value)
                        }
                        className="border p-2 rounded w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm">To</label>
                      <input
                        type="number"
                        value={r.to}
                        onChange={(e) =>
                          handleRangeChange(i, "to", e.target.value)
                        }
                        className="border p-2 rounded w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm">Amount</label>
                      <input
                        type="number"
                        value={r.amount}
                        onChange={(e) =>
                          handleRangeChange(i, "amount", e.target.value)
                        }
                        className="border p-2 rounded w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm">Type</label>
                      <select
                        value={r.isPercent ? "percent" : "flat"}
                        onChange={(e) =>
                          handleRangeChange(
                            i,
                            "isPercent",
                            e.target.value === "percent"
                          )
                        }
                        className="border p-2 rounded w-full"
                      >
                        <option value="flat">Flat</option>
                        <option value="percent">%</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={addRange}
                        className="text-green-600 cursor-pointer"
                      >
                        <PlusCircle />
                      </button>
                      {ranges.length > 1 && (
                        <button
                          onClick={() => removeRange(i)}
                          className="text-red-600 cursor-pointer"
                        >
                          <MinusCircle />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={handleAddOrUpdateSlab}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded cursor-pointer"
            >
              {editingId ? "Update Slab" : "Add Slab"}
            </button>
          </div>
        </div>
      )}

      {slabs.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-2">Defined Slabs</h2>
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-2">Name</th>
                <th className="text-left p-2">Type</th>
                <th className="text-left p-2">Details</th>
                <th className="text-left p-2">Partners</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {slabs.map((slab) => (
                <tr key={slab.id} className="border-t">
                  <td className="p-2 font-medium">{slab.name}</td>
                  <td className="p-2 capitalize">{slab.type}</td>
                  <td className="p-2">
                    {slab.type === "flat" && `${slab.value}%`}
                    {(slab.type === "sales" || slab.type === "revenue") && (
                      <ul className="list-disc ml-4">
                        {slab.ranges.map((r, i) => (
                          <li key={i}>
                            {r.from}-{r.to} →{" "}
                            {r.isPercent ? `${r.amount}%` : `₹${r.amount}`}
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                  <td className="p-2">
                    <button
                      onClick={() => handleViewPartners(slab)}
                      className="text-blue-600 underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Users size={14} />{" "}
                      {assignedPartners[slab.id]?.length || 0}
                    </button>
                  </td>
                  <td className="p-2 flex gap-2">
                    <button
                      onClick={() => handleAuditView(slab)}
                      className="text-gray-600 cursor-pointer"
                      title="View Audit Trail"
                    >
                      <Clock size={16} />
                    </button>
                    <button
                      onClick={() => handleEdit(slab)}
                      className="text-yellow-600 cursor-pointer"
                      title="Edit Slab"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(slab.id)}
                      className="text-red-600 cursor-pointer"
                      title="Delete Slab"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {viewAuditFor && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">
                Audit Trail for "{viewAuditFor.name}"
              </h3>
              <button
                onClick={() => setViewAuditFor(null)}
                className="text-sm text-red-600 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <ul className="list-disc pl-5 text-sm">
              {viewAuditFor.auditTrail.map((log, idx) => (
                <li key={idx}>
                  <strong>{log.action}</strong>: {log.details}{" "}
                  <span className="text-gray-400">({log.timestamp})</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {viewPartnersFor && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">
                Partners Assigned to "{viewPartnersFor.slabName}"
              </h3>
              <button
                onClick={() => setViewPartnersFor(null)}
                className="text-sm text-red-600 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            {viewPartnersFor.partners.length === 0 ? (
              <p className="text-sm text-gray-500">No partners assigned.</p>
            ) : (
              <ul className="list-disc pl-5 text-sm">
                {viewPartnersFor.partners.map((p, idx) => (
                  <li key={idx}>{p}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Commissions;
