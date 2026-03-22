import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
    const count = await prisma.sourceCodeEmbedding.count({
        where: { projectId: 'd02dfeaa-a820-4600-9d1b-9296cf3eeef0' }
    });
    console.log("FILES COUNT:", count);
}
main().catch(console.error).finally(() => prisma.$disconnect());
