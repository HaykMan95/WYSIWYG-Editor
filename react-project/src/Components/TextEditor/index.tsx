import { useRef, useState } from "react";

import "./styles.scss";
import { TextEditorHeader } from "./Header";

export const TextEditor = () => {
  const inputAreaRef = useRef<HTMLDivElement>(null);

  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const inputValue = history[historyIndex] || "";

  const updateInput = () => {
    if (inputAreaRef.current) {
      const content = inputAreaRef.current.innerHTML.trim();

      if (history[historyIndex] !== content) {
        const newHistory = history.slice(0, historyIndex + 1);
        setHistory([...newHistory, content]);
        setHistoryIndex(newHistory.length);
      }
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    const files = event.dataTransfer.files;

    if (files && files.length > 0) {
      const file = files[0];

      if (file.type.startsWith("image/")) {
        const reader = new FileReader();

        reader.onload = () => {
          if (reader.result) {
            insertImage(reader.result.toString());
          }
        };

        reader.readAsDataURL(file);
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const insertImage = (src: string) => {
    const selection = window.getSelection();
    if (!selection || !inputAreaRef.current) return;

    const img = document.createElement("img");
    img.src = src;
    img.style.maxWidth = "100px";

    if (selection.anchorNode) {
      const range = selection.getRangeAt(0);
      range.insertNode(img);

      range.setStartAfter(img);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      inputAreaRef.current.prepend(img);
    }
    updateInput();
  };

  return (
    <div className="container">
      <TextEditorHeader
        updateInput={updateInput}
        historyIndex={historyIndex}
        history={history}
        setHistoryIndex={setHistoryIndex}
      />
      <div
        data-testid="text-editor-container"
        className="container-input"
        contentEditable
        onInput={updateInput}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        ref={inputAreaRef}
      />

      <div className="container-preview">
        <b>Preview</b>

        <div
          data-testid="text-editor-preview"
          dangerouslySetInnerHTML={{ __html: inputValue }}
        />
      </div>
    </div>
  );
};
