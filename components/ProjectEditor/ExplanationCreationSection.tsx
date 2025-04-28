import React from 'react';
import AddExplanationBox from './AddExplanationBox';
import { useAppSelector } from '@/store/hook';
import AnnotationScriptEditbox from './AnnotationScriptEditbox';

const ExplanationCreationSection = () => {
    const selectedAnnotationId: string | null = useAppSelector((s) => s.editor.selectedAnnotationId);

    const currentSelectedAnnotation = useAppSelector((s) =>  s.editor.annotations.find((a) => a.annotationId == selectedAnnotationId));
    if (!currentSelectedAnnotation) return null;

    const currentStage = currentSelectedAnnotation.currentStage;

    if(currentStage === 1)
    {
        return <AddExplanationBox annotation={currentSelectedAnnotation} />;
    }

    if(currentStage === 2)
    {
        return <AnnotationScriptEditbox annotation={currentSelectedAnnotation} />;
    }


    return <AddExplanationBox annotation={currentSelectedAnnotation} />;
};

export default ExplanationCreationSection;
