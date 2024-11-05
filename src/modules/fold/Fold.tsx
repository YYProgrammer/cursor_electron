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

const Fold: React.FC = () => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const sampleData: FileNode[] = [
    {
      name: 'src',
      type: 'folder',
      children: [
        {
          name: 'components',
          type: 'folder',
          children: [
            { name: 'Button.tsx', type: 'file' },
            { name: 'Input.tsx', type: 'file' },
          ],
        },
        {
          name: 'pages',
          type: 'folder',
          children: [
            { name: 'Home.tsx', type: 'file' },
            { name: 'About.tsx', type: 'file' },
          ],
        },
        { name: 'App.tsx', type: 'file' },
      ],
    },
  ];

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
    <StyledTree>
      {sampleData.map((node) => renderNode(node, node.name))}
    </StyledTree>
  );
};

export default Fold;
