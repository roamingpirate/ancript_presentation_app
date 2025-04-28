"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { UploadCloudIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import FileUploadProgress from "./FileUploadProgress";
import { getPresignedUrlForFileUpload } from "@/app/actions/getFileUploadUrl";
import addFile from "@/app/actions/addFile";
import { getFilesList } from "@/app/actions/getFilesList";
import { useSession } from "next-auth/react";
import createProject from "@/app/actions/createProject";
import { convertPptToPdf } from "@/app/actions/convertPptToPdf";
import { useFolder } from "@/context/FolderContext";


interface UploadedFile {
    fileId: string;
    fileName: string;
    location: string;
    dateOfCreation: string;
    fileType: string;
}

const NewProjectModal: React.FC = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const isOpen = searchParams.get("createProject") === "true";

    const [file, setFile] = useState<File | null>(null);
    const [uploadStatus, setUploadStatus] = useState(-1);
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
    const session = useSession();
    const userId = session?.data?.user?.id || null;
    const projectFolderId = searchParams.get("folder") || userId;


    useEffect(() => {
        if (isOpen && userId) {
            getFilesList(userId).then(setUploadedFiles);
        }
    }, [uploadStatus,isOpen,userId]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    useEffect(() => {
        if (file !== null) {
            uploadFile();
        }
    }, [file]);


    const uploadFile = async () => {
        if (!file) return alert("Please select a file.");
        setUploadStatus(0);
        console.log("Uploading file...");
    
        try {
            let fileType = file.type;
            let uploadedFileKey; 

            // upload the file
            const { uploadUrl, fileKey } = await getPresignedUrlForFileUpload(file.name, fileType);
            uploadedFileKey = fileKey;
            const uploadResponse = await fetch(uploadUrl, {
                method: "PUT",
                body: file,
                headers: { "Content-Type": fileType },
            });

            if(!uploadResponse.ok) throw new Error("Failed to upload file");


            if (fileType.includes("presentation")) {
                 // converts ppt to pdf and uploads it to server
                 console.log("Converting PPT to PDF...");
                 const pdfFileKey = await convertPptToPdf(uploadedFileKey);
                 uploadedFileKey = pdfFileKey; 
                 console.log("PPT converted to PDF and uploaded successfully.");
            }


            // Adding Entry in File Table
            const fileData = await addFile(file.name, uploadedFileKey, fileType);
            setSelectedFileId(fileData.fileId);
            setUploadStatus(1);

        } catch (error) {
            console.error("Upload error", error);
            setUploadStatus(2);
        }
    };
    
    
    const createProjectFromSelectedFile = async () => {
        if (!selectedFileId || !projectFolderId) {
            console.log("No file selected");
            return;
        }
    
        try {
            const projectDetails = await createProject(selectedFileId, projectFolderId);
    
            if (projectDetails?.projectId) {
                // Modify the browser history to remove the query param without causing a page reload
                const url = new URL(window.location.href);
                url.searchParams.delete("createProject");
                window.history.replaceState({}, "", url.toString());
    
                // Navigate to the new project page
                router.push(`/project/editor/${projectDetails.projectId}`);
            } else {
                console.error("Project creation failed. No projectId returned.");
            }
        } catch (error) {
            console.error("Error creating project:", error);
        }
    };
    
    
    

    const handleRowClick = (fileId: string) => {
        setSelectedFileId((prev) => (prev === fileId ? null : fileId));
    };

    const closeModal = () => {
        const newParams = new URLSearchParams(window.location.search);
        newParams.delete("createProject");
        router.replace(`?${newParams.toString()}`, { scroll: false });
    };    

    if (!isOpen) return null;
    if (userId === null) return null;


    return (
        <div className="z-10 fixed inset-0 flex items-center justify-center font-worksans bg-gray-900 bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white w-[530px] h-[700px] rounded-2xl shadow-lg p-6 relative">
                <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">✖</button>
                <h2 className="text-xl font-semibold mb-2">Create New Project</h2>
                <p className="font-mono text-sm text-gray-600">Upload a PPT or PDF file to create your project.</p>

                <div className={`mt-4 flex flex-col items-center justify-center w-full border border-dashed border-gray-400 rounded-lg cursor-pointer 
                     ${uploadStatus !== -1 ? 'h-[350px]' : uploadedFiles.length === 0 ? ' h-[480px]' : 'h-[150px] hover:bg-blue-50'}`}>
                    {uploadStatus === -1 ? (
                        <label className="flex flex-col items-center justify-center cursor-pointer">
                            <input type="file" className="hidden" accept=".pdf,.ppt,.pptx" onChange={handleFileChange} />
                            <UploadCloudIcon strokeWidth={1} size={50} />
                            <p className="mt-2 font-medium">Upload PPT or PDF from device</p>
                        </label>
                    ) : (
                        <FileUploadProgress uploadStatus={uploadStatus} setUploadStatus={setUploadStatus} uploadFile={uploadFile} createProjectFromSelectedFile={createProjectFromSelectedFile}/>
                    )}
                </div>

                {uploadStatus === -1 && uploadedFiles.length > 0 && (
                    <>
                        <div className="flex justify-center my-4">
                            <p className="font-mono text-gray-400 font-light text-lg">OR</p>
                        </div>
                        <p className="text-[16px] font-worksans text-gray-800 font-light mb-2">Select from Recent Uploads</p>
                        <div className="overflow-y-auto max-h-[236px] relative">
                            <table className="w-full border-collapse">
                                <thead className="top-0 bg-white shadow-sm border-b">
                                    <tr className="text-left text-sm">
                                        <th className="p-2 w-10"></th>
                                        <th className="p-2">File</th>
                                        <th className="p-2">Type</th>
                                        <th className="p-2">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {uploadedFiles.map((file) => (
                                        <tr
                                            key={file.fileId}
                                            className={`cursor-pointer text-sm hover:bg-blue-50 ${selectedFileId === file.fileId ? 'border-2 border-blue-300' : ''}`}
                                            onClick={() => handleRowClick(file.fileId)}
                                        >
                                            <td className="p-4 text-center">
                                                <input type="checkbox" checked={selectedFileId === file.fileId} readOnly />
                                            </td>
                                            <td className="py-4 px-2 flex items-center gap-2 w-[250px] overflow-hidden text-ellipsis whitespace-nowrap">
                                                <span className="text-[30px]">📁</span>
                                                <span className="overflow-hidden text-ellipsis whitespace-nowrap block w-full">{file.fileName}</span>
                                            </td>
                                            <td className="py-4 px-2">
                                                <span className={`px-2 py-1 rounded-full text-xs ${file.fileType === 'application/ppt' ? 'bg-blue-300 text-blue-900' : 'bg-purple-100 text-purple-900'}`}>
                                                    {file.fileType === 'application/pdf' ? 'pdf' : 'ppt'}
                                                </span>
                                            </td>
                                            <td className="p-4">{new Date(file.dateOfCreation).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex justify-end gap-4 mt-14">
                            <button
                                className="px-4 py-2 text-sm border border-gray-300 text-gray-600 rounded-md hover:bg-gray-100"
                                onClick={closeModal}
                            >
                                Close
                            </button>
                            <button
                                className={`px-4 py-2 rounded-md text-white text-sm
                                    ${selectedFileId ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-300 cursor-not-allowed'}`}
                                disabled={!selectedFileId}
                                onClick={createProjectFromSelectedFile}
                            >
                                Continue
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default NewProjectModal;

