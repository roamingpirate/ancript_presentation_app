import { updateProjectName } from '@/app/actions/updateProjectName';
import { Project } from '@/types/types';
import { EditIcon } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';

const ProjectNameField = ({ project }: { project: Project }) => {
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(project.projectName);
  const inputRef = useRef<HTMLInputElement>(null);

  const editProjectName = () => {
    setEditMode(false);
    updateProjectName(project.projectId, name);
  };

  useEffect(() => {
    if (editMode && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editMode]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      editProjectName();
    }
  };

  return (
    <div className="">
      {editMode ? (
        <input
          ref={inputRef}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => editProjectName()}
          className="border-b border-gray-400 p-[2px] outline-none w-full"
        />
      ) : (
        <div
          onClick={() => setEditMode(true)}
          className="group/project flex space-x-1 cursor-text border-b-2 items-center border-transparent hover:border-gray-400 border-dashed"
        >
          <p className="text-sm font-medium">{name}</p>
          <EditIcon size={15} strokeWidth={2} className="hidden group-hover/project:block" />
        </div>
      )}
    </div>
  );
};

export default ProjectNameField;
