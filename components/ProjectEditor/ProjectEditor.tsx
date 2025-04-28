"use client"
import { getFile } from '@/app/actions/getFile';
import { getFileDownloadUrl } from '@/app/actions/getFileDownloadUrl';
import { Project, UploadedFile } from '@/types/types'
import React, { useEffect, useState } from 'react'
import TopBar from './TopBar';
import SideBarRight from './SideBarRight';
import SideBarLeft from './SideBarLeft';
import { pdfjs } from 'react-pdf';
import PageDisplayBox from './PageDisplayBox';
import GuideBox from './GuideBox';
import EditorModeBox from './EditorModeBox';
import { setAnnotations, setProjectId } from '@/store/slices/editorSlice';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { getAnnotations } from '@/app/actions/getAnnotations';
import { toast } from 'sonner';
import AnnotationDeleteModal from '../utils/AnnotationDeleteModal';
import DocumentLoadingScreen from './DocumentLoadingScreen';
import ExplanationCreationSection from './ExplanationCreationSection';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();


const ProjectEditor = ({projectDetails}:{projectDetails: Project}) => {

    const fileId = projectDetails.fileId;
    const [file, setFile] = useState<UploadedFile | null>(null);
    const [documentUrl, setDocumentUrl] = useState<string | null>();
    const [currentPageNumber, setCurrentPageNumber] = useState<number>(1);
    const projectId = projectDetails.projectId;
    const dispatch = useAppDispatch()
    const [pdfLoaded, setPdfLoaded] = useState(false);    

    useEffect(() => {
        const fetchFileData = async () => {
            const fileData = await getFile(projectDetails.fileId);
            setFile(fileData);
            //const url = await getFileDownloadUrl(fileData?.location!);
            const url = '/air.pdf'
            const res = await fetch(url);
            const blob = await res.blob()
            const doc_Url = URL.createObjectURL(blob)
            setDocumentUrl(doc_Url);
        };
        dispatch(setProjectId(projectDetails.projectId));
        fetchFileData();

        return () => {
          if (documentUrl) {
            URL.revokeObjectURL(documentUrl); 
          }
        }
    },[])

    useEffect(() => {
      const loadAnnotations = async () => {
        try {
          const result = await getAnnotations(projectId)    
          console.log(result)
          dispatch(setAnnotations(result))
        } catch (err) {
          console.error('Failed to fetch annotations:', err)
          toast.error('Could not load annotations.')
        }
      }
  
      loadAnnotations()
    }, [])


    if(documentUrl === null || documentUrl === undefined) {
      return (
        <DocumentLoadingScreen/>
      )
    }

  return (
    <div className='bg-gray-100 min-h-screen w-full overflow-y-auto'>
        <TopBar projectDetails={projectDetails}/>
        <SideBarLeft pdfUrl={documentUrl}/>
        <SideBarRight/>
        <PageDisplayBox documentUrl={documentUrl}/>
        <GuideBox/>
        <EditorModeBox/>
        <AnnotationDeleteModal/>
        <ExplanationCreationSection/>
    </div>
  )
}

export default ProjectEditor