import { useState, useRef, useEffect, useCallback } from "react";

export type RecordState = "idle" | "recording" | "done";

export interface RecorderResult {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  recordState: RecordState;
  elapsed: number;
  startRecording: () => void;
  stopRecording: () => void;
  retake: () => void;
  fmt: (s: number) => string;
}

interface Options {
  maxSeconds?: number;
  initialDone?: boolean;
  initialDuration?: number;
}

export function useVideoRecorder({
  maxSeconds = 30,
  initialDone = false,
  initialDuration = 0,
}: Options = {}): RecorderResult {
  const [recordState, setRecordState] = useState<RecordState>(initialDone ? "done" : "idle");
  const [elapsed, setElapsed] = useState(initialDone ? initialDuration : 0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => { timerRef.current && clearInterval(timerRef.current); };
  }, []);

  const stopRecording = useCallback(() => {
    timerRef.current && clearInterval(timerRef.current);
    setRecordState("done");
  }, []);

  const startRecording = useCallback(() => {
    setElapsed(0);
    setRecordState("recording");
    timerRef.current = setInterval(() => {
      setElapsed((prev) => {
        if (prev + 1 >= maxSeconds) {
          stopRecording();
          return maxSeconds;
        }
        return prev + 1;
      });
    }, 1000);
  }, [maxSeconds, stopRecording]);

  const retake = useCallback(() => {
    timerRef.current && clearInterval(timerRef.current);
    setElapsed(0);
    setRecordState("idle");
  }, []);

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return { videoRef, recordState, elapsed, startRecording, stopRecording, retake, fmt };
}
