import React from 'react';
import Fold from './modules/fold/Fold';
import Chat from './modules/chat/Chat';
import Editor from './modules/editor/Editor';

const App: React.FC = () => {
  return (
    <div style={{
      display: 'flex',
      width: '100%',
      height: '100vh',
    }}>
      <div style={{ flex: 1 }}>
        <Fold />
      </div>
      <div style={{ flex: 1 }}>
        <Editor />
      </div>
      <div style={{ flex: 1 }}>
        <Chat />
      </div>
    </div>
  );
};

export default App;