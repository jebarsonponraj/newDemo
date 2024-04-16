"use client";
import { useState } from 'react'; 
import { useDropzone } from 'react-dropzone';

const DragAndDrop = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setUploadedFiles(acceptedFiles);
    },
  });
  
  const clearUploadedFiles = () => {
    setUploadedFiles([]);
  };
  
  console.log(uploadedFiles);

  return (
    <div className="flex flex-col items-center justify-center border-dotted border-2 border-gray-400 p-6" {...getRootProps()}>
      <input {...getInputProps()} />
      <div className="text-center">
        <p>Drag and drop files here or click to browse.</p>
        <ul className="mt-4">
          {uploadedFiles.map((file) => (
            <li key={file.name}>{file.name}</li>
          ))}
        </ul>
        {uploadedFiles.length > 0 && (
          <button 
            className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={clearUploadedFiles}
          >
            Clear Uploaded Files
          </button>
        )}
      </div>
    </div>
  );
};

export default DragAndDrop;
