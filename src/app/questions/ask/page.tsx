import React from "react";
import Link from "next/link";
import QuestionForm from "@/components/QuestionForm";

export default function AskPage() {
  return (
    <div className="container mx-auto px-4 pb-20 pt-36">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Ask a Question</h1>
          <p className="text-gray-400">Share your knowledge and help others</p>
        </div>
        <Link 
          href="/questions"
          className="inline-flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          Back to Questions
        </Link>
      </div>
      
      <div className="max-w-4xl">
        <QuestionForm />
      </div>
    </div>
  );
} 