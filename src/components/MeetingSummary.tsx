import React from 'react';
import { CheckCircle, FileText, Image, MessageSquare } from 'lucide-react';
import { GlassmorphicButton } from './GlassmorphicButton';

interface MeetingSummaryProps {
  topics: Array<{
    id: number;
    title: string;
    details: string[];
    completed?: boolean;
    notes?: string;
  }>;
  mediaItems: Array<{
    id: string;
    type: 'photo' | 'video';
    url: string;
    name: string;
  }>;
  onClose: () => void;
  onSubmit: () => void;
}

export const MeetingSummary: React.FC<MeetingSummaryProps> = ({
  topics,
  mediaItems,
  onClose,
  onSubmit,
}) => {
  const completedTopics = topics.filter(t => t.completed);
  const topicsWithNotes = topics.filter(t => t.notes);
  const photos = mediaItems.filter(m => m.type === 'photo');
  const videos = mediaItems.filter(m => m.type === 'video');

  const aiSummary = `Your vision for a modern kitchen remodel is well-structured and comprehensive! 
    You've covered all essential aspects, from layout to materials. The ${photos.length} photos and 
    ${videos.length} videos you've shared provide excellent context for contractors. 
    Based on your detailed notes about ${topicsWithNotes.map(t => t.title.toLowerCase()).join(', ')}, 
    we can ensure accurate quotes that match your expectations.`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
      <div className="relative w-full max-w-4xl glassmorphic rounded-xl p-6 max-h-[90vh] flex flex-col">
        <h2 className="text-2xl font-semibold text-white mb-6 text-center">
          Meeting Summary
        </h2>

        <div className="flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar">
          {/* Progress Overview */}
          <div className="flex items-center justify-center space-x-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {completedTopics.length}/{topics.length}
              </div>
              <div className="text-sm text-gray-400">Topics Covered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {photos.length}
              </div>
              <div className="text-sm text-gray-400">Photos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {videos.length}
              </div>
              <div className="text-sm text-gray-400">Videos</div>
            </div>
          </div>

          {/* Topics Summary */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-400" />
              Topics Discussed
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {topics.map(topic => (
                <div
                  key={topic.id}
                  className="glassmorphic rounded-lg p-3 flex items-start space-x-3"
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                    topic.completed ? 'bg-green-400/20 text-green-400' : 'bg-white/10 text-gray-400'
                  }`}>
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium text-sm">{topic.title}</h4>
                    {topic.notes && (
                      <p className="text-xs text-gray-400 mt-1">{topic.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Media Summary */}
          {mediaItems.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <Image className="w-5 h-5 mr-2 text-blue-400" />
                Shared Media
              </h3>
              <div className="grid grid-cols-6 gap-2">
                {mediaItems.slice(0, 12).map(item => (
                  <div
                    key={item.id}
                    className="aspect-square rounded-lg overflow-hidden"
                  >
                    {item.type === 'photo' ? (
                      <img
                        src={item.url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <video
                        src={item.url}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Feedback */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-blue-400" />
              AI Feedback
            </h3>
            <div className="glassmorphic rounded-lg p-3">
              <p className="text-gray-300 leading-relaxed text-sm">{aiSummary}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-6 pt-4 border-t border-white/10">
          <GlassmorphicButton
            variant="secondary"
            onClick={onClose}
          >
            Return to Meeting
          </GlassmorphicButton>
          <GlassmorphicButton
            variant="primary"
            onClick={onSubmit}
          >
            Submit for Quoting
          </GlassmorphicButton>
        </div>
      </div>
    </div>
  );
};