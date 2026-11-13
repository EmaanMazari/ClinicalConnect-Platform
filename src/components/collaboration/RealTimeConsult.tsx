import React, { useState, useRef } from 'react';
import { 
  Video, VideoOff, Mic, MicOff, Monitor, MessageSquare, 
  Send, Users, ShieldCheck, PenTool, X, PhoneOff, Maximize2 
} from 'lucide-react';
import { Doctor } from '../../types';
import { MOCK_DOCTORS } from '../../data/mockDoctors';

interface RealTimeConsultProps {
  currentDoctor: Doctor;
  caseTitle?: string;
  onClose: () => void;
}

export const RealTimeConsult: React.FC<RealTimeConsultProps> = ({
  currentDoctor,
  caseTitle = 'STAT Coronary Angiogram & Hemodynamic Consult',
  onClose
}) => {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [activeWhiteboard, setActiveWhiteboard] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: string; text: string; time: string; isMe: boolean }>>([
    { sender: 'Dr. Marcus Vance (Radiology)', text: 'I am reviewing the high-pitch thoracic CTA now. Pulmonary arterial bifurcation shows saddle embolus.', time: '17:42', isMe: false },
    { sender: 'Dr. Alexander Wright (Cardiology)', text: 'What is the RV to LV diameter ratio on the 4-chamber axial reformats?', time: '17:43', isMe: true },
    { sender: 'Dr. Marcus Vance (Radiology)', text: 'RV/LV is 1.34 with paradoxical septal flattening. Definite intermediate-high risk category.', time: '17:44', isMe: false }
  ]);
  const [chatInput, setChatInput] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setMessages(prev => [
      ...prev,
      {
        sender: `${currentDoctor.name} (${currentDoctor.specialty})`,
        text: chatInput.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: true
      }
    ]);
    setChatInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
      <div className="bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl w-full max-w-6xl h-[88vh] flex flex-col overflow-hidden text-slate-100">
        {/* Call Room Top Header */}
        <div className="flex items-center justify-between px-6 py-3 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
            <div>
              <div className="font-bold text-sm text-white flex items-center gap-2">
                <span>LIVE MULTIDISCIPLINARY CONSULTATION</span>
                <span className="px-2 py-0.5 rounded bg-red-950 text-red-300 font-mono text-[10px] border border-red-800 font-bold">
                  ENCRYPTED WebRTC
                </span>
              </div>
              <div className="text-xs text-slate-400 truncate max-w-md">
                Case: {caseTitle}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-800 text-xs font-mono text-slate-300">
              <Users className="w-3.5 h-3.5 text-medical-400" />
              <span>3 Specialists Connected</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Call Workspace Grid: Video Feeds + Live Scan / Chat */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 overflow-hidden bg-black">
          {/* Main Stage: Screen Share / Video Tiles */}
          <div className="lg:col-span-2 relative flex flex-col h-full bg-slate-950 p-4 border-r border-slate-800 overflow-hidden">
            {/* Primary Main Viewport */}
            <div className="relative flex-1 rounded-2xl overflow-hidden bg-black border border-slate-800 flex items-center justify-center">
              {isScreenSharing ? (
                <div className="relative w-full h-full flex flex-col items-center justify-center bg-slate-900">
                  <img
                    src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1000&auto=format&fit=crop&q=80"
                    alt="Shared CT Angiogram"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute top-4 left-4 bg-black/70 px-3 py-1 rounded-lg text-xs font-mono text-cyan-400 border border-cyan-800">
                    Live Screen Share: Dr. Marcus Vance (Thoracic CTA)
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 w-full h-full p-3">
                  {/* Doctor Tile 1 */}
                  <div className="relative rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
                    <img
                      src={currentDoctor.avatar}
                      alt={currentDoctor.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur px-2 py-0.5 rounded text-[11px] font-medium text-white flex items-center gap-1.5">
                      <span>{currentDoctor.name} (You)</span>
                      {!isAudioOn && <MicOff className="w-3 h-3 text-red-400" />}
                    </div>
                  </div>

                  {/* Doctor Tile 2 */}
                  <div className="relative rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
                    <img
                      src={MOCK_DOCTORS[2].avatar}
                      alt={MOCK_DOCTORS[2].name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur px-2 py-0.5 rounded text-[11px] font-medium text-white flex items-center gap-1.5">
                      <span>{MOCK_DOCTORS[2].name} (Radiology)</span>
                    </div>
                  </div>

                  {/* Doctor Tile 3 */}
                  <div className="relative rounded-xl overflow-hidden bg-slate-900 border border-slate-800 col-span-2">
                    <img
                      src={MOCK_DOCTORS[1].avatar}
                      alt={MOCK_DOCTORS[1].name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur px-2 py-0.5 rounded text-[11px] font-medium text-white">
                      {MOCK_DOCTORS[1].name} (Neurology Lead)
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* In-Call Floating Control Dock */}
            <div className="flex items-center justify-center gap-3 py-3 mt-3">
              <button
                onClick={() => setIsAudioOn(!isAudioOn)}
                className={`p-3.5 rounded-full shadow-lg transition ${
                  isAudioOn ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-red-600 text-white'
                }`}
                title={isAudioOn ? 'Mute Microphone' : 'Unmute Microphone'}
              >
                {isAudioOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={`p-3.5 rounded-full shadow-lg transition ${
                  isVideoOn ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-red-600 text-white'
                }`}
                title={isVideoOn ? 'Turn Video Off' : 'Turn Video On'}
              >
                {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setIsScreenSharing(!isScreenSharing)}
                className={`p-3.5 rounded-full shadow-lg transition ${
                  isScreenSharing ? 'bg-cyan-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white'
                }`}
                title="Share Medical Screen / PACS"
              >
                <Monitor className="w-5 h-5" />
              </button>

              <button
                onClick={() => setActiveWhiteboard(!activeWhiteboard)}
                className={`p-3.5 rounded-full shadow-lg transition ${
                  activeWhiteboard ? 'bg-purple-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white'
                }`}
                title="Live Scan Annotation Whiteboard"
              >
                <PenTool className="w-5 h-5" />
              </button>

              <button
                onClick={onClose}
                className="p-3.5 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg transition"
                title="Disconnect Consultation"
              >
                <PhoneOff className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Right Column: Real-Time Encrypted Chat */}
          <div className="flex flex-col h-full bg-slate-900 overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <span className="font-bold text-xs text-slate-200 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-medical-400" />
                <span>Instant Consultation Chat</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">HIPAA Encrypted</span>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 space-y-3 overflow-y-auto text-xs">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl ${
                    m.isMe
                      ? 'bg-medical-700 text-white ml-6 rounded-tr-none'
                      : 'bg-slate-800 text-slate-200 mr-6 rounded-tl-none border border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-semibold opacity-75 mb-1">
                    <span>{m.sender}</span>
                    <span>{m.time}</span>
                  </div>
                  <p className="leading-relaxed">{m.text}</p>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                placeholder="Type urgent clinical note..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-medical-500"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-medical-600 hover:bg-medical-700 text-white transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
