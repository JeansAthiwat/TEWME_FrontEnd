import { useState } from 'react';
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

const cn = (...inputs) => twMerge(clsx(inputs));

import { 
  FileText,
  Monitor,
  Code,
  Download
} from 'lucide-react';

const SupplementaryMaterial = ({ materials, className }) => {
  const [expandedId, setExpandedId] = useState(null);
  
  const getIconForType = (type) => {
    switch(type) {
      case 'pdf':
        return (
          <FileText size={20} stroke="red" />
        );
      case 'slides':
        return (
          <Monitor size={20} stroke="blue" />
        );
      case 'code':
        return (
          <Code size={20} stroke="#6366f1" />
        );
      default:
        return null;
    }
  };
  
  return (
    <div className='space-y-3'>
      <h3 className="text-xl font-semibold mb-4">Supplementary Materials</h3>
      {materials.map((material) => (
        <div 
          key={material.id} 
          className={clsx("rounded-xl transition-all duration-300", {
            'border border-red-200 bg-red-50': material.type === 'pdf',
            'border border-blue-200 bg-blue-50': material.type === 'slides',
            'border border-indigo-200 bg-indigo-50': material.type === 'code',
            'border border-gray-200 bg-white': !['pdf', 'slides', 'code'].includes(material.type) // Default color
          })}
        >
          <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => setExpandedId(expandedId === material.id ? null : material.id)}>
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">{getIconForType(material.type)}</div>
              <div>
                <h4 className="font-medium">{material.title}</h4>
                <p className="text-sm text-muted-foreground">{material.type} - {material.size}</p>
              </div>
            </div>
          </div>
          {expandedId === material.id && (
            <div className="px-4 pb-4">
              <p className="mb-3 text-sm text-muted-foreground">
                This {material.type} contains additional information.
              </p>
              {material.downloadUrl ? (
                <a href={material.downloadUrl} download className="flex items-center max-w-fit px-3 py-1.5 rounded-full bg-blue-500 text-white text-sm font-medium">
                  {<Download size={20} stroke="white" className='mr-1'/>}
                  Download
                </a>
              ) : (
                <p className="text-sm text-red-500">Download link not available</p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SupplementaryMaterial;