import styled from "styled-components";

export const RichTextEditorContainer = styled.div<{
  $hasError?: boolean;
  $disabled?: boolean;
}>`
  border: 1px solid
    ${({ $hasError }) =>
      $hasError ? "var(--error-500)" : "var(--border)"};
  border-radius: var(--radius-md);
  background: white;
  overflow: hidden;
  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};

  &:focus-within {
    border-color: ${({ $hasError }) =>
      $hasError ? "var(--error-500)" : "var(--primary-500)"};
    box-shadow: 0 0 0 3px
      ${({ $hasError }) =>
        $hasError ? "var(--error-100)" : "var(--primary-100)"};
  }
`;

export const RichTextToolbar = styled.div`
  display: flex;
  gap: 0.25rem;
  padding: 0.5rem;
  border-bottom: 1px solid var(--border);
  background: var(--background-secondary);
`;

export const ToolbarButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  background: none;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: var(--gray-200);
    color: var(--text-primary);
  }

  &:active:not(:disabled) {
    background: var(--gray-300);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const RichTextContent = styled.div<{ $hasError?: boolean }>`
  min-height: 200px;
  max-height: 500px;
  overflow-y: auto;
  padding: 1rem;
  font-size: 1rem;
  line-height: 1.6;
  color: var(--text-primary);
  outline: none;

  &[contenteditable="true"]:empty:before {
    content: attr(data-placeholder);
    color: var(--text-muted);
    pointer-events: none;
  }

  p {
    margin: 0 0 0.75rem 0;

    &:last-child {
      margin-bottom: 0;
    }
  }

  h1,
  h2,
  h3 {
    margin: 0 0 0.75rem 0;
    font-weight: 600;
  }

  h2 {
    font-size: 1.5rem;
  }

  ul,
  ol {
    margin: 0 0 0.75rem 0;
    padding-left: 2rem;
  }

  li {
    margin-bottom: 0.5rem;
  }

  strong {
    font-weight: 600;
  }

  em {
    font-style: italic;
  }

  u {
    text-decoration: underline;
  }

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: var(--background-secondary);
  }

  &::-webkit-scrollbar-thumb {
    background: var(--gray-300);
    border-radius: 4px;

    &:hover {
      background: var(--gray-400);
    }
  }
`;

