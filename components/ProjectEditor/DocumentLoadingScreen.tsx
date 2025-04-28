import React, { useEffect, useState } from 'react';

const loadingMessages = [
  "Getting things ready...",
  "Preparing your document...",
  "Almost there...",
  "Just a moment more..."
];

const DocumentLoadingScreen = () => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 5000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div className='flex flex-col justify-center items-center h-screen w-full bg-white space-y-6'>
      <div className='loader2 w-20 h-20'></div>
      <h2 className='text-xl font-medium font-worksans text-gray-700 transition-all duration-300 ease-in-out'>
        {loadingMessages[currentMessageIndex]}
      </h2>
    </div>
  );
};

export default DocumentLoadingScreen;
