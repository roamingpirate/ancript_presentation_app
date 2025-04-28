"use client";

import React, { useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { motion } from "framer-motion";
import { MousePointer2, Move, PlusCircle, UserRoundPlus } from "lucide-react";
import { setEditorMode } from "@/store/slices/editorSlice";

const modes = [
  { mode: "avatarAdd", icon: UserRoundPlus, label: "Add Avatar", tooltip: "Add Avatar to Slide" },
  { mode: "idle", icon: MousePointer2, label: "Select", tooltip: "Select Tool" },
  { mode: "moveZoom", icon: Move, label: "Move/Zoom", tooltip: "Position the slide" },
] as const;

const EditorModeBox = () => {
  const constraintsRef = useRef(null);
  const dispatch = useAppDispatch();
  const currentMode = useAppSelector((state) => state.editor.editorMode);

  const handleModeChange = (mode: string) => {
    dispatch(setEditorMode(mode as any));
  };

  return (
    <div
      ref={constraintsRef}
      className="fixed inset-0 z-50 overflow-hidden pointer-events-none"
    >
      <motion.div
        drag
        dragConstraints={constraintsRef}
        dragMomentum={false}
        className="absolute pointer-events-auto"
        style={{ top:100, right: 230 }}
      >
        <div className="flex  gap-1 bg-white border border-gray-200 shadow-xl rounded-2xl p-1 px-2">
        {modes.map(({ mode, icon: Icon, tooltip }) => (
          <div className="relative group" key={mode}>
            <button
              onClick={() => handleModeChange(mode)}
              className={`transition-all flex items-center justify-center p-2 rounded-lg text-gray-600 hover:bg-gray-100 ${
                currentMode === mode ? "bg-gray-200 shadow-inner" : ""
              }`}
            >
              <Icon className="w-5 h-5" strokeWidth={1.5} />
            </button>

            {/* Tooltip - now appears below the button */}
            <span className="absolute left-1/2 translate-x-[-50%] mt-2 opacity-0 group-hover:opacity-100 bg-gray-700 text-white text-xs rounded-md px-2 py-1 whitespace-nowrap transition-all shadow-sm z-50">
              {tooltip}
            </span>
          </div>
        ))}

        </div>
      </motion.div>
    </div>
  );
};

//export default EditorModeBox;
