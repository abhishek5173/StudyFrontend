"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import axiosInstance from "@/app/utils/axiosInstance";
import QuillEditor, { QuillEditorHandle } from "@/components/QuillEditor";
import {
  ArrowLeft,
  Save,
  FileText,
  Users,
  Clock,
  Check,
  Loader2,
  MoreVertical,
  Download,
  Share2,
} from "lucide-react";

interface DocumentType {
  _id: string;
  title: string;
  content: any;
  updatedAt?: string;
}

export default function DocumentEditorPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const editorRef = useRef<QuillEditorHandle | null>(null);
  const [doc, setDoc] = useState<DocumentType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState<any>([]);
  const [saved, setSaved] = useState(false);
  const [title, setTitle] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const autosaveTimer = useRef<number | null>(null);

  const fetchDocument = async () => {
    try {
      const res = await axiosInstance.get(`/documents/${id}`);
      setDoc(res.data);
      setContent(res.data.content);
      setTitle(res.data.title);
    } catch (err) {
      console.error("Failed to load document");
    } finally {
      setLoading(false);
    }
  };

  const saveDocument = async () => {
    if (!doc || !editorRef.current) return;
    setSaving(true);
    try {
      const fullDelta = editorRef.current.getContents();
      await axiosInstance.put(`/documents/${doc._id}`, {
        title: title,
        content: fullDelta,
      });
      setLastSavedAt(new Date());
    } catch (err) {
      console.error("Save failed", err);
      // optional: show UI error
    } finally {
      setSaving(false);
    }
  };

  const scheduleAutosave = () => {
    if (autosaveTimer.current) {
      window.clearTimeout(autosaveTimer.current);
    }
    autosaveTimer.current = window.setTimeout(() => {
      saveDocument();
      autosaveTimer.current = null;
    }, 2000);
  };

  const handleUserChange = (patchDelta: any) => {
    scheduleAutosave();
  };

  useEffect(() => {
    fetchDocument();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen w-screen bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading document...</p>
        </div>
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="flex flex-col justify-center items-center h-screen w-screen bg-white">
        <FileText className="w-16 h-16 text-gray-300 mb-4" />
        <p className="text-xl text-gray-600 mb-4">Document not found</p>
        <button
          onClick={() => router.push("/dashboard")}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Top Navigation Bar */}
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-3">
            <div className="flex items-center justify-between">
              {/* Left Section */}
              <div className="flex items-center gap-4 flex-1">
                <button
                  onClick={() => router.push("/dashboard")}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Back to Dashboard"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-linear-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>

                  {/* Editable Title */}
                  {isEditingTitle ? (
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      onBlur={() => {
                        setIsEditingTitle(false);
                        if (title !== doc.title) saveDocument();
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          setIsEditingTitle(false);
                          if (title !== doc.title) saveDocument();
                        }
                      }}
                      autoFocus
                      className="text-lg font-semibold text-gray-900 border-b-2 border-indigo-600 focus:outline-none px-1"
                    />
                  ) : (
                    <h1
                      onClick={() => setIsEditingTitle(true)}
                      className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-indigo-600 transition-colors"
                      title="Click to edit"
                    >
                      {title}
                    </h1>
                  )}
                </div>
              </div>

              {/* Center Section - Save Status */}
              <div className="flex items-center gap-2 text-sm">
                {saving ? (
                  <div className="flex items-center gap-2 text-gray-500">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </div>
                ) : saved ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <Check className="w-4 h-4" />
                    <span>Saved</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>Auto-save enabled</span>
                  </div>
                )}
              </div>

              {/* Right Section */}
              <div className="flex items-center gap-3 flex-1 justify-end">
                {/* Collaborators */}
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-pink-400 to-red-400 border-2 border-white flex items-center justify-center text-xs text-white font-semibold">
                      You
                    </div>
                  </div>
                  <button
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Share"
                  >
                    <Users className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                {/* Save Button */}
                <button
                  onClick={saveDocument}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg disabled:opacity-50 transition-all"
                >
                  <Save className="w-4 h-4" />
                  {saving ? "Saving..." : "Save"}
                </button>

                {/* More Options */}
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Editor Container */}
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[600px]">
            {/* Editor Toolbar Area */}
            <div className="border-b border-gray-200 p-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>
                  Last edited{" "}
                  {lastSavedAt
                    ? lastSavedAt.toLocaleTimeString()
                    : doc.updatedAt
                    ? new Date(doc.updatedAt).toLocaleString()
                    : "Not yet saved"}
                </span>
              </div>
            </div>

            {/* Quill Editor */}
            <div className="p-6">
              <QuillEditor
                ref={editorRef}
                initialContent={doc.content ?? { ops: [{ insert: "\n" }] }}
                onUserChange={handleUserChange}
              />
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-4">
              <span>Changes are auto-saved</span>
              <span>•</span>
              <button className="hover:text-indigo-600 transition-colors flex items-center gap-1">
                <Share2 className="w-4 h-4" />
                Share document
              </button>
            </div>
            <button className="hover:text-indigo-600 transition-colors flex items-center gap-1">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
