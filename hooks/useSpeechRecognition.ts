import { useAppSelector } from "@/store/hook";

import { SetStateAction, Dispatch, useEffect, useRef, useState } from "react";

interface UseSpeechRecognitionProps {
    text: string;
    setText: Dispatch<SetStateAction<string>>;
  }
  
  const useSpeechRecognition = ({ text, setText }: UseSpeechRecognitionProps) => {  

  const selectedAnnotationId = useAppSelector((e) => e.editor.selectedAnnotationId);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {

  },[selectedAnnotationId])

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event: any) => {
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            setText((prev: any) => prev + transcript + " ");
          } else {
            interim += transcript;
          }
        }
      };

      recognition.onerror = (e: any) => console.error("Speech recognition error:", e);
      recognitionRef.current = recognition;
    }
  }, []);

  const start = () => recognitionRef.current?.start();
  const stop = () => recognitionRef.current?.stop();

  return { start, stop };
};

export default useSpeechRecognition;
