# MeetStake - AI-Powered Meeting Comprehension with Solana Staking

## Project Name: **MeetStake**

## One-Line Description:
**"AI-powered meeting comprehension platform that listens to live discussions via ElevenLabs, generates context-based quiz questions, and enables Solana-staked competitions where top 3 winners split the prize pool (70/20/10)."**

## Partner Tracks:
1. **ElevenLabs** - Audio transcription + AI question generation from meeting context
2. **Solana** - Staking mechanism + prize pool distribution

## Description (Under 300 words):

**MeetStake** transforms passive meeting attendance into active, incentivized learning through AI-powered comprehension testing and blockchain-based rewards.

**Problem It Solves:**
Meeting participants often zone out, multitask, or fail to retain critical information. There's no accountability for attention or comprehension. Traditional post-meeting quizzes are manually created and lack engagement. Additionally, there's no financial incentive to stay focused during meetings.

**How It Works:**

1. **Live Meeting Listening**: The host activates MeetStake during a meeting. The app uses device microphone to capture audio in real-time, processing speech through ElevenLabs Conversational AI.

2. **AI Context Extraction**: ElevenLabs AI transcribes the discussion, identifies key topics, important facts, decisions made, and action items. The AI understands context, not just keywords.

3. **Intelligent Quiz Generation**: After the meeting ends, the AI generates 5-10 multiple-choice questions based exclusively on what was discussed. Questions test comprehension of the actual meeting content.

4. **Solana Staking Pool**: The host stakes Solana (customizable amount, default 0.5 SOL) to create the game. Participants join via PIN and each stake Solana (customizable). All stakes combine into a prize pool.

5. **Competitive Quiz**: Participants answer timed questions on their devices. Faster correct answers earn more points (500-1000 points based on speed). A live leaderboard tracks rankings.

6. **Winner Distribution**: Top 3 scorers split the prize pool: 1st place gets 70%, 2nd place gets 20%, 3rd place gets 10%. Solana smart contract handles automatic payouts.

MeetStake gamifies attention, rewards comprehension, and makes meetings engaging through financial stakes and AI-powered assessment. Maximum 10 players per game ensures focused competition.

---

## Tech Stack:

**Frontend:**
- React 19
- TypeScript
- TanStack Start/Router
- Vite 7
- Tailwind CSS 4

**AI/Audio:**
- ElevenLabs Conversational AI SDK
- Web Audio API (microphone access)
- MediaRecorder API (audio capture)
- ElevenLabs Speech-to-Text
- ElevenLabs Context Analysis

**Blockchain:**
- Solana Web3.js
- Solana Wallet Adapter
- Prize pool management (70/20/10 split)

**State Management:**
- localStorage (game state + prize pools)
- sessionStorage (player identity)
- React hooks

**UI Components:**
- Radix UI
- Lucide React
- QRCode.react

---

## Key Features:
✅ Meeting audio recording
✅ ElevenLabs AI transcription
✅ Context-based question generation
✅ Solana staking (customizable amounts)
✅ Prize pool: 70% (1st), 20% (2nd), 10% (3rd)
✅ Real-time multiplayer (up to 10 players)
✅ PIN-based game joining
✅ Speed-based scoring
✅ Live leaderboard

---

## How to Use:

1. **Record Meeting**: Click "Record Meeting", set stake amount, start recording
2. **AI Processing**: Stop recording, AI transcribes and generates questions
3. **Share PIN**: Players join and stake Solana
4. **Play Quiz**: Answer questions, faster = more points
5. **Winners**: Top 3 split the prize pool automatically

---

## Files Structure:
- `src/lib/meeting-recorder.ts` - Audio recording
- `src/lib/elevenlabs-agent.ts` - AI transcription + question generation
- `src/lib/solana-staking.ts` - Prize pool management
- `src/routes/record-meeting.tsx` - Meeting recording UI
- `src/routes/create.tsx` - Manual quiz creation
- `src/routes/lobby.tsx` - Pre-game lobby
- `src/routes/play.tsx` - Live gameplay
- `src/routes/results.tsx` - Final leaderboard

---

## Environment Variables:
```
VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key
```

---

**Status**: ✅ Core Implementation Complete
**Tracks**: ElevenLabs + Solana
