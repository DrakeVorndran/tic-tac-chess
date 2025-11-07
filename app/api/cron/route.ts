import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const delCount = await prisma.room.deleteMany({
    where: {
      updatedAt: {
        lt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      },
    },
  });
  return Response.json({ delCount });
}
