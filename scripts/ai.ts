interface OpenAIResponse {
	choices: Array<{
		message: {
			content: string;
		};
	}>;
}

async function main() {
	try {
		// Create context for OpenAI with available players and courses
		const playersContext = [
			{
				id: "29868cb3-5745-4461-aca7-574df1d578de",
				first_name: "Jaume",
				last_name: "Cabecerans",
			},
			{
				id: "c6661402-e579-4e5b-b7a3-88cdbe1c10fa",
				first_name: "Sergi",
				last_name: "Martínez",
			},
			{
				id: "91278d7c-c2ff-4149-adac-dd98acce3946",
				first_name: "Alex",
				last_name: "Bosch",
			},
			{
				id: "3b180414-1460-49ec-a1f1-cc54fc66ff50",
				first_name: "Jorge",
				last_name: "Giner",
			},
			{
				id: "052720a8-0e66-4a25-95fa-121af045fcae",
				first_name: "Alex",
				last_name: "Martinez-Sabadell",
			},
			{
				id: "06f4bb22-1f06-41f4-b0ec-955ae51d30a9",
				first_name: "Santi",
				last_name: "Vallvé",
			},
			{
				id: "8ee835cc-d061-4305-a0da-9b52c3744e53",
				first_name: "Alex",
				last_name: "Trias",
			},
		];

		const coursesContext = [
			{
				id: "6a9fec0e-e318-418f-b430-2d23d3c5c3e8",
				name: "Pitch & Putt Gualta Par 3",
			},
			{
				id: "5efee10d-aa1c-4294-adcd-7c2134f4b77f",
				name: "ROC 3 | Golf Pitch & Putt",
			},
		];

		// Prepare the prompt for OpenAI
		const prompt = `You are a golf score analyzer. I will provide you with an image of a golf scorecard or score information.

Available Players: ${JSON.stringify(playersContext, null, 2)}

Available Courses: ${JSON.stringify(coursesContext, null, 2)}

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
      "player_name": "A.B." (player first and last name characters),
      "gross_score": 4 (total score),
      "round_score_holes": [
        {"hole_number": 1, "gross_score": 4},
        {"hole_number": 2, "gross_score": 5}
      ]
    },
    ...
  ],
}`;

		const openAIApiKey = process.env.OPENAI_API_KEY;

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
										url: "https://www.golf.com/wp-content/uploads/2024/05/2024-05-14-10-00-00-1.jpg",
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
			console.error("OpenAI API Error:", errorText);
			return;
		}

		const openAIData: OpenAIResponse = await openAIResponse.json();
		const analysisResult = openAIData.choices[0]?.message?.content;

		if (!analysisResult) {
			console.error("No analysis result from OpenAI");
			return;
		}

		console.log("--------------------------------");
		// console.log(analysisResult);

		// Try to parse the JSON result
		try {
			const cleanText = analysisResult.replace(/```json|```/g, "").trim();
			console.log(cleanText);
			// const parsedJson = JSON.parse(cleanText);
			// console.log(JSON.stringify(parsedJson, null, 2));
		} catch (parseError) {
			console.error("Failed to parse JSON result:", parseError);
		}
	} catch (error) {
		console.error("Error:", error);
	}
}

main();
