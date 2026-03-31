import { useEffect, useState } from 'react';
import {
    SpeakerLayout,
    StreamCall,
    StreamVideo,
    StreamVideoClient,
    User,
    Call,
    StreamTheme,
    CallControls,
    CallingState,
    useCallStateHooks,
    ParticipantView
} from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import { STREAM_API_KEY, STREAM_USER_ID, STREAM_TOKEN, STREAM_CALL_ID } from '@/types/keys';
import { Card } from '@/components/ui/card';
import { Maximize } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const user: User = { id: STREAM_USER_ID, name: 'Altech' };

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
        <StreamTheme className="h-full w-full flex flex-col relative">
            <SpeakerLayout participantsBarPosition="bottom" />
            <CallControls />
            <button
                onClick={() => navigate('/live-full')}
                className="absolute top-6 right-6 z-50 p-2 bg-black/50 hover:bg-black/70 rounded text-white transition-colors"
                title="Maximize stream"
            >
                <Maximize className="w-5 h-5" />
            </button>
        </StreamTheme>
    );
};

export const LiveTestPage = () => {
    const [client, setClient] = useState<StreamVideoClient | null>(null);
    const [call, setCall] = useState<Call | null>(null);

    useEffect(() => {
        const _client = StreamVideoClient.getOrCreateInstance({ apiKey: STREAM_API_KEY, user, token: STREAM_TOKEN });
        const _call = _client.call('default', STREAM_CALL_ID);

        _call.join({ create: true }).catch((err) => {
            console.error('Failed to join call', err);
        });

        setClient(_client);
        setCall(_call);

        return () => {
            // Removing disconnectUser to allow seamless transitions between Maximize/Minimize
            // _call.leave();
            // _client.disconnectUser();
        };
    }, []);

    if (!client || !call) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-slate-200 border-t-red-600 rounded-full animate-spin" />
                    <p className="text-xs font-black uppercase text-slate-400">Initializing Stream SDK...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-1 animate-in fade-in duration-700">
            <Card className="border-slate-100 overflow-hidden shadow-2xl bg-[#0a0a0a] min-h-[75vh] w-full relative rounded">


                <StreamVideo client={client}>
                    <StreamCall call={call}>
                        <MyUILayout />
                    </StreamCall>
                </StreamVideo>
            </Card>
        </div>
    );
};

export default LiveTestPage;
