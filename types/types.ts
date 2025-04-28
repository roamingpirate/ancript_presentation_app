
export type Folder = {
    folderId: string;
    folderName: string;
    folderCreationDate: string;
    itemsCount: number;
    parentFolderId: string | null;
    userId: string;
  };
  
export type Project = {
    projectId: string;
    fileId: string;
    folderId: string;
    projectName: string;
    creationDate: string;
    pagesProcessedStatus: string;
    pagesProcessProgress: number;
    userId: string;
}

  export type UploadedFile = {
    fileId: string;
    fileName: string;
    location: string;
    dateOfCreation: string;
    userId: string;
    imagesExtracted: boolean;
    imagesIdArray: string[];
    fileType: string;
};



export interface AnnotationExplanationDetails {
  annotationId: string
  pageNo: number
  currentStage : number
}

  