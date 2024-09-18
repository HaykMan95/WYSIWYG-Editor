import { useRef } from "react";

const FONTS = [
  { fontName: "Gowun Batang", id: 1, style: '"Gowun Batang", serif' },
  {
    fontName: "Protest Guerrilla",
    id: 2,
    style: '"Protest Guerrilla", sans-serif',
  },
  { fontName: "Sofadi One", id: 3, style: '"Sofadi One", system-ui' },
  { fontName: "Work Sans", id: 4, style: '"Work Sans", sans-serif' },
];

const COLORS = [
  { colorCode: "#FF5733", id: 1, name: "Sunset Orange" },
  { colorCode: "#33FF57", id: 2, name: "Lime Green" },
  { colorCode: "#3357FF", id: 3, name: "Sky Blue" },
  { colorCode: "#F1C40F", id: 4, name: "Sunflower Yellow" },
  { colorCode: "#9B59B6", id: 5, name: "Amethyst Purple" },
  { colorCode: "#E74C3C", id: 6, name: "Coral Red" },
  { colorCode: "#3498DB", id: 7, name: "Ocean Blue" },
  { colorCode: "#2ECC71", id: 8, name: "Emerald Green" },
  { colorCode: "#E67E22", id: 9, name: "Pumpkin Orange" },
  { colorCode: "#1ABC9C", id: 10, name: "Turquoise" },
  { colorCode: "#FF6347", id: 11, name: "Tomato Red" },
  { colorCode: "#40E0D0", id: 12, name: "Turquoise Blue" },
  { colorCode: "#FF1493", id: 13, name: "Deep Pink" },
  { colorCode: "#7FFF00", id: 14, name: "Chartreuse" },
  { colorCode: "#FFD700", id: 15, name: "Gold" },
  { colorCode: "#8A2BE2", id: 16, name: "Blue Violet" },
  { colorCode: "#5F9EA0", id: 17, name: "Cadet Blue" },
  { colorCode: "#D2691E", id: 18, name: "Chocolate" },
  { colorCode: "#FF4500", id: 19, name: "Orange Red" },
  { colorCode: "#DA70D6", id: 20, name: "Orchid" },
  { colorCode: "#FF8C00", id: 21, name: "Dark Orange" },
  { colorCode: "#ADFF2F", id: 22, name: "Green Yellow" },
  { colorCode: "#F08080", id: 23, name: "Light Coral" },
  { colorCode: "#E6E6FA", id: 24, name: "Lavender" },
  { colorCode: "#FFFACD", id: 25, name: "Lemon Chiffon" },
];

interface TextEditorHeaderProps {
  historyIndex: number;
  updateInput: () => void;
  setHistoryIndex: (index: number) => void;
  history: string[];
}

export const TextEditorHeader = ({
  historyIndex,
  updateInput,
  setHistoryIndex,
  history,
}: TextEditorHeaderProps) => {
  const inputAreaRef = useRef<HTMLDivElement>(null);

  const canUndo = historyIndex >= 0;
  const canRedo = historyIndex < history.length - 1;

  const wrapSelection = (
    style: Partial<CSSStyleDeclaration>,
    isDiv?: boolean,
  ) => {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const contents = range.extractContents();

    const element = document.createElement(isDiv ? "div" : "span");
    Object.assign(element.style, style);

    element.appendChild(contents);
    range.insertNode(element);

    range.setStartAfter(element);
    selection.removeAllRanges();
    selection.addRange(range);
    updateInput();
  };

  const makeItalic = () => {
    wrapSelection({ fontStyle: "italic" });
  };

  const makeBold = () => {
    wrapSelection({ fontWeight: "bold" });
  };

  const makeUnderline = () => {
    wrapSelection({ textDecoration: "underline" });
  };

  const setFontSize = (size: number) => () => {
    wrapSelection({ fontSize: `${size}px` });
  };

  const undo = () => {
    const previousState = history[historyIndex - 1];
    setHistoryIndex(historyIndex - 1);
    if (inputAreaRef.current) {
      inputAreaRef.current.innerHTML = previousState || "";
    }
  };

  const redo = () => {
    const nextState = history[historyIndex + 1];
    setHistoryIndex(historyIndex + 1);
    if (inputAreaRef.current) {
      inputAreaRef.current.innerHTML = nextState || "";
    }
  };

  const leftAlign = () => {
    wrapSelection({ textAlign: "left" }, true);
  };

  const centerAlign = () => {
    wrapSelection({ textAlign: "center" }, true);
  };

  const rightAlign = () => {
    wrapSelection({ textAlign: "right" }, true);
  };

  const setColor = (colorCode: string) => () => {
    wrapSelection({ color: colorCode });
  };

  const setFont = (fontStyle: string) => () => {
    wrapSelection({ fontFamily: fontStyle });
  };

  return (
    <div className="container-header">
      <button
        data-testid="text-editor-header-bold-button"
        className="container-header-button"
        onClick={makeBold}
      >
        BOLD
      </button>
      <button
        data-testid="text-editor-header-italic-button"
        className="container-header-button"
        onClick={makeItalic}
      >
        ITALIC
      </button>
      <button className="container-header-button" onClick={makeUnderline}>
        UNDERLINE
      </button>

      <div className="container-header-group">
        <button
          className="container-header-button"
          onClick={undo}
          disabled={!canUndo}
        >
          {"<-"}
        </button>
        <button
          className="container-header-button"
          onClick={redo}
          disabled={!canRedo}
        >
          {"->"}
        </button>
      </div>

      <div className="container-header-group">
        <button className="container-header-button" onClick={leftAlign}>
          Left
        </button>
        <button className="container-header-button" onClick={centerAlign}>
          Center
        </button>
        <button className="container-header-button" onClick={rightAlign}>
          Right
        </button>
      </div>

      <div className="container-header-color-button">
        Color
        <div className="container-header-color-button-section">
          {COLORS.map(({ id, colorCode }) => (
            <button
              key={id}
              style={{
                backgroundColor: colorCode,
              }}
              onClick={setColor(colorCode)}
            />
          ))}
        </div>
      </div>

      <div className="container-header-color-button">
        FONTS
        <div className="container-header-color-button-section">
          {FONTS.map(({ id, fontName, style }) => (
            <button
              key={id}
              style={{
                fontFamily: style,
              }}
              onClick={setFont(style)}
            >
              {fontName}
            </button>
          ))}
        </div>
      </div>

      <div className="container-header-group">
        <button className="container-header-button" onClick={setFontSize(32)}>
          H1
        </button>
        <button className="container-header-button" onClick={setFontSize(28)}>
          H2
        </button>
        <button className="container-header-button" onClick={setFontSize(24)}>
          H3
        </button>
        <button className="container-header-button" onClick={setFontSize(20)}>
          H4
        </button>
        <button className="container-header-button" onClick={setFontSize(16)}>
          H5
        </button>
        <button className="container-header-button" onClick={setFontSize(14)}>
          H6
        </button>
      </div>
    </div>
  );
};
