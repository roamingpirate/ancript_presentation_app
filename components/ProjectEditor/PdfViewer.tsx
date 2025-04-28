"use client";
import { useState } from "react";
import { pdfjs , Document, Page} from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();



type Props = {
  fileUrl: string;
};

export default function PdfViewer({ fileUrl }: Props) {
  const [numPages, setNumPages] = useState<number | null>(null);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <div className="flex flex-col gap-4 items-center">
      <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess}>
        {Array.from(new Array(numPages), (el, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            scale={1.5}
            renderAnnotationLayer={false}
            renderTextLayer={true}
          />
        ))}
      </Document>
    </div>
  );
}
