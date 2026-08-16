"use client";
import React, { useState } from "react";
import RTE from "@/components/RTE";

export default function TestRTEPage() {
  const [content, setContent] = useState("");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-white">RTE Test Page</h1>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Rich Text Editor</h2>
          <RTE 
            value={content} 
            onChange={(value) => setContent(value || "")}
            placeholder="Start typing your content here..."
            height={300}
          />
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Preview</h2>
          <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 min-h-[100px]">
            {content ? (
              <div className="prose prose-invert max-w-none">
                <pre className="whitespace-pre-wrap text-white">{content}</pre>
              </div>
            ) : (
              <p className="text-gray-400">No content yet...</p>
            )}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Raw Content</h2>
          <div className="bg-gray-800 border border-gray-600 rounded-lg p-4">
            <code className="text-sm text-gray-300">{content || "Empty"}</code>
          </div>
        </div>
      </div>
    </div>
  );
} 