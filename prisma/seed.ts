import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ADMIN_SECRET = process.env.ADMIN_SECRET || "default-admin-secret-change-me";

async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + ADMIN_SECRET);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
}

async function main() {
    const existing = await prisma.adminUser.findUnique({
        where: { username: "ammar123" },
    });

    if (!existing) {
        const hashedPassword = await hashPassword("ammar123");
        await prisma.adminUser.create({
            data: {
                username: "ammar123",
                password: hashedPassword,
            },
        });
        console.log("✅ Default admin user 'ammar123' created.");
    } else {
        console.log("ℹ️  Admin user 'ammar123' already exists, skipping.");
    }
}

main()
    .catch((e) => {
        console.error("Seed error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
