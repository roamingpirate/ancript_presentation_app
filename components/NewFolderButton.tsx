"use client";

import addFolder from "@/app/actions/addFolder";
import { useFolder } from "@/context/FolderContext";
import { PlusIcon } from "lucide-react";
import { useFormStatus } from "react-dom";


const NewFolderButton = ({parentFolderId}:{parentFolderId: string}) => {
  const {updateFoldersList} = useFolder();
  return (
    <form action={async () => {await addFolder(parentFolderId); updateFoldersList();}}>
      <SubmitButton />
    </form>
  );
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="flex border-[0.5px] rounded-lg border-gray-300 px-2 py-1.5 justify-center items-center space-x-1 cursor-pointer hover:bg-gray-100 transition disabled:opacity-50"
      disabled={pending}
    >
      <PlusIcon size={18} strokeWidth={2} />
      <p className="text-[14px] font-worksans font-medium">
        {pending ? "Creating..." : "New Folder"}
      </p>
    </button>
  );
}

export default NewFolderButton;
