"use client";

import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

export type Delta = any;
export type QuillEditorHandle = {
  getContents: () => Delta | null;
  setContents: (delta: Delta) => void;
  focus: () => void;
};

type Props = {
  initialContent?: Delta;
  onUserChange?: (patchDelta: Delta) => void;
  placeholder?: string;
  readOnly?: boolean;
};

const QuillEditor = forwardRef<QuillEditorHandle, Props>(
  (
    {
      initialContent = { ops: [] },
      onUserChange,
      placeholder = "Start writing...",
      readOnly = false,
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const quillRef = useRef<Quill | null>(null);

    useImperativeHandle(
      ref,
      () => ({
        getContents: () => quillRef.current?.getContents() ?? null,
        setContents: (delta: Delta) => quillRef.current?.setContents(delta),
        focus: () => quillRef.current?.focus(),
      }),
      []
    );

    useEffect(() => {
      if (!containerRef.current) return;
      if (quillRef.current) return;

      const q = new Quill(containerRef.current, {
      theme: "snow",
      modules: {
        toolbar: true,
      },
    });
      try {
        q.setContents(initialContent);
      } catch (e) {
        q.setContents({ ops: [{ insert: "\n" }] } as Delta);
      }

      const handler = (delta: any, oldDelta: any, source: string) => {
        if (source === "user") {
          onUserChange?.(delta);
        }
      };

      q.on("text-change", handler);

      quillRef.current = q;

      return () => {
        q.off("text-change", handler);
        quillRef.current = null;
      };
    }, []);

    return (
      <div style={{ background: "white", color: "black" }}>
        <div ref={containerRef} style={{ minHeight: 400 }} />
      </div>
    );
  }
);

QuillEditor.displayName = "QuillEditor";
export default QuillEditor;
