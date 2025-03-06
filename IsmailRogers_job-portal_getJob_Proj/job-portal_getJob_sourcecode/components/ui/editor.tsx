"use client";

import dynamic from "next/dynamic";

import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface EditorProps {
  onChangeAction: (value: string) => void;
  value: string;
}

export const Editor = ({ onChangeAction, value }: EditorProps) => {
  return (
    <div className="bg-white">
      <ReactQuill value={value} onChange={onChangeAction} theme="snow" />
    </div>
  );
};
