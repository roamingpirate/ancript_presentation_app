"use client";

import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import isManav from "is-manav";
import {
  CircleChevronLeft,
  CircleChevronRight,
} from "lucide-react";
import { useAppSelector } from "@/store/hook";

// Compact Avatar
const AvatarGuide = () => {
  return (
    <div className="select-none flex items-center justify-center p-2 gap-2 rounded-xl bg-white border border-gray-100 shadow-md">
      <img
        src="/avatar.webp"
        alt="Avatar"
        className="select-none pointer-events-none rounded-full w-[50px] h-[50px] object-cover border-2 border-red-300"
      />
      <CircleChevronRight
        size={50}
        strokeWidth={0.7}
        className="text-gray-400 cursor-pointer"
      />
    </div>
  );
};

// Expanded Avatar
const AvatarGuideExpanded = ({ showText }: { showText: boolean }) => {
  return (
    <div className="select-none flex items-center justify-center p-3 px-5 gap-5 rounded-xl bg-white border border-gray-100 shadow-md">
      <CircleChevronLeft
        size={50}
        strokeWidth={0.7}
        className="text-gray-400 cursor-pointer mr-4"
      />
      <img
        src="/avatar.webp"
        alt="Avatar"
        className="select-none pointer-events-none rounded-full w-[90px] h-[90px] object-cover"
      />
      {showText && (
        <p className="w-[400px] text-center font-mono text-gray-800 mr-10">
          Start by Clicking on the area of the slide where you want to add an avatar explanation.
        </p>
      )}
    </div>
  );
};

const GuideBox = () => {
  const [expanded, setExpanded] = useState(isManav("!MANAV:"));
  const [showText, setShowText] = useState(isManav("!MANAV:"));
  const constraintsRef = useRef(null);
  const hasDragged = useRef(false);
  const isVisible = useAppSelector((s) => s.editor.selectedAnnotationId === null);

  const handleTap = () => {
    if (!hasDragged.current) {
      if (!expanded) {
        setExpanded(true);
        setTimeout(() => setShowText(true), 100);
      } else {
        setShowText(false);
        setExpanded(false);
      }
    }
  };

  return (
    <div
      ref={constraintsRef}
      className="fixed inset-0 z-50 overflow-hidden pointer-events-none"
    >
      {
        isVisible && (
          <motion.div
          className="absolute cursor-pointer text-white pointer-events-auto"
          drag
          dragMomentum={false}
          dragConstraints={constraintsRef}
          onDragStart={() => {
            hasDragged.current = true;
          }}
          onDragEnd={() => {
            setTimeout(() => {
              hasDragged.current = false;
            }, 50);
          }}
          onClick={handleTap}
          style={{ bottom: 30, left: 300 }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={expanded ? "expanded" : "collapsed"}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0.5 }}
              transition={{ duration: 0.1 }}
            >
              {expanded ? (
                <AvatarGuideExpanded showText={showText} />
              ) : (
                <AvatarGuide />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
        )
      }

    </div>
  );
};

export default GuideBox;
