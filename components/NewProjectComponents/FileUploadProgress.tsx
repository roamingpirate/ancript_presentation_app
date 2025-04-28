import { motion } from 'framer-motion';
import { Loader2, RotateCcw } from 'lucide-react';
import React from 'react';

const FileUploadProgress = ({ uploadStatus, setUploadStatus, uploadFile,createProjectFromSelectedFile }: { uploadStatus: number, setUploadStatus: React.Dispatch<React.SetStateAction<number>>, uploadFile: () => void, createProjectFromSelectedFile: ()=> void  }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex h-full flex-col items-center justify-center bg-white bg-opacity-95 rounded-2xl p-6"
    >
      {uploadStatus === 0 && (
        <>
          <img src="/uploadProgress.gif" className="w-auto h-24 my-10" alt="Uploading" />
          <p className="text-lg font-semibold text-gray-700">Your File is getting Uploaded...</p>
        </>
      )}

      {uploadStatus === 1 && (
        <>
          <img src="/uploadSuccess.gif" className="w-auto h-[150px]" alt="Success" />
          <p className="text-lg font-medium font-worksans text-green-700">File Uploaded Successfully!</p>
          <div className="flex gap-10 mt-6">
            <button
              className="px-4 py-2 text-sm border border-gray-400 hover:bg-gray-100 text-gray-700 rounded-md"
              onClick={() => setUploadStatus(-1)}
            >
              Back
            </button>
            <button onClick={createProjectFromSelectedFile} className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md">Continue</button>
          </div>
        </>
      )}

      {uploadStatus === 2 && (
        <>
          <img src="/uploadFail.png" className="w-auto h-24 my-10" alt="Failed" />
          <p className="text-lg font-medium font-worksans text-red-400">File Upload Failed!</p>
          <div className="flex gap-6 mt-6">
            <button
              className="px-4 py-2 text-sm border border-gray-400 text-gray-700 rounded-md"
              onClick={() => setUploadStatus(-1)}
            >
              Back
            </button>
            <button
              className="px-4 py-2 text-sm bg-red-500 text-white rounded-md flex items-center gap-2"
              onClick={() => { setUploadStatus(0); uploadFile(); }}
            >
              <RotateCcw size={14} /> Retry
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default FileUploadProgress;
