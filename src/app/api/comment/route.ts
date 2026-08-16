import { commentCollection, db } from "@/models/name";
import { databases, users } from "@/models/server/config";
import { NextRequest, NextResponse } from "next/server";
import { ID } from "node-appwrite";
import { UserPrefs } from "@/store/Auth";

export async function POST(request: NextRequest) {
    try {
        const { content, authorId, type, typeId } = await request.json();

        const response = await databases.createDocument(db, commentCollection, ID.unique(), {
            content: content,
            authorId: authorId,
            type: type,
            typeId: typeId,
        });

        // Increase author reputation
        const prefs = await users.getPrefs<UserPrefs>(authorId);
        await users.updatePrefs(authorId, {
            reputation: (Number(prefs.reputation) || 0) + 1,
        });

        return NextResponse.json(response, {
            status: 201,
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                error: error?.message || "Error creating comment",
            },
            {
                status: error?.status || error?.code || 500,
            }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { commentId } = await request.json();

        const comment = await databases.getDocument(db, commentCollection, commentId);

        const response = await databases.deleteDocument(db, commentCollection, commentId);

        // Decrease the reputation
        const prefs = await users.getPrefs<UserPrefs>(comment.authorId);
        await users.updatePrefs(comment.authorId, {
            reputation: (Number(prefs.reputation) || 0) - 1,
        });

        return NextResponse.json(
            { data: response },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            {
                message: error?.message || "Error deleting the comment",
            },
            {
                status: error?.status || error?.code || 500,
            }
        );
    }
} 