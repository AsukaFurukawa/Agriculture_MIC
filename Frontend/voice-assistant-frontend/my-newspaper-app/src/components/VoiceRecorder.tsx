"use client";
import React, { useRef, useState } from 'react';

interface VoiceRecorderProps {
  onTranscription?: (text: string) => void
  onResponse?: (resp: string) => void
}

export default function VoiceRecorder({ onTranscription, onResponse }: VoiceRecorderProps) {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
        uploadAudio(blob);
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      console.error('Could not start recording:', err);
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  }

  async function uploadAudio(blob: Blob) {
    if (!onTranscription || !onResponse) return;
    try {
      const formData = new FormData();
      formData.append('audio', blob, 'recording.wav');

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/process_speech`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      onTranscription(data.transcribed_text || '');
      onResponse(data.response || '');
    } catch (err) {
      console.error('Error uploading audio:', err);
    }
  }

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={recording ? stopRecording : startRecording}
        className={`
          relative 
          cursor-pointer 
          transition-transform 
          duration-200 
          hover:scale-105 
          ${recording ? "animate-float" : ""}
        `}
      >
        <img
          src={recording ? "/images/mic_recording.png" : "/images/mic.png"}
          alt="Mic Icon"
          width={80}
          height={80}
          className="select-none"
        />
      </button>
      <p className="mt-2">
        {recording ? 'Recording...' : 'Tap the mic to start'}
      </p>
    </div>
  );
}
