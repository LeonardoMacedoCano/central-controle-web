import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { Accept, useDropzone } from 'react-dropzone';
import { Container } from '../';
import { FaEye, FaTrash, FaUpload } from 'react-icons/fa';

interface DragDropFileProps {
  onFileChange: (file: File | null) => void;
  acceptedFileFormats?: string[];
}

const DragDropFile: React.FC<DragDropFileProps> = ({ onFileChange, acceptedFileFormats }) => {
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      onFileChange(acceptedFiles[0]);
    }
  }, [onFileChange]);

  const accept: Accept | undefined = acceptedFileFormats && acceptedFileFormats.length > 0
    ? acceptedFileFormats.reduce((acc, format) => {
        acc[format] = [];
        return acc;
      }, {} as Accept)
    : undefined;

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept,
  });

  const removeFile = () => {
    setFile(null);
    onFileChange(null);
  };

  const viewFile = () => {
    if (file) {
      const url = URL.createObjectURL(file);
      window.open(url, '_blank');
    }
  };

  return (
    <Container 
      width="100%"
      padding="10px 0"
      margin="auto"
      backgroundColor="transparent"
    >
      <TesteContainer>
        <DropzoneContainer {...getRootProps()} isDragActive={isDragActive}>
          <input {...getInputProps()} />
          <DropzoneContent>
            <IconWrapper>
              <FaUpload />
            </IconWrapper>
            <p>Clique ou arraste arquivos aqui.</p>
            {acceptedFileFormats && acceptedFileFormats.length > 0 && (
              <p>Formatos aceitos: {acceptedFileFormats.join(', ')}</p>
            )}
          </DropzoneContent>
        </DropzoneContainer>
        {file && (
          <FileInfoContainer>
            <FileName>{file.name}</FileName>
            <ButtonContainer>
              <ActionButton onClick={viewFile}>
                <FaEye />
              </ActionButton>
              <ActionButton onClick={removeFile}>
                <FaTrash />
              </ActionButton>
            </ButtonContainer>
          </FileInfoContainer>
        )}
      </TesteContainer> 
    </Container>
  );
};

export default DragDropFile;

const TesteContainer = styled.div`
  width: 100%;
`;

const DropzoneContainer = styled.div`
  width: 100%;
  padding: 10px;
  text-align: center;
  cursor: pointer;
  background: transparent;
  color: ${({ theme }) => theme.colors.white};
  transition: all 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.white}10;
  }
`;

const DropzoneContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const IconWrapper = styled.div`
  font-size: 36px;
`;

const FileInfoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 10px;
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.colors.white};
  border-radius: 4px;
  background: transparent;
`;

const FileName = styled.span`
  color: ${({ theme }) => theme.colors.quaternary};
  margin-right: 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
`;

const ActionButton = styled.button`
  margin-left: 5px;
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.colors.quaternary};
  border-radius: 50%;
  cursor: pointer;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.quaternary};
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 5px;

  &:hover {
    opacity: 0.8;
  }
`;