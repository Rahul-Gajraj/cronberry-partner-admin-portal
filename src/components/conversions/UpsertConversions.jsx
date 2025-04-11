import React, { useState } from "react";
import { XCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";

function formatDateTime(date = new Date()) {
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

const UpsertConversions = ({
  customer,
  onClose,
  revenueToAdd,
  setRevenueToAdd,
  handleInputChange,
  handleAddRevenue,
  auditTrail,
  handleNoteAdd,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    getValues,
    setValue,
  } = useForm({
    defaultValues: {
      status: "active",
      additionalPaid: 0,
      total: 12000,
      renewalDate: formatDateTime(),
      auditTrails: [],
      note: "",
    },
  });

  const [showConfirm, setShowConfirm] = useState(false);
  const [noteInput, setNoteInput] = useState("");
  const [showNoteField, setShowNoteField] = useState(false);

  const handleSave = () => setShowConfirm(true);
  const confirmSave = () => {
    setShowConfirm(false);
    alert("Changes saved successfully.");
  };

  const totalAmount = watch("total");
  const auditTrails = watch("auditTrails");
  const renewalDate = watch("renewalDate");
  console.log(renewalDate);

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
                {...register("status", { required: true })}
                className="w-full border p-2 rounded"
                // value={customer.status}
                // onChange={(e) => handleInputChange("status", e.target.value)}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
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
                  ₹{totalAmount.toLocaleString()}
                </span>
                <input
                  {...register("additionalPaid", { required: true })}
                  type="number"
                  className="border p-2 rounded w-24"
                  placeholder="+ Add"
                  //   value={revenueToAdd}
                  //   onChange={(e) => setRevenueToAdd(e.target.value)}
                />
                <button
                  onClick={() => {
                    const additionalPaid = getValues("additionalPaid");
                    if (additionalPaid != 0) {
                      setValue(
                        "total",
                        Number(totalAmount) + Number(additionalPaid)
                      );
                      handleAddRevenue();
                    }
                  }}
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
                {...register("renewalDate", { required: true })}
                type="date"
                // value={customer.renewalDate}
                // onChange={(e) =>
                //   handleInputChange("renewalDate", e.target.value)
                // }
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
                  {...register("note", { required: true })}
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
                      const prevAudits = getValues("auditTrails");
                      setValue("auditTrails", [
                        ...prevAudits,
                        {
                          label: "Note added",
                          note: noteInput.trim(),
                          timestamp: formatDateTime(),
                          color: "bg-yellow-500",
                        },
                      ]);
                      setValue("note", "");
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
            {auditTrails.length === 0 ? (
              <p className="text-gray-400 text-xs italic">No changes yet.</p>
            ) : (
              <ul className="space-y-2 text-xs text-gray-700">
                {auditTrails.map((entry, idx) => (
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

          <div className="mt-6">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-700 text-white rounded cursor-pointer"
            >
              Save Changes
            </button>
          </div>
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
};

export default UpsertConversions;
