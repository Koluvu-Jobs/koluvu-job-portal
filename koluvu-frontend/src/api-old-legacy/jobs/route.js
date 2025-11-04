// src/app/api/jobs/route.js

let jobs = []; // In-memory storage

export async function GET(request) {
  return new Response(JSON.stringify(jobs), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request) {
  try {
    const job = await request.json();
    job.id = Date.now(); // Simple unique id
    job.status = job.status || "Active";
    job.postedDate = new Date().toLocaleDateString();
    jobs.push(job);
    return new Response(JSON.stringify(job), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Invalid job data" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}
