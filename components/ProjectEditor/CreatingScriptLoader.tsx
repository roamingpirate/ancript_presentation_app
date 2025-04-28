import { useEffect, useState } from "react";
import Image from "next/image";

const CreatingScriptLoader = () => {
  const messages = [
    "Crafting your perfect script...",
    "Thinking deeply like a writer...",
    "Assembling words with precision...",
    "Making magic with your content...",
    "Finalizing the details for brilliance..."
  ];

  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 8000); // Change message every 8 seconds

    return () => clearInterval(interval); // Clean up
  }, []);

  return (
    <div className="flex flex-col items-center mb-[43px] justify-center w-full h-[150px] rounded-xl shadow-md bg-white p-4 font-worksans animate-fade-in">
      <Image src="/loader.gif" height={60} width={60} alt="Loading" />
      <p className="mt-4 text-sm text-gray-700 font-medium transition-opacity duration-500 ease-in-out text-center">
        {messages[messageIndex]}
      </p>
    </div>
  );
};

export default CreatingScriptLoader;
