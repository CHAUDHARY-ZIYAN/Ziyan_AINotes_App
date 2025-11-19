export async function enhanceText(input: string) {
  const res = await fetch("/api/ai/enhance", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: input }),
  });

  const data = await res.json();
  return data.enhanced;
}
