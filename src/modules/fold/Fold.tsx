import React, { useState } from 'react';
import { FaFolder, FaFolderOpen, FaFile } from 'react-icons/fa';
import styled from 'styled-components';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
}

const StyledTree = styled.div`
  padding: 20px;
  color: #333;
`;

const StyledFile = styled.div`
  padding: 5px 8px;
  display: flex;
  align-items: center;
  cursor: pointer;
  &:hover {
    background-color: #e8e8e8;
  }
`;

const StyledFolder = styled.div`
  padding-left: 20px;
`;

const FolderLabel = styled.div`
  padding: 5px 8px;
  display: flex;
  align-items: center;
  cursor: pointer;
  &:hover {
    background-color: #e8e8e8;
  }
`;

const EmptyState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  border: 2px dashed #ccc;
  border-radius: 8px;
  color: #666;
  margin: 20px;
`;

const Fold: React.FC = () => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const items = e.dataTransfer.items;
    if (items) {
      const item = items[0];
      if (item.kind === 'file') {
        const entry = item.webkitGetAsEntry();
        if (entry && entry.isDirectory) {
          const tree = await readDirectory(entry);
          setFileTree([tree]);
        }
      }
    }
  };

  const readDirectory = async (entry: any): Promise<FileNode> => {
    return new Promise((resolve) => {
      const reader = entry.createReader();
      const node: FileNode = {
        name: entry.name,
        type: entry.isDirectory ? 'folder' : 'file',
        children: [],
      };

      const readEntries = async () => {
        reader.readEntries(async (entries: any[]) => {
          if (entries.length === 0) {
            resolve(node);
            return;
          }

          const childPromises = entries.map((childEntry) => {
            if (childEntry.isDirectory) {
              return readDirectory(childEntry);
            }
            const fileNode: FileNode = {
              name: childEntry.name,
              type: 'file',
              children: undefined
            };
            return Promise.resolve(fileNode);
          });

          node.children = await Promise.all(childPromises);
          resolve(node);
        });
      };

      readEntries();
    });
  };

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const renderNode = (node: FileNode, path: string) => {
    if (node.type === 'file') {
      return (
        <StyledFile key={path}>
          <FaFile style={{ marginRight: '8px' }} />
          {node.name}
        </StyledFile>
      );
    }

    const isExpanded = expandedFolders.has(path);
    return (
      <div key={path}>
        <FolderLabel onClick={() => toggleFolder(path)}>
          {isExpanded ? (
            <FaFolderOpen style={{ marginRight: '8px' }} />
          ) : (
            <FaFolder style={{ marginRight: '8px' }} />
          )}
          {node.name}
        </FolderLabel>
        {isExpanded && node.children && (
          <StyledFolder>
            {node.children.map((child) =>
              renderNode(child, `${path}/${child.name}`)
            )}
          </StyledFolder>
        )}
      </div>
    );
  };

  return (
    <StyledTree
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{ 
        backgroundColor: isDragging ? '#f0f0f0' : 'transparent',
        transition: 'background-color 0.2s'
      }}
    >
      {fileTree.length > 0 ? (
        fileTree.map((node) => renderNode(node, node.name))
      ) : (
        <EmptyState>请拖入文件夹</EmptyState>
      )}
    </StyledTree>
  );
};

export default Fold;
