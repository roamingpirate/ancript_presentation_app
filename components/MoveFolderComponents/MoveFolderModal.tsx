import React, { useState } from "react";
import FolderListView from "./FolderListView";
import { SessionProvider, useSession } from "next-auth/react";
import { Folder } from "@/types/types";
import moveFolder from "@/app/actions/moveFolder";
import { toast } from "react-hot-toast";
import { useFolder } from "@/context/FolderContext";

const MoveFolderModal = ({
  isOpen,
  onClose,
  folder,
}: {
  isOpen: boolean;
  onClose: () => void;
  folder: Folder;
}) => {
  if (!isOpen) return null;

  const session = useSession();
  const userId = session.data?.user.id;
  if (!userId) return null;

  const [selectedFolderId, setSelectedFolderId] = useState<string>(userId);
  const [isLoading, setIsLoading] = useState(false);
  const {updateFoldersList} = useFolder();
  const folderIdToMove = folder.folderId;

  const moveFolderOperation = async () => {
    setIsLoading(true);
    const success = await moveFolder(folder.folderId, selectedFolderId, folder.parentFolderId);
    console.log(success);
    if (success) {
      toast.success("Folder moved successfully!");
    } else {
      toast.error("Failed to move folder.");
    }
    updateFoldersList();
    setIsLoading(false);
    onClose();
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm"
    >
      <div className="bg-white w-[500px] h-[650px] shadow-lg rounded-lg p-6 relative">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-600 text-lg hover:text-gray-900"
          onClick={onClose}
        >
          ✕
        </button>

        {/* Modal Header */}
        <h2 className="text-xl font-semibold">Move Folder</h2>
        <p className="text-gray-600 mt-2">
          Select where you want to move this folder.
        </p>

        {/* Folder List */}
        <div className="overflow-y-auto h-[460px] mt-4">
          <FolderListView
            selectedFolderId={selectedFolderId}
            setSelectedFolderId={setSelectedFolderId}
            folderIdToMove = {folderIdToMove}
            userId={userId}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 p-3 mt-3">
          <button
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className={`px-4 py-2 bg-blue-600 text-white rounded-lg transition flex items-center justify-center ${
              isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
            onClick={moveFolderOperation}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              "Confirm"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoveFolderModal;
