import { useRef, useState } from "react";

const useAudioRecorder = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    const userStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    setStream(userStream);
    const recorder = new MediaRecorder(userStream);
    mediaRecorderRef.current = recorder;
    recordedChunks.current = [];

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.current.push(event.data);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(recordedChunks.current, { type: "audio/webm" });
      console.log("Recorded Blob:", blob);
    };

    recorder.start();
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current?.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    stream?.getTracks().forEach((track) => track.stop());
    setStream(null);
  };

  return { stream, startRecording, stopRecording };
};

export default useAudioRecorder;
