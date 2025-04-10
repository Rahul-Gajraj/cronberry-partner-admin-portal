import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Plus,
  Upload,
  Trash2,
  PencilLine,
  Megaphone,
  X,
  BellPlus,
} from "lucide-react";

export default function Announcements() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showPreview, setShowPreview] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("announcements");
    if (saved) setAnnouncements(JSON.parse(saved));
    else preloadDemo();
  }, []);

  const preloadDemo = () => {
    const demo = Array.from({ length: 6 }, (_, i) => ({
      id: i + 1,
      title: `Dummy Announcement ${i + 1}`,
      body: "This is a sample announcement body to demonstrate layout and features.",
      fileUrl: "https://www.cronberry.com/images/cronberry-logo.svg",
      fileType: "image/svg+xml",
    }));
    setAnnouncements(demo);
    localStorage.setItem("announcements", JSON.stringify(demo));
  };

  const resetForm = () => {
    setTitle("");
    setBody("");
    setFile(null);
    setPreviewUrl(null);
    setEditingAnnouncement(null);
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
  };

  const handleSubmit = () => {
    if (!title || !body) {
      alert("Please fill in all fields");
      return;
    }
    const newEntry = {
      id: editingAnnouncement?.id || Date.now(),
      title,
      body,
      fileUrl:
        previewUrl || "https://www.cronberry.com/images/cronberry-logo.svg",
      fileType: file?.type || "image/svg+xml",
    };
    const updated =
      editingAnnouncement && editingAnnouncement.id
        ? announcements.map((a) =>
            a.id === editingAnnouncement.id ? newEntry : a
          )
        : [...announcements, newEntry];
    setAnnouncements(updated);
    localStorage.setItem("announcements", JSON.stringify(updated));
    resetForm();
    alert(
      editingAnnouncement
        ? "✅ Announcement updated successfully."
        : "✅ Announcement created successfully."
    );
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this announcement?")) {
      const filtered = announcements.filter((a) => a.id !== id);
      setAnnouncements(filtered);
      localStorage.setItem("announcements", JSON.stringify(filtered));
      setShowDeleteConfirm(null);
    }
  };

  const handleResend = (a) => {
    const reordered = [a, ...announcements.filter((x) => x.id !== a.id)];
    setAnnouncements(reordered);
    localStorage.setItem("announcements", JSON.stringify(reordered));
    alert(`✅ Successfully resent: "${a.title}" to partners!`);
  };

  const filteredAnnouncements = announcements.filter(
    (a) =>
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.body.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mx-auto p-6 w-full overflow-auto">
      <div className="flex justify-between items-center mb-6">
        <Input
          placeholder="Search announcements..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/2"
        />
        <Button
          onClick={() => {
            resetForm();
            setEditingAnnouncement({});
          }}
        >
          <BellPlus size={18} />
        </Button>
      </div>

      {editingAnnouncement && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl relative">
            <button className="absolute top-3 right-3" onClick={resetForm}>
              <X />
            </button>
            <h2 className="text-lg font-semibold mb-4">
              {editingAnnouncement?.id
                ? "Edit Announcement"
                : "Create Announcement"}
            </h2>
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Announcement Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Textarea
                rows={4}
                placeholder="Write your announcement here..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
              <Input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf,.svg"
                onChange={handleFileChange}
              />
              {previewUrl && (
                <div className="border rounded">
                  <img
                    src={previewUrl}
                    className="w-full h-40 object-contain"
                    alt="preview"
                  />
                </div>
              )}
              <div className="flex justify-end">
                <Button
                  onClick={handleSubmit}
                  className="flex items-center gap-2"
                >
                  <Upload size={16} />{" "}
                  {editingAnnouncement?.id ? "Update" : "Publish"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredAnnouncements.map((a) => (
          <div
            key={a.id}
            className="rounded-xl border bg-white p-4 shadow hover:shadow-md transition relative cursor-pointer"
            onClick={() => setShowPreview(a)}
          >
            {a.fileUrl && (
              <div className="overflow-hidden rounded border mb-4 h-36 flex items-center justify-center bg-gray-50">
                <img
                  src={a.fileUrl}
                  className="object-contain h-full"
                  alt="preview"
                />
              </div>
            )}
            <h3 className="text-lg font-bold mb-1 truncate">{a.title}</h3>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{a.body}</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setTitle(a.title);
                  setBody(a.body);
                  setPreviewUrl(a.fileUrl);
                  setEditingAnnouncement(a);
                }}
                className="text-yellow-600"
                title="Edit"
              >
                <PencilLine size={18} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteConfirm(a.id);
                  handleDelete(a.id);
                }}
                className="text-red-600"
                title="Delete"
              >
                <Trash2 size={18} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleResend(a);
                }}
                className="text-blue-600"
                title="Resend"
              >
                <Megaphone size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
