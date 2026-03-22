import "dotenv/config";
import { db } from "./src/server/db";

async function count() {
  const count = await db.sourceCodeEmbedding.count();
  console.log("SourceCodeEmbedding count:", count);
  // Also count by project
  const projectsCount = await db.sourceCodeEmbedding.groupBy({
    by: ['projectId'],
    _count: {
      projectId: true
    }
  });
  console.log("Projects break down:", projectsCount);
  const projects = await db.project.findMany();
  console.log("Projects in db:", projects.map(p => ({id: p.id, name: p.name})));
}

count().catch(console.error);
