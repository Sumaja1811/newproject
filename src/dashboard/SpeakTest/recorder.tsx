'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  StopCircle,
  CirclePause ,
  Play,
  Volume2,
  VolumeX,
  Trash2,
  CheckCircle,
} from 'lucide-react';

// Global types
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
  interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
  }
  interface SpeechRecognitionErrorEvent extends Event {
    error: string;
  }
}

// Props
interface VoiceTranscriberProps {
  transcribedText: string;
  setTranscribedText: (text: string) => void;
  inputText: string;
  setInputText: (text: string) => void;
}

// Component
const VoiceTranscriber: React.FC<VoiceTranscriberProps> = ({
  transcribedText,
  setTranscribedText,
  inputText,
  setInputText
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recognitionComplete, setRecognitionComplete] = useState(false);
  const [pendingTranscript, setPendingTranscript] = useState<string | null>(null);

  const [timer, setTimer] = useState(0);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  // const [inputText, setInputText] = useState<string>('');

  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  

  const pad = (num: number) => String(num).padStart(2, '0');

  const hours = pad(Math.floor(timer / 3600));
  const minutes = pad(Math.floor((timer % 3600) / 60));
  const seconds = pad(timer % 60);
  const formattedTime = `${hours}:${minutes}:${seconds}`;


useEffect(() => {
  let timerId: NodeJS.Timeout | null = null;
  if (isRecording) {
    timerId = setInterval(() => setTimer((prev) => prev + 1), 1000);
  }
  return () => {
    if (timerId) clearInterval(timerId);
  };
}, [isRecording]);


  useEffect(() => {
  let rafId: number;

  const update = () => {
    if (audioRef.current && isPlaying) {
      setPlaybackTime(audioRef.current.currentTime);
      rafId = requestAnimationFrame(update);
    }
  };

  if (isPlaying) {
    rafId = requestAnimationFrame(update);
  }

  return () => cancelAnimationFrame(rafId);
}, [isPlaying]);


  const drawWaveform = (dataArray: Uint8Array) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    const isDarkMode = document.documentElement.classList.contains('dark');
  ctx.fillStyle = isDarkMode ? '#ffffff' : '#000000';
    const barWidth = 2;
    const spacing = 1;
    const maxBarHeight = HEIGHT / 2.5;
    const numBars = Math.floor(WIDTH / (barWidth + spacing));
    for (let i = 0; i < numBars; i++) {
      const barHeight = Math.pow(dataArray[i] / 128.0, 2) * maxBarHeight;
      const x = (barWidth + spacing) * i;
      const y = HEIGHT / 2 - barHeight / 2;
      ctx.fillRect(x, y, barWidth, barHeight);
    }
  };

  const visualizeVolume = (analyser: AnalyserNode) => {
    analyser.fftSize = 256;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);
      drawWaveform(dataArray);
    };
    draw();
  };

//   const handleStartRecording = async () => {
//     setIsProcessing(true); // Start showing "Recognizing your voice"
//     setRecognitionComplete(false);
//     setTranscribedText('');
//     setPendingTranscript(null);
//     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//     const media = new MediaRecorder(stream);
//     setMediaRecorder(media);
//     audioChunks.current = [];

//     media.ondataavailable = (e) => audioChunks.current.push(e.data);
// media.onstop = () => {
//   const blob = new Blob(audioChunks.current, { type: 'audio/webm' });
//   const url = URL.createObjectURL(blob);
//   setAudioURL(url);

//   // 🟢 Set playback duration even before play
//   const audio = new Audio(url);
//   audio.onloadedmetadata = () => {
//     setPlaybackTime(audio.duration);
//   };
// };


//     const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
//     const source = audioCtx.createMediaStreamSource(stream);
//     const analyser = audioCtx.createAnalyser();
//     source.connect(analyser);
//     analyserRef.current = analyser;
//     audioContextRef.current = audioCtx;
//     visualizeVolume(analyser);
//     setIsRecording(true);
//     setTimer(0);
//     media.start();

//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     const recognition = new SpeechRecognition();
//     recognition.lang = 'en-US';
//     recognition.interimResults = false;
//     recognition.maxAlternatives = 1;

//     recognition.onresult = (event: SpeechRecognitionEvent) => {
//       const result = event.results[0][0].transcript;
//       setPendingTranscript(result);
//     };

