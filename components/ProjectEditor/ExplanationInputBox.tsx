import React, { useState, useEffect, useRef } from "react";
import { Check, Mic, X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

import VoiceGraph from "../utils/VoiceGraph";
import CreatingScriptLoader from "./CreatingScriptLoader";
import useSpeechRecognition from "../../hooks/useSpeechRecognition";
import useAudioRecorder from "../../hooks/useAudioRecorder";

import { useAppDispatch, useAppSelector } from "@/store/hook";
import {
  Annotation,
  updateAnnotationExplanationText,
  updateAnnotationFields,
} from "@/store/slices/editorSlice";
import {
  updateAnnotationExplanationTextServer,
} from "@/app/actions/updateAnnotationExplanationText";
import {
  updateAnnotationFieldsServer,
} from "@/app/actions/updateAnnotationFieldsServer";
import { createExplanationScript } from "@/app/actions/createExplanationScript";

const ExplanationInputBox = ({ annotation }: { annotation: Annotation }) => {
  const [record, setRecord] = useState(false);
  const [text, setText] = useState(annotation.explanationText);
  const [isCreatingScript, setIsCreatingScript] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const { start: startSpeech, stop: stopSpeech } = useSpeechRecognition({ text, setText });
  const { stream, startRecording, stopRecording } = useAudioRecorder();

  const projectId = useAppSelector((s) => s.editor.projectId);
  const dispatch = useAppDispatch();

  useEffect(() => {
    debounceTimerRef.current = setTimeout(() => {
      updateAnnotationExplanationTextServer({
        projectId,
        annotationId: annotation.annotationId,
        explanationText: text,
        pageNo: annotation.pageNo,
      });

      dispatch(updateAnnotationExplanationText({
        annotationId: annotation.annotationId,
        explanationText: text,
      }));
    }, 800);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [text]);

  useEffect(() => {
    setText(annotation.explanationText);
  }, [annotation]);

  useEffect(() => {
    const textarea = textAreaRef.current;
    if (textarea) {
      textarea.scrollTop = textarea.scrollHeight;
    }
  }, [text]);

  const handleMicClick = async () => {
    if (!record) {
      await startRecording();
      startSpeech();
    } else {
      stopRecording();
      stopSpeech();
    }
    setRecord(!record);
  };

  const handleReset = () => {
    stopRecording();
    stopSpeech();
    setText("");
    setRecord(false);
  };

  const handleNextClick = async () => {
    if (text.trim() === "") {
      toast.warning("Please provide an explanation before continuing.");
      return;
    }

    setIsCreatingScript(true);

    dispatch(updateAnnotationExplanationText({
      annotationId: annotation.annotationId,
      explanationText: text,
    }));

    await updateAnnotationExplanationTextServer({
      projectId,
      annotationId: annotation.annotationId,
      explanationText: text,
      pageNo: annotation.pageNo,
    });

    const res = await createExplanationScript(text);
    console.log("pop", res);

    if (res.responseCode === 2) {
      toast.error(res.message || "Something went wrong.");
      setIsCreatingScript(false);
      return;
    }

    if (res.responseCode === 1 && res.message) {
      dispatch(updateAnnotationFields({
        annotationId: annotation.annotationId,
        updates: { script: res.message, currentStage: 2 },
      }));

      await updateAnnotationFieldsServer({
        projectId,
        annotationId: annotation.annotationId,
        pageNo: annotation.pageNo,
        updates: { script: res.message, currentStage: 2 },
      });
    }

    setIsCreatingScript(false);
  };

  if (isCreatingScript) return <CreatingScriptLoader />;

  return (
    <>
      <div className="flex flex-col w-full rounded-xl shadow-lg bg-white p-3">
        <div className="flex w-full">
          <textarea
            ref={textAreaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Start typing or click the mic to speak..."
            className="h-[130px] flex-grow resize-none text-md scrollbar-clean font-medium font-mono text-gray-700 px-4 py-3 border border-gray-200 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 overflow-y-auto"
          />
          <div className="w-[100px] flex flex-col items-center justify-center cursor-pointer">
            <div
              onClick={handleMicClick}
              className={`rounded-full p-2 transition-all hover:p-3 ${
                record ? "bg-red-600 animate-pulse-mic" : "bg-red-400"
              }`}
            >
              <Mic size={22} strokeWidth={2} className="text-white" />
            </div>
          </div>
        </div>

        {record && stream && (
          <div className="bg-gray-100 w-full flex mt-2 justify-between px-2 rounded-lg p-1 items-center">
            <div className="rounded-lg bg-gray-50 py-2 px-4">
              <VoiceGraph stream={stream} />
            </div>
            <div className="flex gap-2 rounded-lg p-2 bg-gray-200 cursor-pointer">
              <div className="p-1 rounded-full hover:bg-gray-100" onClick={handleReset}>
                <X size={15} />
              </div>
              <div className="p-1 rounded-full hover:bg-gray-100" onClick={handleMicClick}>
                <Check size={15} />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex w-full justify-end pt-3 cursor-pointer">
        <div
          onClick={handleNextClick}
          className="rounded-lg py-1 px-3 bg-[#0D59A6] text-white font-medium font-worksans"
        >
          Next
        </div>
      </div>
    </>
  );
};

export default ExplanationInputBox;
