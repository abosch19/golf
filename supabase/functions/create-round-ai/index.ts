// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

interface Player {
	id: string;
	first_name: string;
	last_name: string;
}

interface Course {
	id: string;
	name: string;
}

const corsHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Headers":
		"authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
	try {
		// Handle CORS
		if (req.method === "OPTIONS") {
			return new Response("ok", { headers: corsHeaders });
		}

		if (req.method !== "POST") {
			return new Response(JSON.stringify({ error: "Method not allowed" }), {
				status: 405,
				headers: {
					"Content-Type": "application/json",
					...corsHeaders,
				},
			});
		}

		const { players, courses, imageBase64 } = await req.json();

		if (!players || !courses || !imageBase64) {
			return new Response(
				JSON.stringify({
					error:
						"Missing required parameters: players, courses, and imageBase64 are required",
				}),
				{
					status: 400,
					headers: {
						"Content-Type": "application/json",
						...corsHeaders,
					},
				},
			);
		}

		// Create context for DeepSeek with available players and courses
		const playersContext = players
			.map((p: Player) => `${p.first_name} ${p.last_name} (ID: ${p.id})`)
			.join(", ");

		const coursesContext = courses
			.map((c: Course) => `${c.name} (ID: ${c.id})`)
			.join(", ");

		// Prepare the prompt for DeepSeek
		const prompt = `You are a golf score analyzer. I will provide you with an image of a golf scorecard or score information.

Available Players: ${playersContext}

Available Courses: ${coursesContext}

Please analyze the image and extract the following information in JSON format:
1. Identify which player from the available list is playing (use the exact player_id) if no player is matched, return null.
2. Identify which course from the available list is being played (use the exact course_id) if no course is matched, return null.
3. Extract the score for each hole (hole_number and gross_score), usually its played 18 holes and score cards could be representing score in 2 rows.
4. Total gross score for each players must be the sum of all 18 holes.
5. If a date is visible, include it

Return ONLY a valid JSON object with this structure:
{
  "course_id": "course_id_from_list", 
  "played_at": "2024-01-15" (optional)
  "round_scores": [
    {
      "player_id": "player_id_from_list",
      "player_name": "A.Bosch" (player first character and last name, if its not readable, use the first character of the first name and the last name),
      "gross_score": 4 (total score),
      "round_score_holes": [
        {"hole_number": 1, "gross_score": 4},
        {"hole_number": 2, "gross_score": 5}
      ]
    },
    ...
  ],
}`;

		const openAIApiKey = Deno.env.get("OPENAI_API_KEY");
		if (!openAIApiKey) {
			return new Response(
				JSON.stringify({ error: "OpenAI API key not configured" }),
				{
					status: 500,
					headers: {
						"Content-Type": "application/json",
						...corsHeaders,
					},
				},
			);
		}

		const openAIResponse = await fetch(
			"https://api.openai.com/v1/chat/completions",
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${openAIApiKey}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					model: "gpt-4.1",
					messages: [
						{
							role: "user",
							content: [
								{
									type: "text",
									text: prompt,
								},
								{
									type: "image_url",
									image_url: {
										url: imageBase64,
									},
								},
							],
						},
					],
					max_tokens: 2000,
					temperature: 0.1,
				}),
			},
		);

		if (!openAIResponse.ok) {
			const errorText = await openAIResponse.text();
			return new Response(
				JSON.stringify({
					error: "DeepSeek API error",
					details: errorText,
				}),
				{
					status: 500,
					headers: {
						"Content-Type": "application/json",
						...corsHeaders,
					},
				},
			);
		}

		const openAIData: OpenAIResponse = await openAIResponse.json();
		const analysisResult = openAIData.choices[0]?.message?.content;

		if (!analysisResult) {
			return new Response(
				JSON.stringify({ error: "No analysis result from DeepSeek" }),
				{
					status: 500,
					headers: {
						"Content-Type": "application/json",
						...corsHeaders,
					},
				},
			);
		}

		const cleanText = analysisResult.replace(/```json|```/g, "").trim();
		const parsedJson = JSON.parse(cleanText);

		return new Response(JSON.stringify(parsedJson), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
				...corsHeaders,
			},
		});
	} catch (error) {
		console.error(error);
		return new Response(JSON.stringify({ error: "Internal server error" }), {
			status: 500,
			headers: {
				"Content-Type": "application/json",
				...corsHeaders,
			},
		});
	}
});
