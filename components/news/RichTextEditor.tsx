"use client";

import React, { useRef, useEffect } from "react";
import {
  RichTextEditorWrapper,
  RichTextEditorLabel,
  RichTextEditorContainer,
  RichTextToolbar,
  ToolbarButton,
  RichTextContent,
  RichTextEditorErrorMessage,
} from "./richTextEditorStyle";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Heading2,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  label?: string;
  required?: boolean;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Nhập nội dung...",
  error,
  disabled = false,
  label,
  required = false,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const savedSelectionRef = useRef<Range | null>(null);
  const isInternalUpdateRef = useRef(false);
  const lastValueRef = useRef<string>(value);

  useEffect(() => {
    // Only update if value changed from outside (not from user input)
    if (editorRef.current && !isInternalUpdateRef.current && editorRef.current.innerHTML !== value) {
      const wasFocused = document.activeElement === editorRef.current;
      const selection = window.getSelection();
      const range = selection && selection.rangeCount > 0 ? selection.getRangeAt(0).cloneRange() : null;
      
      editorRef.current.innerHTML = value || "";
      lastValueRef.current = value || "";
      
      if (wasFocused && editorRef.current && range) {
        // Restore cursor position if we had a valid range
        try {
          // Check if range is still valid
          if (range.startContainer && editorRef.current.contains(range.startContainer)) {
            selection?.removeAllRanges();
            selection?.addRange(range);
          } else {
            // If range is invalid, place cursor at end
            const newRange = document.createRange();
            const newSel = window.getSelection();
            newRange.selectNodeContents(editorRef.current);
            newRange.collapse(false);
            newSel?.removeAllRanges();
            newSel?.addRange(newRange);
          }
        } catch {
          // If range is invalid, place cursor at end
          const newRange = document.createRange();
          const newSel = window.getSelection();
          newRange.selectNodeContents(editorRef.current);
          newRange.collapse(false);
          newSel?.removeAllRanges();
          newSel?.addRange(newRange);
        }
      }
    }
    // Reset flag after sync
    isInternalUpdateRef.current = false;
  }, [value]);

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && editorRef.current?.contains(sel.anchorNode)) {
      savedSelectionRef.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    if (savedSelectionRef.current && editorRef.current) {
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(savedSelectionRef.current);
        editorRef.current.focus();
      }
    } else if (editorRef.current) {
      // If no selection, focus at the end
      editorRef.current.focus();
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(editorRef.current);
      range.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  };

  const execCommand = (command: string, value?: string, event?: React.MouseEvent) => {
    event?.preventDefault();
    
    // Save selection before button click
    saveSelection();
    
    // Small delay to ensure selection is saved
    setTimeout(() => {
      restoreSelection();
      
      // Execute command
      const success = document.execCommand(command, false, value);
      
      if (success) {
        // Update content after command
        updateContent();
        
        // Restore selection again after execCommand
        setTimeout(() => {
          restoreSelection();
        }, 10);
      }
    }, 10);
  };

  const updateContent = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      // Only update if content actually changed
      if (newContent !== lastValueRef.current) {
        isInternalUpdateRef.current = true;
        lastValueRef.current = newContent;
        onChange(newContent);
      }
    }
  };

  const handleEditorFocus = () => {
    // Track focus for selection management
  };

  const handleEditorBlur = () => {
    updateContent();
  };

  return (
    <RichTextEditorWrapper>
      {label && (
        <RichTextEditorLabel required={required}>
          {label}
          {required && <span className="required">*</span>}
        </RichTextEditorLabel>
      )}
      <RichTextEditorContainer $hasError={!!error} $disabled={disabled}>
        <RichTextToolbar onMouseDown={(e) => e.preventDefault()}>
          <ToolbarButton
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              saveSelection();
            }}
            onClick={(e) => execCommand("bold", undefined, e)}
            title="In đậm (Ctrl+B)"
            disabled={disabled}
          >
            <Bold size={16} />
          </ToolbarButton>
          <ToolbarButton
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              saveSelection();
            }}
            onClick={(e) => execCommand("italic", undefined, e)}
            title="In nghiêng (Ctrl+I)"
            disabled={disabled}
          >
            <Italic size={16} />
          </ToolbarButton>
          <ToolbarButton
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              saveSelection();
            }}
            onClick={(e) => execCommand("underline", undefined, e)}
            title="Gạch chân (Ctrl+U)"
            disabled={disabled}
          >
            <Underline size={16} />
          </ToolbarButton>
          <ToolbarButton
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              saveSelection();
            }}
            onClick={(e) => execCommand("insertUnorderedList", undefined, e)}
            title="Danh sách dấu đầu dòng"
            disabled={disabled}
          >
            <List size={16} />
          </ToolbarButton>
          <ToolbarButton
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              saveSelection();
            }}
            onClick={(e) => execCommand("insertOrderedList", undefined, e)}
            title="Danh sách đánh số"
            disabled={disabled}
          >
            <ListOrdered size={16} />
          </ToolbarButton>
          <ToolbarButton
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              saveSelection();
            }}
            onClick={(e) => execCommand("formatBlock", "<h2>", e)}
            title="Tiêu đề"
            disabled={disabled}
          >
            <Heading2 size={16} />
          </ToolbarButton>
        </RichTextToolbar>
        <RichTextContent
          ref={editorRef}
          contentEditable={!disabled}
          onInput={(e) => {
            e.preventDefault();
            updateContent();
          }}
          onBlur={handleEditorBlur}
          onFocus={handleEditorFocus}
          onMouseUp={saveSelection}
          onKeyUp={saveSelection}
          onSelect={saveSelection}
          suppressContentEditableWarning
          $hasError={!!error}
          data-placeholder={placeholder}
        />
      </RichTextEditorContainer>
      {error && <RichTextEditorErrorMessage>{error}</RichTextEditorErrorMessage>}
    </RichTextEditorWrapper>
  );
};

export default RichTextEditor;

