"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useRouter } from "next/navigation";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../context/AuthContext";
import {
  FileText,
  Plus,
  Trash2,
  Search,
  LogOut,
  User,
  Clock,
  MoreVertical,
  Folder,
} from "lucide-react";

interface DocumentType {
  _id: string;
  title: string;
  content: any;
  updatedAt?: string;
  createdAt?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { loading, token, logout } = useAuth();

  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [docsLoading, setDocsLoading] = useState(true);


  // Fetch documents
  const fetchDocuments = async () => {
    try {
      const res = await axiosInstance.get("/documents");
      setDocuments(res.data);
    } catch (err) {
      console.error("Failed to fetch documents");
    } finally {
      setDocsLoading(false);
    }
  };

  // Create document
  const createDocument = async () => {
    if (!newTitle.trim()) return;
    setIsCreating(true);

    try {
      const res = await axiosInstance.post("/documents/", {
        title: newTitle,
        content: [],
      });

      setNewTitle("");
      setDocuments((prev) => [res.data, ...prev]);
      setShowCreateModal(false);
    } catch (err) {
      console.error("Failed to create document");
    } finally {
      setIsCreating(false);
    }
  };

  // Delete document
  const deleteDocument = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this document?")) return;

    try {
      await axiosInstance.delete(`/documents/${id}`);
      setDocuments((prev) => prev.filter((doc) => doc._id !== id));
    } catch (err) {
      console.error("Failed to delete document");
    }
  };

  // Filter documents
  const filteredDocuments = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (!loading && token) {
      fetchDocuments();
    }
  }, [loading, token]);

  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center h-screen w-screen bg-linear-to-br from-indigo-50 via-white to-purple-50">
  //       <div className="flex flex-col items-center gap-4">
  //         <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
  //         <p className="text-gray-600 font-medium">Loading...</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50">
        {/* Navigation Bar */}
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-linear-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  DocSync
                </span>
              </div>

              {/* User Menu */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => logout()}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Your Documents
            </h1>
            <p className="text-gray-600">
              Create, edit, and collaborate on documents in real-time
            </p>
          </div>

          {/* Actions Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Create Button */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
              New Document
            </button>
          </div>

          {/* Documents Grid */}
          {!token || docsLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredDocuments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocuments.map((doc) => (
                <div
                  key={doc._id}
                  onClick={() => router.push(`/document/${doc._id}`)}
                  className="group bg-white rounded-xl border border-gray-200 p-6 hover:shadow-xl hover:border-indigo-200 transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-linear-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FileText className="w-6 h-6 text-indigo-600" />
                    </div>
                    <button
                      onClick={(e) => deleteDocument(doc._id, e)}
                      className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                    {doc.title}
                  </h3>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>
                      {doc.updatedAt
                        ? new Date(doc.updatedAt).toLocaleDateString()
                        : "Recently"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Folder className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchQuery ? "No documents found" : "No documents yet"}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery
                  ? "Try adjusting your search terms"
                  : "Create your first document to get started"}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200"
                >
                  <Plus className="w-5 h-5" />
                  Create Your First Document
                </button>
              )}
            </div>
          )}
        </div>

        {/* Create Document Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Create New Document
              </h2>

              <div className="mb-6">
                <label
                  htmlFor="title"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Document Title
                </label>
                <input
                  id="title"
                  type="text"
                  autoFocus
                  placeholder="Enter document title..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && createDocument()}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewTitle("");
                  }}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={createDocument}
                  disabled={!newTitle.trim() || isCreating}
                  className="flex-1 px-4 py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isCreating ? "Creating..." : "Create"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
