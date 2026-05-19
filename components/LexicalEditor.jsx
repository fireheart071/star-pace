import React, { useEffect, useState } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, $getSelection, FORMAT_TEXT_COMMAND, SELECTION_CHANGE_COMMAND } from 'lexical';
import { INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND } from '@lexical/list';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { ListItemNode, ListNode } from '@lexical/list';
import { Bold, Italic, List, ListOrdered, Undo, Redo } from 'lucide-react';

const theme = {
  paragraph: 'lexical-paragraph',
  text: {
    bold: 'lexical-bold',
    italic: 'lexical-italic',
  },
  list: {
    ul: 'lexical-ul',
    ol: 'lexical-ol',
  },
};

function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);

  return (
    <div style={{ 
      display: 'flex', gap: 8, padding: '8px', borderBottom: '1px solid #E2E8F0',
      background: '#F8FAFC', borderTopLeftRadius: 8, borderTopRightRadius: 8
    }}>
      <ToolButton onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')} active={isBold}><Bold size={16} /></ToolButton>
      <ToolButton onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')} active={isItalic}><Italic size={16} /></ToolButton>
      <div style={{ width: 1, background: '#E2E8F0', margin: '0 4px' }} />
      <ToolButton onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}><List size={16} /></ToolButton>
      <ToolButton onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}><ListOrdered size={16} /></ToolButton>
      <div style={{ width: 1, background: '#E2E8F0', margin: '0 4px' }} />
      <ToolButton onClick={() => editor.dispatchCommand('undo', undefined)}><Undo size={16} /></ToolButton>
      <ToolButton onClick={() => editor.dispatchCommand('redo', undefined)}><Redo size={16} /></ToolButton>
    </div>
  );
}

function ToolButton({ children, onClick, active }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: 'none', background: active ? '#24276F' : 'transparent', color: active ? '#fff' : '#64748B',
        borderRadius: 6, cursor: 'pointer', transition: '0.2s'
      }}
    >
      {children}
    </button>
  );
}

export default function LexicalEditor({ initialValue, onChange }) {
  const initialConfig = {
    namespace: 'AtlasEditor',
    theme,
    onError: (error) => console.error(error),
    nodes: [ListNode, ListItemNode],
  };

  return (
    <div style={{ border: '1px solid #E2E8F0', borderRadius: 8, overflow: 'hidden' }}>
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin />
        <div style={{ position: 'relative', background: '#fff' }}>
          <div style={{ maxHeight: '450px', overflowY: 'auto' }} className="no-scrollbar">
            <RichTextPlugin
              contentEditable={<ContentEditable style={{ 
                minHeight: 240, padding: '16px', outline: 'none', fontSize: 14, lineHeight: 1.6, color: '#0F172A' 
              }} />}
              placeholder={<div style={{ position: 'absolute', top: 16, left: 16, color: '#94A3B8', pointerEvents: 'none', fontSize: 14 }}>Enter your narrative...</div>}
            />
          </div>
          <HistoryPlugin />
          <ListPlugin />
          <TabIndentationPlugin />
          <OnChangePlugin onChange={(editorState, editor) => {
            editorState.read(() => {
              const html = $generateHtmlFromNodes(editor);
              const text = $getRoot().getTextContent();
              onChange({ html, text });
            });
          }} />
          <InitialValuePlugin value={initialValue} />
        </div>
      </LexicalComposer>

      <style jsx global>{`
        .lexical-paragraph { margin: 0 0 8px; }
        .lexical-bold { font-weight: bold; }
        .lexical-italic { font-style: italic; }
        .lexical-ul { padding-left: 24px; list-style-type: disc; margin: 8px 0; }
        .lexical-ol { padding-left: 24px; list-style-type: decimal; margin: 8px 0; }
      `}</style>
    </div>
  );
}

function InitialValuePlugin({ value }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // Only set initial value once when editor is ready and we have a value
    if (value) {
      editor.update(() => {
        const root = $getRoot();
        // Only populate if empty to avoid overwriting ongoing edits
        if (root.getTextContentSize() === 0) {
          const parser = new DOMParser();
          const dom = parser.parseFromString(value, 'text/html');
          const nodes = $generateNodesFromDOM(editor, dom);
          root.clear();
          root.append(...nodes);
        }
      });
    }
  }, [value, editor]);

  return null;
}
