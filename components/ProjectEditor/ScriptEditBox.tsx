
import { Annotation } from '@/store/slices/editorSlice'
import React, { useState } from 'react'

const ScriptEditBox = ({annotation}:{annotation: Annotation}) => {

   const [script, setScript] = useState(annotation.script) 


  return (
    <div className="flex flex-col w-full rounded-xl shadow-lg bg-white p-3">
          <textarea
          value={script!}
          onChange={(e) => setScript(e.target.value)}
          placeholder="Your Annotation Script will be shown here"
          className="h-[130px] flex-grow resize-none text-md scrollbar-clean font-medium font-mono text-gray-700 px-4 py-3 border border-gray-200 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 overflow-y-auto"
        />
    </div>
  )
}

export default ScriptEditBox