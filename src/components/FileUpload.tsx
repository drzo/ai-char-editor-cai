import { useDropzone } from 'react-dropzone';
import { toast } from 'react-hot-toast';
import { CharacterFile } from '../types/character';

interface FileUploadProps {
  onFileLoad: (data: CharacterFile) => void;
}

export function FileUpload({ onFileLoad }: FileUploadProps) {
  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    
    if (file.type === 'application/json') {
      const text = await file.text();
      try {
        const json = JSON.parse(text);
        onFileLoad(json);
        toast.success('Character file loaded successfully!');
      } catch (error) {
        toast.error('Invalid JSON file');
      }
    } else if (file.type === 'image/png') {
      // Handle PNG character cards
      const reader = new FileReader();
      reader.onload = () => {
        try {
          // Extract character data from PNG metadata
          // This will be implemented in the image utils
          toast.success('Character card loaded successfully!');
        } catch (error) {
          toast.error('Invalid character card');
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/json': ['.json'],
      'image/png': ['.png']
    },
    maxFiles: 1
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Upload Character</h2>
      <div 
        {...getRootProps()} 
        className={`border-4 border-dashed rounded-lg p-12 transition-colors ${
          isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
        }`}
      >
        <input {...getInputProps()} />
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="mt-1 text-sm text-gray-600">
            {isDragActive
              ? 'Drop the file here...'
              : 'Drop your character file here or click to browse'}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Supports JSON and PNG character cards
          </p>
        </div>
      </div>
    </div>
  );
}