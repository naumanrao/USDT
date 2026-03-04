import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSessionUser();
    if (!session) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id } = await params;

    // Prevent deleting yourself
    if (id === session.userId) {
        return NextResponse.json(
            { error: "You cannot delete your own account" },
            { status: 400 }
        );
    }

    try {
        await prisma.adminUser.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
}
