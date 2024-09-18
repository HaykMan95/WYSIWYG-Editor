describe("Text Editor", () => {
  const selectText = (text) => {
    cy.window().then((win) => {
      const selection = win.getSelection();
      const range = document.createRange();
      const editor = win.document.querySelector(
        '[data-testid="text-editor-container"]',
      );

      range.setStart(editor.firstChild, text.indexOf(text));
      range.setEnd(editor.firstChild, text.indexOf(text) + text.length);
      selection.removeAllRanges();
      selection.addRange(range);
    });
  };

  const checkPreviewContains = (expectedHTML) => {
    cy.get('[data-testid="text-editor-preview"]').then(($editor) => {
      const selectedText = $editor[0].innerHTML;
      expect(selectedText).to.include(expectedHTML);
    });
  };

  beforeEach(() => {
    cy.visit("http://localhost:3000/");
  });

  it("should update preview when typing in the text editor", () => {
    const textToType = "Hello, Cypress!";
    cy.get('[data-testid="text-editor-container"]').type(textToType);

    cy.get('[data-testid="text-editor-preview"]').should("contain", textToType);
  });

  it("should add bold styles to selected text", () => {
    const textToType = "Bold Text";
    const boldHTML = '<span style="font-weight: bold;">Bold</span>';

    cy.get('[data-testid="text-editor-container"]').type(textToType);
    selectText("Bold");
    cy.get('[data-testid="text-editor-header-bold-button"]').click();

    checkPreviewContains(boldHTML);
  });

  it("should add italic styles to selected text", () => {
    const textToType = "Italic Text";
    const italicHTML = '<span style="font-style: italic;">Italic</span>';

    cy.get('[data-testid="text-editor-container"]').type(textToType);
    selectText("Italic");
    cy.get('[data-testid="text-editor-header-italic-button"]').click();

    checkPreviewContains(italicHTML);
  });
});
