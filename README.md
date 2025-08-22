# TTS Application with Dhruva API

A modern text-to-speech application built with Next.js, TypeScript, shadcn/ui, and the Dhruva TTS API.

## Features

- 🎙️ Convert text to speech using the Dhruva TTS API
- 🌍 Support for multiple Indian languages (Hindi, Bengali, Tamil, Telugu, etc.)
- 👥 Male and female voice options
- 🎵 Built-in audio player with play/pause/stop controls
- 📱 Responsive design with shadcn/ui components
- ⚡ Fast API responses with Next.js API routes

## Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **shadcn/ui** - Modern UI components
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons
- **Dhruva TTS API** - AI-powered text-to-speech conversion

## Getting Started

1. **Install dependencies:**
```bash
npm install
```

2. **Run the development server:**
```bash
npm run dev
```

3. **Open your browser:**
Visit [http://localhost:3000](http://localhost:3000) to see the application.

## Usage

1. Enter text in the textarea
2. Select your preferred language
3. Choose voice gender (male/female)
4. Click "Generate Speech"
5. Use the audio controls to play the generated speech

## API Integration

The application uses the Dhruva TTS API from Bhashini for speech generation. The API endpoint is integrated via Next.js API routes for secure server-side communication.

## Project Structure

```
src/
├── app/
│   ├── api/tts/          # TTS API route
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/
│   ├── ui/               # shadcn/ui components
│   └── TTSInterface.tsx  # Main TTS component
└── lib/
    └── utils.ts          # Utility functions
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the MIT License.
