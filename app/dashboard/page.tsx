"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useRouter } from "next/navigation";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../context/AuthContext";

interface DocumentType {
  _id: string;
  title: string;
  content: any;
}

export default function DashboardPage() {
  const router = useRouter();

  const { loading, token } = useAuth();

  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [newTitle, setNewTitle] = useState("");

  // Fetch documents
  const fetchDocuments = async () => {
    try {
      const res = await axiosInstance.get("/documents");
      setDocuments(res.data);
    } catch (err) {
      console.error("Failed to fetch documents");
    } 

  };

  // Create document
  const createDocument = async () => {
    if (!newTitle.trim()) return;

    try {
      const res = await axiosInstance.post("/documents/", {
        title: newTitle,
        content: [], // empty delta
      });

      setNewTitle("");
      setDocuments((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("Failed to create document");
    }
  };

  // Delete document
  const deleteDocument = async (id: string) => {
    try {
      await axiosInstance.delete(`/documents/${id}`);
      setDocuments((prev) => prev.filter((doc) => doc._id !== id));
    } catch (err) {
      console.error("Failed to delete document");
    }
  };

  useEffect(() => {
    if (!loading && token) {
      fetchDocuments();
    }
  }, [loading, token]);

  if (loading) return <p>Loading...</p>;

  return (
    <ProtectedRoute>
      <div style={{ padding: 40 }}>
        <h2>Your Documents</h2>

        {/* Create new */}
        <div style={{ marginTop: 20 }}>
          <input
            placeholder="New document title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <button onClick={createDocument}>Create</button>
        </div>

        {/* List */}
        <ul style={{ marginTop: 30 }}>
          {documents.map((doc) => (
            <li key={doc._id} style={{ marginBottom: 10 }}>
              <span
                style={{ cursor: "pointer", color: "blue" }}
                onClick={() => router.push(`/documents/${doc._id}`)}
              >
                {doc.title}
              </span>

              <button
                onClick={() => deleteDocument(doc._id)}
                style={{ marginLeft: 10 }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>

        {documents.length === 0 && <p>No documents yet.</p>}
      </div>
    </ProtectedRoute>
  );
}
