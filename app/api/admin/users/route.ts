import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser, hashPassword } from "@/lib/auth";

export async function GET() {
    const session = await getSessionUser();
    if (!session) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const users = await prisma.adminUser.findMany({
        select: { id: true, username: true, createdAt: true },
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(users);
}

export async function POST(request: Request) {
    const session = await getSessionUser();
    if (!session) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    try {
        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json(
                { error: "Username and password are required" },
                { status: 400 }
            );
        }

        if (username.length < 3) {
            return NextResponse.json(
                { error: "Username must be at least 3 characters" },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: "Password must be at least 6 characters" },
                { status: 400 }
            );
        }

        const existing = await prisma.adminUser.findUnique({
            where: { username },
        });

        if (existing) {
            return NextResponse.json(
                { error: "Username already exists" },
                { status: 409 }
            );
        }

        const hashedPassword = await hashPassword(password);
        const user = await prisma.adminUser.create({
            data: { username, password: hashedPassword },
            select: { id: true, username: true, createdAt: true },
        });

        return NextResponse.json(user, { status: 201 });
    } catch (error) {
        console.error("Create user error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
