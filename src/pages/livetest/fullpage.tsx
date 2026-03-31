import { useEffect, useState } from 'react';
import {
    ParticipantView,
    StreamCall,
    StreamVideo,
    StreamVideoClient,
    User,
    Call,
    StreamTheme,
    CallControls,
    CallingState,
    useCallStateHooks
} from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import { STREAM_API_KEY, STREAM_USER_ID, STREAM_TOKEN, STREAM_CALL_ID } from '@/types/keys';
import { Minimize } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const user: User = { id: STREAM_USER_ID, name: 'Altech' };

const MyCallUI = () => {
    const { useParticipants } = useCallStateHooks();
    const participants = useParticipants();

    return (
        <div className="flex-1 w-full p-4 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full">
                {participants.map((p) => (
                    <div key={p.sessionId} className="w-full h-full min-h-[300px] md:min-h-[40vh] items-stretch flex relative ring-1 ring-slate-800 rounded">
                        <ParticipantView participant={p} className="w-full h-full object-cover rounded" />
                    </div>
                ))}
            </div>
        </div>
    );
};

const MyUILayout = () => {
    const { useCallCallingState } = useCallStateHooks();
    const callingState = useCallCallingState();
    const navigate = useNavigate();

    if (callingState !== CallingState.JOINED) {
        return (
            <div className="flex h-full w-full items-center justify-center bg-[#0a0a0a]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-slate-700 border-t-red-600 rounded-full animate-spin" />
                    <p className="text-xs font-black uppercase text-slate-400">Joining Call...</p>
                </div>
            </div>
        );
    }

    return (
        <StreamTheme className="h-full w-full flex flex-col relative bg-[#0a0a0a]">
            {/* The Custom Participant Grid replaces SpeakerLayout */}
            <MyCallUI />

            {/* Standard Stream SDK floating bottom controls */}
            <CallControls />

            <button
                onClick={() => navigate('/live-test')}
                className="absolute top-6 right-6 z-50 p-2 bg-black/50 hover:bg-black/70 rounded text-white transition-colors border border-white/10 shadow-lg"
                title="Minimize stream"
            >
                <Minimize className="w-5 h-5" />
            </button>
        </StreamTheme>
    );
};

export const LiveFullPage = () => {
    const [client, setClient] = useState<StreamVideoClient | null>(null);
    const [call, setCall] = useState<Call | null>(null);

    useEffect(() => {
        const _client = StreamVideoClient.getOrCreateInstance({ apiKey: STREAM_API_KEY, user, token: STREAM_TOKEN });
        const _call = _client.call('default', STREAM_CALL_ID);

        _call.join({ create: true }).catch((err) => {
            console.error('Failed to join call inside FullPage', err);
        });

        setClient(_client);
        setCall(_call);

        return () => {
            // Unmount cleanup removed because navigating to /live-test drops the call abruptly
            // _call.leave();
            // _client.disconnectUser();
        };
    }, []);

    if (!client || !call) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-[#0a0a0a]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-slate-700 border-t-red-600 rounded-full animate-spin" />
                    <p className="text-xs font-black uppercase text-slate-400">Initializing SDK...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen w-screen bg-[#0a0a0a] overflow-hidden">
            <StreamVideo client={client}>
                <StreamCall call={call}>
                    <MyUILayout />
                </StreamCall>
            </StreamVideo>
        </div>
    );
};

export default LiveFullPage;
