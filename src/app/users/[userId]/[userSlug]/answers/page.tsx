import Pagination from "@/components/Pagination";
import { MarkdownPreview } from "@/components/RTE";
import { answerCollection, db, questionCollection } from "@/models/name";
import { databases } from "@/models/server/config";
import slugify from "@/utils/slugify";
import Link from "next/link";
import { Query } from "node-appwrite";
import React from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

const Page = async ({
    params,
    searchParams,
}: {
    params: { userId: string; userSlug: string };
    searchParams: { page?: string };
}) => {
    searchParams.page ||= "1";

    const queries = [
        Query.equal("authorId", params.userId),
        Query.orderDesc("$createdAt"),
        Query.offset((+searchParams.page - 1) * 25),
        Query.limit(25),
    ];

    const answers = await databases.listDocuments(db, answerCollection, queries);

    answers.documents = await Promise.all(
        answers.documents.map(async ans => {
            const question = await databases.getDocument(db, questionCollection, ans.questionId, [
                Query.select(["title"]),
            ]);
            return { ...ans, question };
        })
    );

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 pt-20 pb-20">
                <div className="container mx-auto px-4 py-8">
                    <div className="mb-4">
                        <p>{answers.total} answers</p>
                    </div>
                    <div className="mb-4 max-w-3xl space-y-6">
                        {answers.documents.map(ans => (
                            <div key={ans.$id}>
                                <div className="max-h-40 overflow-auto">
                                    <div className="rounded-lg p-4">
                                    <MarkdownPreview source={ans.content} />
                                </div>
                                </div>
                                <Link
                                    href={`/questions/${ans.questionId}/${slugify(ans.question.title)}`}
                                    className="mt-3 inline-block shrink-0 rounded bg-orange-500 px-4 py-2 font-bold text-white hover:bg-orange-600"
                                >
                                    Question
                                </Link>
                            </div>
                        ))}
                    </div>
                    <Pagination total={answers.total} limit={25} />
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Page;
