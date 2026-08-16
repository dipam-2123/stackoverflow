const env = {
  appwrite: {
    endpoint: String(process.env.NEXT_PUBLIC_APPWRITE_HOST_URL),
    projectId: String(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID),
    apikey: String(process.env.APPWRITE_API_KEY),
    // Client-side API key (if needed for public operations)
    clientApiKey: String(process.env.NEXT_PUBLIC_APPWRITE_API_KEY || ""),
    databaseId: String(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID),
    questionCollectionId: String(process.env.NEXT_PUBLIC_APPWRITE_QUESTION_COLLECTION_ID),
    answerCollectionId: String(process.env.NEXT_PUBLIC_APPWRITE_ANSWER_COLLECTION_ID),
    commentCollectionId: String(process.env.NEXT_PUBLIC_APPWRITE_COMMENT_COLLECTION_ID),
    voteCollectionId: String(process.env.NEXT_PUBLIC_APPWRITE_VOTE_COLLECTION_ID),
    questionAttachmentBucketId: String(process.env.NEXT_PUBLIC_APPWRITE_QUESTION_ATTACHMENT_BUCKET_ID),
  },
}


export default env