## Qwillo Meeting Room Components

This package contains all the necessary components for the Qwillo meeting room interface.

### File Structure

```
src/
  components/
    - GlassmorphicButton.tsx
    - MeetingHeader.tsx
    - MeetingSummary.tsx
    - QwilloAIChat.tsx
    - QwilloLogo.tsx
    - SubmissionComplete.tsx
  features/
    meeting/
      - MeetingRoom.tsx
      - ThreePersonMeeting.tsx (optional alternative layout)
  styles/
    - meeting.css
```

### Dependencies

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "lucide-react": "^0.344.0",
    "gsap": "^3.12.5"
  }
}
```

### Required Tailwind Configuration

The components use Tailwind CSS. Add these custom utilities to your Tailwind config:

```js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Add these custom styles to your CSS:

```css
@layer utilities {
  .glassmorphic {
    @apply bg-white/10 backdrop-blur-md border border-white/20;
  }

  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    @apply bg-transparent;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    @apply bg-white/20 rounded-full hover:bg-white/30 transition-colors;
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 0.2;
  }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out forwards;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

### Usage in Next.js

1. Add the `'use client'` directive at the top of each component file
2. Update image handling to use Next.js Image component
3. Move components to appropriate directories in your Next.js app
4. Set up proper routing in your app directory

Example integration:

```tsx
// app/meeting/[id]/page.tsx
'use client'

import { MeetingRoom } from '@/features/meeting/MeetingRoom'

export default function MeetingPage() {
  return <MeetingRoom />
}
```

### Important Notes

1. The components use WebRTC for video streaming - ensure proper setup in your Next.js environment
2. Media capture requires proper permissions handling
3. Consider implementing proper state management for production use
4. Add proper error boundaries and loading states
5. Implement actual API endpoints for data persistence
6. Add proper authentication and authorization
7. Implement actual WebRTC signaling server
8. Add proper environment variable handling

### License

MIT License