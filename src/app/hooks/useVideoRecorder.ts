import { useState, useRef, useEffect, useCallback } from "react";

export type RecordState = "idle" | "recording" | "done";

export interface RecorderResult {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  recordState: RecordState;
  elapsed: number;
  playbackUrl?: string;
  error?: string;
  recordedBlob?: Blob | null;
  startRecording: () => void;
  stopRecording: () => void;
  retake: () => void;
  fmt: (s: number) => string;
}

interface Options {
  maxSeconds?: number;
  initialDone?: boolean;
  initialDuration?: number;
  initialPlaybackUrl?: string;
}

export function useVideoRecorder({
  maxSeconds = 60,
  initialDone = false,
  initialDuration = 0,
  initialPlaybackUrl,
}: Options = {}): RecorderResult {
  const [recordState, setRecordState] = useState<RecordState>(initialDone ? "done" : "idle");
  const [elapsed, setElapsed] = useState(initialDone ? initialDuration : 0);
  const [playbackUrl, setPlaybackUrl] = useState<string | undefined>(initialPlaybackUrl);
  const [error, setError] = useState<string | undefined>(undefined);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const playbackUrlRef = useRef<string | undefined>(undefined);
  const recordedBlobRef = useRef<Blob | undefined>(undefined);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fmt = useCallback((s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`, []);

  const cleanupStream = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (playbackUrlRef.current) {
      URL.revokeObjectURL(playbackUrlRef.current);
      playbackUrlRef.current = undefined;
    }
  }, []);

  useEffect(() => {
    return () => {
      cleanupStream();
    };
  }, [cleanupStream]);

  const attachVideoSource = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (streamRef.current && recordState !== "done") {
      video.srcObject = streamRef.current;
      video.muted = true;
      video.controls = false;
      video.play().catch(() => {});
      return;
    }

    if (recordState === "done" && playbackUrl) {
      video.srcObject = null;
      video.src = playbackUrl;
      video.muted = false;
      video.controls = true;
      video.play().catch(() => {});
      return;
    }

    video.srcObject = null;
    video.src = "";
    video.controls = false;
  }, [playbackUrl, recordState]);

  useEffect(() => {
    // keep playbackUrlRef in sync with state
    playbackUrlRef.current = playbackUrl;
    attachVideoSource();
  }, [attachVideoSource]);

  const requestStream = useCallback(async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError("Camera access is not supported in this browser.");
      return null;
    }

    if (streamRef.current) {
      return streamRef.current;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      attachVideoSource();
      return stream;
    } catch (err) {
      console.error(err);
      setError("Unable to access the camera. Please allow camera access and try again.");
      return null;
    }
  }, [attachVideoSource]);

  useEffect(() => {
    if (recordState !== "done") {
      requestStream();
    }
  }, [recordState, requestStream]);

  const stopRecording = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }

    setRecordState("done");
  }, []);

  const startRecording = useCallback(() => {
    setError(undefined);
    setPlaybackUrl(undefined);

    const startMovie = async () => {
      const stream = await requestStream();
      if (!stream) return;

      chunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const recordedBlob = new Blob(chunksRef.current, { type: "video/webm" });
        recordedBlobRef.current = recordedBlob;
        if (playbackUrlRef.current) {
          URL.revokeObjectURL(playbackUrlRef.current);
        }
        const url = URL.createObjectURL(recordedBlob);
        playbackUrlRef.current = url;
        setPlaybackUrl(url);
      };

      recorder.start();
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
    };

    startMovie();
  }, [maxSeconds, requestStream, stopRecording]);

  const retake = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }

    if (playbackUrlRef.current) {
      URL.revokeObjectURL(playbackUrlRef.current);
      playbackUrlRef.current = undefined;
    }

    setPlaybackUrl(undefined);
    setElapsed(0);
    setRecordState("idle");
  }, []);

  return {
    videoRef,
    recordState,
    elapsed,
    playbackUrl,
    error,
    recordedBlob: recordedBlobRef.current ?? undefined,
    startRecording,
    stopRecording,
    retake,
    fmt,
  };
}
