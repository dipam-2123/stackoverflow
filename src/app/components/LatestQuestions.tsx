import QuestionCard from "@/components/QuestionCard";
import { answerCollection, db, questionCollection, voteCollection } from "@/models/name";
import { databases, users } from "@/models/server/config";
import { UserPrefs } from "@/store/Auth";
import { Query } from "node-appwrite";
import React from "react";

const LatestQuestions = async () => {
    try {
        const questions = await databases.listDocuments(db, questionCollection, [
            Query.limit(5),
            Query.orderDesc("$createdAt"),
        ]);
        console.log("Fetched Questions:", questions);

        questions.documents = await Promise.all(
            questions.documents.map(async ques => {
                try {
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

                    return {
                        ...ques,
                        totalAnswers: answers.total,
                        totalVotes: votes.total,
                        author: {
                            $id: author.$id,
                            reputation: author.prefs?.reputation ?? 0,
                            name: author.name,
                        },
                    };
                } catch (error) {
                    console.error('Error processing question:', error);
                    return ques;
                }
            })
        );

        console.log("Latest question")
        console.log(questions)
        return (
            <div className="space-y-6">
                {questions.documents.map(question => (
                    <QuestionCard key={question.$id} ques={question} />
                ))}
            </div>
        );
    } catch (error) {
        console.error('LatestQuestions error:', error);
        return (
            <div className="flex items-center justify-center min-h-[200px] p-8">
                <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2 text-white">No Questions Available</h3>
                    <p className="text-gray-400 text-sm">Connect to Appwrite to see questions</p>
                </div>
            </div>
        );
    }
};

export default LatestQuestions;
