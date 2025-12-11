export async function queryIntelligence(userPrompt: string) {
  try {
    const res = await fetch("/api/gemini", {
      method: "POST",
      body: JSON.stringify({ prompt: userPrompt }),
    });
    return (await res.json()).text;
  }
  catch (error) {
    console.error("Error querying Gemini API:", error);
    return "Error connecting to AI service.";
  } 
}