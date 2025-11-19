export async function GET() {
  return Response.json({
    keyExists: !!process.env.GOOGLE_CLOUD_API_KEY,
    keyStart: process.env.GOOGLE_CLOUD_API_KEY?.slice(0, 10),
  });
}
