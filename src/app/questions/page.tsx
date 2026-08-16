import { databases, users } from "@/models/server/config";
import { answerCollection, db, voteCollection, questionCollection } from "@/models/name";
import { Query } from "node-appwrite";
import React from "react";
import Link from "next/link";
import ShimmerButton from "@/components/magicui/shimmer-button";
import QuestionCard from "@/components/QuestionCard";
import { UserPrefs } from "@/store/Auth";
import Pagination from "@/components/Pagination";
import Search from "./Search";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

const Page = async ({
    searchParams,
}: {
    searchParams: { page?: string; tag?: string; search?: string };
}) => {
    searchParams.page ||= "1";

    try {
        // First, let's check if the database and collection exist
        console.log("Database ID:", db);
        console.log("Question Collection ID:", questionCollection);
        
        const queries = [
            Query.orderDesc("$createdAt"),
            Query.offset((+searchParams.page - 1) * 25),
            Query.limit(25),
        ];

        if (searchParams.tag) queries.push(Query.equal("tags", searchParams.tag));
        if (searchParams.search)
            queries.push(
                Query.or([
                    Query.search("title", searchParams.search),
                    Query.search("content", searchParams.search),
                ])
            );

        console.log("Fetching questions with queries:", queries);
        const questions = await databases.listDocuments(db, questionCollection, queries);
        console.log("Questions fetched:", questions.total, "questions found");
        console.log("Questions documents:", questions.documents.length);
        console.log("First question sample:", questions.documents[0]);

        console.log("Processing questions...");
        questions.documents = await Promise.all(
            questions.documents.map(async ques => {
                try {
                    console.log("Processing question:", ques.$id, ques.title);
                    const [author, answers, votes] = await Promise.all([
                        users.get<UserPrefs>(ques.authorId),
                        databases.listDocuments(db, answerCollection, [
                            Query.equal("questionId", ques.$id),
                            Query.limit(1), // for optimization
                        ]),
                        databases.listDocuments(db, voteCollection, [
                            Query.equal("type", "question"),
                            Query.equal("typeId", ques.$id),
                            Query.limit(1), // for optimization
                        ]),
                    ]);

                    const processedQuestion = {
                        ...ques,
                        totalAnswers: answers.total,
                        totalVotes: votes.total,
                        author: {
                            $id: author.$id,
                            reputation: author.prefs.reputation,
                            name: author.name,
                        },
                    };
                    console.log("Processed question:", (processedQuestion as any).title);
                    return processedQuestion;
                } catch (error) {
                    console.error('Error processing question:', error);
                    return ques;
                }
            })
        );
        console.log("Finished processing questions. Total processed:", questions.documents.length);

        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 pt-20 pb-20">
                    <div className="container mx-auto px-4 py-8">
                        <div className="mb-10 flex items-center justify-between">
                            <h1 className="text-3xl font-bold">All Questions</h1>
                            <Link href="/questions/ask">
                                <ShimmerButton className="shadow-2xl">
                                    <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                                        Ask a question
                                    </span>
                                </ShimmerButton>
                            </Link>
                        </div>
                        <div className="mb-4">
                            <Search />
                        </div>
                        <div className="mb-4">
                            <p>{questions.total} questions</p>
                        </div>
                        <div className="mb-4 max-w-3xl space-y-6">
                            {questions.documents.map(ques => (
                                <QuestionCard key={ques.$id} ques={ques} />
                            ))}
                        </div>
                        <Pagination total={questions.total} limit={25} />
                    </div>
                </main>
                <Footer />
            </div>
        );
    } catch (error) {
        console.error('Questions page error:', error);
        console.error('Error details:', {
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined
        });
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 pt-20 pb-20">
                    <div className="container mx-auto px-4 py-8">
                        <div className="mb-10 flex items-center justify-between">
                            <h1 className="text-3xl font-bold">All Questions</h1>
                            <Link href="/questions/ask">
                                <ShimmerButton className="shadow-2xl">
                                    <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                                        Ask a question
                                    </span>
                                </ShimmerButton>
                            </Link>
                        </div>
                        <div className="mb-4">
                            <Search />
                        </div>
                        <div className="flex items-center justify-center min-h-[400px]">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold mb-4 text-white">Error Loading Questions</h2>
                                <p className="text-gray-400 mb-6">There was an error loading questions</p>
                                <div className="space-y-2 text-sm text-gray-500">
                                    <p>• Error: {error instanceof Error ? error.message : String(error)}</p>
                                    <p>• Check your Appwrite configuration</p>
                                    <p>• Verify database and collection IDs</p>
                                    <p>• Ensure API keys are correct</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }
};

export default Page;
