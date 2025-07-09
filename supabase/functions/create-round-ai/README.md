# Create Round AI Function

This Supabase Edge Function uses DeepSeek's vision model to analyze golf scorecard images and extract structured score data.

## Features

- Analyzes golf scorecard images using DeepSeek Vision API
- Extracts player information, course details, and hole-by-hole scores
- Validates extracted data against available players and courses
- Returns structured JSON data ready for database insertion

## Setup

### 1. Environment Variables

Set the following environment variable in your Supabase project:

```bash
DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

### 2. Deploy the Function

```bash
supabase functions deploy create-round-ai
```

## API Usage

### Request

**Endpoint:** `POST /functions/v1/create-round-ai`

**Headers:**
- `Authorization: Bearer <your_supabase_anon_key>`
- `Content-Type: application/json`

**Body:**
```json
{
  "players": [
    {
      "id": "player1",
      "first_name": "John",
      "last_name": "Doe",
      "birthdate": "1990-01-01",
      "nationality": "US",
      "auth_id": "auth_user_id",
      "p_and_p_handicap": 12
    }
  ],
  "courses": [
    {
      "id": "course1",
      "name": "Pine Valley Golf Club",
      "par": 72,
      "picture_url": "https://example.com/course.jpg",
      "course_holes": [
        {
          "course_id": "course1",
          "hole_number": 1,
          "par": 4,
          "stroke_index": 5,
          "distance": 380
        }
      ]
    }
  ],
  "imageBase64": "base64_encoded_image_data"
}
```

### Response

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "player_id": "player1",
    "course_id": "course1",
    "scores": [
      {
        "hole_number": 1,
        "gross_score": 4
      },
      {
        "hole_number": 2,
        "gross_score": 5
      }
    ],
    "total_score": 85,
    "date": "2024-01-15"
  },
  "analysis": "Raw analysis text from DeepSeek"
}
```

**Error Response (400/500):**
```json
{
  "error": "Error description",
  "details": "Additional error information"
}
```

## Testing Locally

1. Start Supabase locally:
   ```bash
   supabase start
   ```

2. Set the environment variable:
   ```bash
   export DEEPSEEK_API_KEY=your_api_key
   ```

3. Test with curl:
   ```bash
   curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/create-round-ai' \
     --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
     --header 'Content-Type: application/json' \
     --data '{
       "players": [
         {
           "id": "player1",
           "first_name": "John",
           "last_name": "Doe",
           "p_and_p_handicap": 12
         }
       ],
       "courses": [
         {
           "id": "course1",
           "name": "Pine Valley",
           "par": 72,
           "course_holes": [
             {"hole_number": 1, "par": 4},
             {"hole_number": 2, "par": 3}
           ]
         }
       ],
       "imageBase64": "base64_encoded_image_data"
     }'
   ```

## Image Requirements

- Format: JPEG, PNG, or WebP
- Size: Up to 20MB
- Content: Clear golf scorecard or score information
- Should include player name, course name, and hole scores

## Error Handling

The function handles various error scenarios:

1. **Missing Parameters**: Returns 400 if required parameters are missing
2. **Invalid API Key**: Returns 500 if DeepSeek API key is not configured
3. **API Errors**: Returns 500 with details if DeepSeek API fails
4. **Invalid Player/Course**: Returns 400 if extracted player/course doesn't match available options
5. **Parse Errors**: Returns 200 with error flag if JSON parsing fails

## Security

- Requires JWT authentication (configured in `supabase/config.toml`)
- Validates input data against available players and courses
- Uses environment variables for sensitive API keys
- Implements proper CORS headers 