import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Mic, Square, Send, X, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function VoiceRecorder({ moduleId, onSubmit, onClose }) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [duration, setDuration] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  const MAX_DURATION = 30;

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setDuration(0);

      timerRef.current = setInterval(() => {
        setDuration(prev => {
          if (prev >= MAX_DURATION - 1) {
            stopRecording();
            return MAX_DURATION;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      console.error('Failed to start recording:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handleSubmit = async () => {
    if (!audioBlob) return;

    setIsUploading(true);
    try {
      const file = new File([audioBlob], 'voice-note.webm', { type: 'audio/webm' });
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      
      await base44.entities.VoiceNote.create({
        module_id: moduleId,
        audio_url: file_url,
        duration_seconds: duration,
      });

      onSubmit?.();
    } catch (err) {
      console.error('Failed to upload:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const reset = () => {
    setAudioBlob(null);
    setDuration(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-center">
          <h3 className="text-xl font-bold text-slate-900 mb-2">Voice to Vault</h3>
          <p className="text-sm text-slate-500 mb-6">
            Share your thoughts in 30 seconds
          </p>

          {/* Timer ring */}
          <div className="relative w-40 h-40 mx-auto mb-6">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="#e2e8f0"
                strokeWidth="8"
                fill="none"
              />
              <motion.circle
                cx="80"
                cy="80"
                r="70"
                stroke={isRecording ? "#ef4444" : "#8b5cf6"}
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={440}
                animate={{ strokeDashoffset: 440 - (440 * duration) / MAX_DURATION }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-slate-900">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            {!audioBlob ? (
              <Button
                size="lg"
                onClick={isRecording ? stopRecording : startRecording}
                className={`w-16 h-16 rounded-full ${
                  isRecording 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-violet-500 hover:bg-violet-600'
                } shadow-lg`}
              >
                {isRecording ? (
                  <Square className="w-6 h-6" />
                ) : (
                  <Mic className="w-6 h-6" />
                )}
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={reset}
                  className="w-14 h-14 rounded-full"
                >
                  <X className="w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  onClick={handleSubmit}
                  disabled={isUploading}
                  className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-600 shadow-lg"
                >
                  {isUploading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <Send className="w-6 h-6" />
                  )}
                </Button>
              </>
            )}
          </div>

          <p className="text-xs text-slate-400 mt-4">
            {isRecording ? 'Recording... tap to stop' : audioBlob ? 'Ready to submit' : 'Tap to start recording'}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}