//     recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
//       console.error('Speech recognition error:', event.error);
//       setRecognitionComplete(true);
//       setIsProcessing(false);
//       setTranscribedText('Error: ' + event.error);
//     };

//     recognitionRef.current = recognition;
//     recognition.start();
    
//   };

const handleStartRecording = async () => {
  setIsProcessing(true);
  setRecognitionComplete(false);
  setTranscribedText('');
  setPendingTranscript(null);

  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const media = new MediaRecorder(stream);
  setMediaRecorder(media);
  audioChunks.current = [];

  media.ondataavailable = (e) => audioChunks.current.push(e.data);
  media.onstop = () => {
    const blob = new Blob(audioChunks.current, { type: 'audio/webm' });
    const url = URL.createObjectURL(blob);
    setAudioURL(url);

    const audio = new Audio(url);
    audio.onloadedmetadata = () => {
      setPlaybackTime(audio.duration);
    };
  };

  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const source = audioCtx.createMediaStreamSource(stream);
  const analyser = audioCtx.createAnalyser();
  source.connect(analyser);
  analyserRef.current = analyser;
  audioContextRef.current = audioCtx;
  visualizeVolume(analyser);

  setIsRecording(true);
  setTimer(0);
  media.start();

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  let hasResult = false;

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    hasResult = true;
    const result = event.results[0][0].transcript;
    setPendingTranscript(result);
  };

  recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
    console.error('Speech recognition error:', event.error);
    setIsProcessing(false);
    setRecognitionComplete(true);
    setTranscribedText('Error: ' + event.error);
  };

  recognition.onend = () => {
    if (!hasResult) {
      setIsProcessing(false);
      setRecognitionComplete(true);
      setTranscribedText('No speech detected. Please try again.');
    }
  };

  recognitionRef.current = recognition;
  recognition.start();

  // Auto-stop after 15 seconds if no speech
  setTimeout(() => {
    if (!hasResult && recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, 15000);
};

  const handleStopRecording = () => {
    setIsRecording(false);
    recognitionRef.current?.stop();
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
    cancelAnimationFrame(animationRef.current || 0);
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }

    if (pendingTranscript) {
      setTimeout(() => {
        setIsProcessing(false);
        setRecognitionComplete(true);
        setTimeout(() => {
          setRecognitionComplete(false);
          setTranscribedText(pendingTranscript);
          setPendingTranscript(null);
        }, 1500);
      }, 1000);
    }
  };

  const handleTogglePlay = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(audioURL!);
      audioRef.current.onended = () => setIsPlaying(false);
      audioRef.current.muted = isMuted;
    }
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleToggleMute = () => {
    setIsMuted((prev) => {
      if (audioRef.current) audioRef.current.muted = !prev;
      return !prev;
    });
  };

  const handleDelete = () => {
    setAudioURL(null);
    setTimer(0);
    setPlaybackTime(0);
    setTranscribedText('');
    setRecognitionComplete(false);
    setIsProcessing(false);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    if (analyserRef.current) {
      analyserRef.current.disconnect();
      analyserRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };

  const formatTime = (time: number) => {
  if (!isFinite(time) || isNaN(time)) return "00:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${pad(minutes)}:${pad(seconds)}`;
};

  return (
    <div className="flex flex-row flex gap-4">
      {/* 🎤 Left UI */}
      <div className="w-1/2 h-20 bg-[#f7f7f7] dark:bg-[#2E2D2D] border border-[#ccc] dark:border-[#444] rounded-lg p-4 flex  items-center">
        {!isRecording && !audioURL && (
          <div className="flex flex-row w-full max-w-xl  gap-1">
          <span onClick={handleStartRecording} className="ml-34">
            <svg xmlns="http://www.w3.org/2000/svg" width="46" height="36" viewBox="0 0 46 46">
              <g id="Group_48" data-name="Group 48" transform="translate(-390.564 -122.564)">
                <rect id="Rectangle_11" data-name="Rectangle 11" width="46" height="46" rx="23" transform="translate(390.564 122.564)" fill="#64acff"/>
                <g id="mic" transform="translate(407.364 135.877)">
                  <path id="Path_70" data-name="Path 70" d="M72.96,170.24h6.2" transform="translate(-69.86 -150.865)" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                  <path id="Path_71" data-name="Path 71" d="M61.04,79.04v1.55a6.218,6.218,0,0,1-6.2,6.2h0a6.218,6.218,0,0,1-6.2-6.2V79.04" transform="translate(-48.64 -71.29)" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                  <path id="Path_72" data-name="Path 72" d="M97.28,139.84v3.875" transform="translate(-91.08 -124.34)" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                  <path id="Path_73" data-name="Path 73" d="M70.755,31.415a3.818,3.818,0,0,1-2.739-1.167,3.918,3.918,0,0,1-1.136-2.756V22.115a3.875,3.875,0,1,1,7.75,0v5.377A3.9,3.9,0,0,1,70.755,31.415Z" transform="translate(-64.555 -18.24)" fill="#fff"/>
                </g>
              </g>
            </svg>
          </span>  
          <p className=" mt-2">Start Recording</p>
          </div>
        )}

        {isRecording && (
          <>
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" width="46" height="36" viewBox="0 0 46 46">
                <g id="Group_48" data-name="Group 48" transform="translate(-390.564 -122.564)">
                  <rect id="Rectangle_11" data-name="Rectangle 11" width="46" height="46" rx="23" transform="translate(390.564 122.564)" fill="#ff6464"/>
                  <g id="mic" transform="translate(407.364 135.877)">
                    <path id="Path_70" data-name="Path 70" d="M72.96,170.24h6.2" transform="translate(-69.86 -150.865)" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                    <path id="Path_71" data-name="Path 71" d="M61.04,79.04v1.55a6.218,6.218,0,0,1-6.2,6.2h0a6.218,6.218,0,0,1-6.2-6.2V79.04" transform="translate(-48.64 -71.29)" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                    <path id="Path_72" data-name="Path 72" d="M97.28,139.84v3.875" transform="translate(-91.08 -124.34)" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                    <path id="Path_73" data-name="Path 73" d="M70.755,31.415a3.818,3.818,0,0,1-2.739-1.167,3.918,3.918,0,0,1-1.136-2.756V22.115a3.875,3.875,0,1,1,7.75,0v5.377A3.9,3.9,0,0,1,70.755,31.415Z" transform="translate(-64.555 -18.24)" fill="#fff"/>
                  </g>
                </g>
              </svg>
            </span>
            <span className="text-black dark:text-white">Recording</span>
            <canvas className="w-full h-6 min-w-0 overflow-hidden ml-6"ref={canvasRef} width={190} height={30} />
            {/* <span className="text-white font-mono ml-8">{formattedTime}</span> */}
            <span className="text-black dark:text-white font-mono ml-4">{formattedTime}</span>


            <span onClick={handleStopRecording} className= "ml-2">
              <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="46" height="36" viewBox="0 0 43.887 43.887">
                <defs>
                  <filter id="Rectangle_18" x="7" y="10" width="30" height="30" filterUnits="userSpaceOnUse">
                    <feOffset dy="3" in="SourceAlpha"/>
                    <feGaussianBlur stdDeviation="3" result="blur"/>
                    <feFlood flood-opacity="0.161"/>
                    <feComposite operator="in" in2="blur"/>
                    <feComposite in="SourceGraphic"/>
                  </filter>
                </defs>
                <g id="stop-circle-fill" transform="translate(0 -0.443)">
                  <g id="Group_51" data-name="Group 51" transform="translate(0 0)">
                    <g id="Group_73" data-name="Group 73">
                      <path id="Path_74" data-name="Path 74" d="M43.887,21.943A21.943,21.943,0,1,1,21.943,0,21.943,21.943,0,0,1,43.887,21.943Z" transform="translate(0 0.443)" fill="red" style={{ fill: 'var(--stop-icon-color)'}}/>
                      <g transform="matrix(1, 0, 0, 1, 0, 0.44)" filter="url(#Rectangle_18)">
                        <rect id="Rectangle_18-2" data-name="Rectangle 18" width="12" height="12" rx="3" transform="translate(16 16)" style={{fill: 'var(--stop-rect-icon-color'}}/>
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
            </span>
          </>
        )}

        {!isRecording && audioURL && (
          <>
            <span onClick={handleTogglePlay}>{isPlaying ? (
    <CirclePause  className="h-6 w-6" stroke="white"  style={{ stroke: 'var(--circlepause-icon-color)', fill: '' }} />
            )
               : (
               <Play  className="h-6 w-6" stroke="white" fill="white" style={{ stroke: 'var(----audio-play-icon-color)', fill: 'var(--audio-play-icon-color)' }}/>
               )}</span>
            <span className="text-black dark:text-white ml-4 font-mono">
  {formatTime(playbackTime)} 
</span>

            <input
              type="range"
              className="w-full accent-[#413e3e] dark:accent-white ml-4"
              value={playbackTime}
              max={audioRef.current?.duration || 0}
              onChange={(e) => {
                const time = Number(e.target.value);
                if (audioRef.current) audioRef.current.currentTime = time;
                setPlaybackTime(time);
              }}
            />


            <span className="ml-3" onClick={handleToggleMute}>
            {isMuted ? (
    <VolumeX
      className="h-6 w-6 dark:stroke-white dark:fill-white"
     style={{ stroke: 'var(--mute-icon-color)', fill: 'var(--mute-icon-color)' }}// Light mode color
    />
  ) : (
    <Volume2
      className="h-6 w-6 dark:stroke-white dark:fill-white"
      style={{ stroke: 'var(--volume-icon-color)', fill: 'var(--volume-icon-color)' }} // Light mode color
    />
  )}</span>
            <span className="ml-3 " onClick={handleDelete}><Trash2 /></span>
          </>
        )}
      </div>

      {!isRecording && !audioURL && (
        <p style={{
          borderRadius: "50px", height: "6vh", width: "3vw",
          border: "1px solid grey", textAlign: "center",
          paddingTop: "5px", marginTop: "23px"
        }}>or</p>
      )}

      {/* 📄 Right Box */}
      {/* <div className="w-1/2 h-32 bg-[#2E2D2D] rounded p-4">
       */}
       <div className="w-1/2 h-20 mt-0.5 dark:bg-[#2E2D2D] bg-[#f7f7f7] rounded-lg  flex justify-center items-center text-center">
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <span >
                <svg
                  className="animate-pulse w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 23.242 23.242"
                >
                  <g id="bx-loader" transform="translate(-16 -16)">
                    <path
                      id="Path_75"
                      d="M16,26.459h5.811v2.324H16Zm17.432,0h5.811v2.324H33.432Zm-6.973,6.973h2.324v5.811H26.459Zm0-17.432h2.324v5.811H26.459Zm-7.877,4.225,1.643-1.643,4.109,4.109-1.643,1.643ZM36.66,35.017,35.017,36.66l-4.109-4.109,1.643-1.643ZM22.691,30.908l1.643,1.643L20.225,36.66l-1.643-1.643Zm8.216-8.217,4.109-4.108,1.643,1.644-4.109,4.108Z"
                      fill="#00c4ff"
                    />
                  </g>
                </svg>
              </span>
              <p  className="text-sm sm:text-base md:text-lg font-medium">Recognizing your voice</p>
            </div>
          ) : recognitionComplete && !transcribedText ? (
            <div className="flex items-center gap-2">
              <span>
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 30.266 30.266"
                >
                  <g id="check-circle-fill">
                    <path
                      id="Path_81"
                      d="M30.266,15.133A15.133,15.133,0,1,1,15.133,0,15.133,15.133,0,0,1,30.266,15.133ZM22.756,9.4a1.419,1.419,0,0,0-2.043.042l-6.57,8.37-3.959-3.961a1.419,1.419,0,0,0-2.005,2.005l5.005,5.007a1.419,1.419,0,0,0,2.041-.038l7.551-9.439A1.419,1.419,0,0,0,22.758,9.4Z"
                      fill="#24d304"
                    />
                  </g>
                </svg>
              </span>
              <p className="text-sm sm:text-base md:text-lg font-medium text-black dark:text-white">Speech recognition successful</p>
            </div>
          ) : transcribedText ? (
            <div className="relative w-full h-[13.7vh]">
                    <p className="absolute top-2 left-2 text-xs text-gray-600 pointer-events-none z-10 dark:text-gray-400">
                      You can edit your text before proceed
                    </p>
                    <Textarea
                      className="w-full h-full absolute bg-[#f7f7f7] dark:bg-[#1E1E1E] pt-7"
                      value={transcribedText}
                      onChange={(e) => setTranscribedText(e.target.value)}
                    />
              </div>


          ) : (
            <Textarea
  className="w-full h-[13.7vh] bg-[#f7f7f7] dark:bg-[#2E2D2D] border-[#ccc] dark:border-[#444] pt-5"
  placeholder="Enter your prompt here..."
  value={inputText}
  onChange={(e) => setInputText(e.target.value)}
/>
          )
          }
          </div>
      </div>
  );
};

export default VoiceTranscriber;
