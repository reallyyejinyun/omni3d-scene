import React from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorAreaProps {
    value: string;
    language: 'html' | 'css';
    onChange: (value: string | undefined) => void;
    height?: string;
    showLabel?: boolean;
}

const CodeEditorArea: React.FC<CodeEditorAreaProps> = ({
    value,
    language,
    onChange,
    height = "100%",
    showLabel = true
}) => {
    return (
        <div className="flex-1 border-r border-white/5 bg-[#0f0f0f] relative" style={{ height }}>
            <Editor
                height="100%"
                language={language}
                theme="vs-dark"
                value={value}
                onChange={onChange}
                options={{
                    minimap: { enabled: false },
                    fontSize: 13,
                    padding: { top: 16 },
                    automaticLayout: true,
                    scrollBeyondLastLine: false,
                    lineNumbers: 'on',
                    tabSize: 2,
                    wordWrap: 'on'
                }}
                loading={<div className="flex items-center justify-center h-full text-xs text-gray-600">正在载入编辑器...</div>}
            />
            {showLabel && (
                <div className="absolute top-2 right-8 text-[9px] z-10 uppercase font-bold text-gray-600 tracking-widest pointer-events-none">
                    {language} MODE
                </div>
            )}
        </div>
    );
};

export default React.memo(CodeEditorArea);
