import React, { useState } from "react";
import { FileText, Eye, XCircle, Edit2, Search, Filter } from "lucide-react";
import PartnerDetailDrawer from "./PartnerDetailDrawer";

import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";

const Partners = () => {
  const mockActivePartners = useSelector((state) => state.partners);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showConversions, setShowConversions] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const getStatusBadge = (status) => (
    <span className="inline-block px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded">
      {status}
    </span>
  );

  const filteredPartners = mockActivePartners.filter((partner) => {
    const matchSearch =
      partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter ? partner.status === statusFilter : true;
    return matchSearch && matchStatus;
  });

  const paginatedPartners = filteredPartners.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredPartners.length / itemsPerPage);

  return (
    <div className="p-6 space-y-6 w-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Active Partners</h1>
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2 border rounded p-2">
            <Search size={18} className="text-gray-500" />
            <input
              className="w-64"
              placeholder="Search by name or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                outline: "none",
              }}
            />
          </div>
          <div className="flex items-center gap-2 border rounded p-2">
            <Filter size={18} className="text-gray-500" />
            <select
              className="text-sm cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ outline: "none" }}
            >
              <option value="">All</option>
              <option value="Approved">Approved</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>
      {/* <div className="flex gap-4">
        <div className="flex items-center gap-2 border rounded p-1">
          <Search size={18} className="text-gray-500" />
          <input
            className="w-64"
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              outline: "none",
            }}
          />
        </div>
        <div className="flex items-center gap-2 border rounded p-2">
          <Filter size={18} className="text-gray-500" />
          <select
            className="text-sm cursor-pointer"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ outline: "none" }}
          >
            <option value="">All</option>
            <option value="Approved">Approved</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div> */}

      <div className="overflow-x-auto border rounded">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-xs font-semibold uppercase">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Mobile</th>
              <th className="px-4 py-2">Company</th>
              <th className="px-4 py-2">Approved On</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPartners.map((partner) => (
              <tr key={partner.id} className="border-t">
                <td className="px-4 py-2">{partner.name}</td>
                <td className="px-4 py-2">{partner.email}</td>
                <td className="px-4 py-2">{partner.mobile}</td>
                <td className="px-4 py-2">{partner.company}</td>
                {/* <td className="px-4 py-2">{partner.approvedOn}</td> */}
                <td className="px-4 py-2">
                  {format(partner.approvedOn, "yyyy-MM-dd")}
                </td>

                <td className="px-4 py-2">{getStatusBadge(partner.status)}</td>
                <td className="px-4 py-2 text-right">
                  <button
                    className="inline-flex items-center px-2 py-1 border rounded text-sm cursor-pointer"
                    onClick={() => {
                      setSelectedPartner(partner);
                      setShowConversions(false);
                      setDrawerOpen(true);
                    }}
                  >
                    <Eye className="w-4 h-4 mr-1" /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
      {/* <div className="flex justify-center gap-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className="px-3 py-1 border rounded"
        >
          Previous
        </button>
        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
          className="px-3 py-1 border rounded"
        >
          Next
        </button>
      </div> */}

      {drawerOpen && (
        <PartnerDetailDrawer
          selectedPartner={selectedPartner}
          setDrawerOpen={setDrawerOpen}
          setSelectedPartner={setSelectedPartner}
          setShowConversions={setShowConversions}
          showConversions={showConversions}
        />
      )}
    </div>
  );
};

export default Partners;
