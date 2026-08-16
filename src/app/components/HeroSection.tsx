import React from "react";
import { HeroParallax } from "@/components/ui/hero-parallax";
import { databases } from "@/models/server/config";
import { db, questionAttachmentBucket, questionCollection } from "@/models/name";
import { Query } from "node-appwrite";
import slugify from "@/utils/slugify";
import { storage } from "@/models/client/config";
import HeroSectionHeader from "./HeroSectionHeader";

export default async function HeroSection() {
    try {
        const questions = await databases.listDocuments(db, questionCollection, [
            Query.orderDesc("$createdAt"),
            Query.limit(15),
        ]);

        return (
            <HeroParallax
                header={<HeroSectionHeader />}
                products={questions.documents.map(q => ({
                    title: q.title,
                    link: `/questions/${q.$id}/${slugify(q.title)}`,
                    thumbnail: q.attachmentId ? storage.getFileView(questionAttachmentBucket, q.attachmentId).href : '',
                }))}
            />
        );
    } catch (error) {
        console.error('HeroSection error:', error);
        return (
            <div className="flex items-center justify-center min-h-[400px] p-8">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4 text-white">Welcome to StackOverflow Clone</h2>
                    <p className="text-gray-400 mb-6">Connect to Appwrite to see questions and answers</p>
                    <div className="space-y-2 text-sm text-gray-500">
                        <p>• Check your Appwrite configuration</p>
                        <p>• Verify database and collection IDs</p>
                        <p>• Ensure API keys are correct</p>
                    </div>
                </div>
            </div>
        );
    }
}
