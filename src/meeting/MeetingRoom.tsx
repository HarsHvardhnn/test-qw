// Update the MeetingRoom component to use the new ParticipantsPanel
import { ParticipantsPanel } from './components/ParticipantsPanel';

// In the MeetingRoom component, update the button click handlers:
<button
  onClick={() => {
    setShowParticipants(!showParticipants);
    if (showAIChat) setShowAIChat(false);
  }}
  className="p-3 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
>
  <Users className="w-6 h-6" />
</button>
<button
  onClick={() => {
    setShowAIChat(!showAIChat);
    if (showParticipants) setShowParticipants(false);
  }}
  className="p-3 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
>
  <div className="w-6 h-6">
    <QwilloLogo variant="icon" />
  </div>
</button>

// And update the participants panel div:
<ParticipantsPanel
  isOpen={showParticipants}
  onClose={() => setShowParticipants(false)}
  participants={participants}
/>