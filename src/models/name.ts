import env from "@/app/env";

export const db = env.appwrite.databaseId
export const questionCollection = env.appwrite.questionCollectionId
export const answerCollection = env.appwrite.answerCollectionId
export const commentCollection = env.appwrite.commentCollectionId
export const voteCollection = env.appwrite.voteCollectionId
export const questionAttachmentBucket = env.appwrite.questionAttachmentBucketId