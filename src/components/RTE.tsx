"use client";

import dynamic from "next/dynamic";

// Dynamic import to avoid SSR issues
const RTE = dynamic(
    () => import("@uiw/react-md-editor").then(mod => mod.default),
    { 
        ssr: false,
        loading: () => (
            <div className="w-full h-32 bg-gray-800 border border-gray-600 rounded-lg p-4 animate-pulse">
                <div className="h-4 bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            </div>
        )
    }
);

interface RTEProps {
    value?: string;
    onChange?: (value?: string) => void;
    placeholder?: string;
    height?: number;
}

const RichTextEditor = ({ value, onChange, placeholder, height = 200 }: RTEProps) => {
    return (
        <div data-color-mode="dark">
            <RTE
                value={value}
                onChange={onChange}
                height={height}
                preview="live"
                hideToolbar={false}
            />
        </div>
    );
};

// Export for markdown preview
export const MarkdownPreview = dynamic(
    () => import("@uiw/react-md-editor").then(mod => mod.default.Markdown),
    { ssr: false }
);

export default RichTextEditor;
