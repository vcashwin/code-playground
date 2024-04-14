import { useRef, useState, useEffect } from "react";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

export const Editor = ({ startingCode }: { startingCode: string }) => {
  const [editor, setEditor] =
    useState<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoEl = useRef(null);

  useEffect(() => {
    if (monacoEl) {
      setEditor((editor) => {
        if (editor) return editor;

        const newEditor = monaco.editor.create(monacoEl.current!, {
          value: startingCode,
          language: "javascript",
        });
        newEditor.updateOptions({
          fontSize: 16,
          mouseWheelZoom: true,
        });
        return newEditor;
      });
    }

    return () => editor?.dispose();
  }, [monacoEl.current]);

  return <div className="h-full w-full overflow-auto" ref={monacoEl}></div>;
};
