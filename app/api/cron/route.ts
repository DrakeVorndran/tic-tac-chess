import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  prisma.room.deleteMany({
    where: {
      updatedAt: {
        lt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      },
    },
  });
  return Response.json({ status: "Cleanup initiated" });
}
