# QuizBlast - ElevenLabs Integration Setup

## Phase 1 Complete ✅

### What's Been Implemented:

1. **ElevenLabs SDK Integration**
   - Installed `@elevenlabs/elevenlabs-js` package
   - Created service module at `src/lib/elevenlabs-agent.ts`

2. **AI Question Generation**
   - Added AI generation mode to create page
   - Toggle between Manual Entry and AI Generate
   - Generate 3-10 questions on any topic
   - Mock responses for testing (replace with actual API when agent is configured)

3. **10-Player Limit**
   - Maximum 10 players can join a game
   - Rejoining players don't count against limit
   - Clear error message when game is full

4. **Environment Configuration**
   - `.env` file for API key storage
   - `.env.example` template

---

## Setup Instructions

### 1. Add Your ElevenLabs API Key

Edit the `.env` file and add your API key:

```bash
VITE_ELEVENLABS_API_KEY=your_actual_api_key_here
```

### 2. Configure ElevenLabs Conversational AI Agent

To use real AI generation (not mock data):

1. Go to [ElevenLabs Dashboard](https://elevenlabs.io)
2. Create a Conversational AI Agent
3. Configure the agent with this system prompt:

```
You are a quiz question generator. When asked to generate quiz questions, respond with ONLY valid JSON in this format:

{
  "questions": [
    {
      "prompt": "Question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "timeLimit": 15
    }
  ]
}

Requirements:
- Each question must have exactly 4 options
- correctIndex is 0-3 (index of correct answer)
- timeLimit is 10-30 seconds
- Make questions engaging and educational
```

4. Get your Agent ID from the dashboard
5. Update `src/lib/elevenlabs-agent.ts` to use the Conversational AI endpoint with your Agent ID

### 3. Run the Application

```bash
npm run dev
```

---

## How to Use

### Creating a Quiz with AI:

1. Click "Create a Game" from home page
2. Enter a game title
3. Click "🤖 AI Generate" tab
4. Enter a topic (e.g., "Science", "History", "Technology")
5. Select number of questions (3-10)
6. Click "✨ Generate Questions"
7. Review and edit generated questions if needed
8. Click "Create Game & Get PIN"

### Testing PIN Codes:

- Demo PINs work: `123456` and `654321`
- Custom game PINs are 6-digit random numbers
- Players can join using the PIN on the join page

### Player Limit:

- Maximum 10 players per game
- Players see "Game is full" error if limit reached
- Rejoining players don't count against limit

---

## Next Steps (Future Phases)

- Replace mock AI responses with actual ElevenLabs Conversational AI API calls
- Add voice input for answering questions (optional)
- Add difficulty levels for AI generation
- Add category selection for AI generation
- Improve error handling and loading states

---

## Testing

### Test AI Generation (Mock Mode):
1. Create game with AI mode
2. Try topics: "science", "history", "technology"
3. Verify questions are generated
4. Switch to manual mode to edit

### Test Player Limit:
1. Create a game
2. Open 10+ browser tabs
3. Try joining with different nicknames
4. 11th player should see "Game is full" error

### Test PIN System:
1. Create custom game
2. Note the 6-digit PIN
3. Join from another tab using that PIN
4. Verify lobby shows all players
