# Noor Al-Huda

Noor Al-Huda is an Islamic knowledge platform with Prophet stories, Quran and science content, an Islamic library, and an AI chat assistant for Quranic and Sunnah-based guidance.

The app is built as a modern React experience with responsive layouts, motion details, Firebase integration, and Gemini-powered AI features.

## Live Demo

Add your deployed project URL in the GitHub repository website field after deployment.

## Highlights

- Prophet stories with dedicated detail pages.
- Quranic AI chat assistant named Noor.
- Voice input through the browser Speech Recognition API.
- Optional text-to-speech responses using Gemini TTS.
- Multi-language answer support for English, Arabic, Urdu, French, and Spanish.
- Science and Quran section for educational content.
- Islamic books and resources section.
- Firebase-ready authentication and app configuration.
- Smooth UI motion using `motion`, custom reveal text, scroll progress, and magnetic buttons.

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Home page with feature cards and primary calls to action |
| `/stories` | Prophet stories overview |
| `/stories/:id` | Individual story detail page |
| `/chat` | Noor AI chat assistant |
| `/science` | Quran and science learning section |
| `/books` | Islamic library/resources |
| `/login` | Authentication entry |

## Tech Stack

| Layer | Tools |
| --- | --- |
| Frontend | React 19, TypeScript, Vite |
| Styling | Tailwind CSS, custom CSS, responsive layout |
| Motion | Motion for React, Lenis, custom reveal components |
| AI | Google Gemini API, Gemini TTS |
| Auth/Data | Firebase, Firestore rules |
| UI | Lucide icons, custom layout components |

## Quick Start

```bash
git clone https://github.com/AHMEDALIGHORI/Noor-AL-Huda.git
cd Noor-AL-Huda
npm install
npm run dev
```

Open:

```text
http://127.0.0.1:3000/
```

## Environment Variables

Create a local `.env` file from `.env.example` if present, then add the required keys for AI and Firebase features.

```env
GEMINI_API_KEY=your_gemini_api_key
```

Firebase configuration is handled in `src/firebase.ts` and related project config files. Keep real keys and private credentials out of commits.

## Available Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Project Structure

```text
.
+-- src/
|   +-- components/       Shared UI, layout, navigation, motion helpers
|   +-- pages/            Home, Stories, Chat, Science, Books, Login
|   +-- services/         Gemini AI and TTS service layer
|   +-- AuthContext.tsx   Authentication context
|   +-- firebase.ts       Firebase setup
|   +-- App.tsx           Route definitions
+-- firestore.rules       Firestore security rules
+-- firebase*.json        Firebase app configuration
+-- metadata.json         App name, description, and permissions
+-- package.json
```

## Responsible Use

Noor AI is an educational assistant. Islamic answers should be reviewed against trusted scholars, authentic sources, and local context. Do not treat generated responses as a final religious ruling.

## Suggested GitHub Topics

```text
react typescript vite islamic-app quran chatbot gemini-ai firebase tailwindcss ai-assistant education
```

## License

This project is available under the MIT License. See [LICENSE](LICENSE).
