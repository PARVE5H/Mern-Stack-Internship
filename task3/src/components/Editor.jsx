import React, { useEffect, useRef } from "react";
import { Box } from "@chakra-ui/react";
import Editor from "@monaco-editor/react";
import { ACTIONS } from "../Action";

const EditorArea = ({ socketRef, roomId }) => {
  const editorRef = useRef(null);
  const isRemoteChange = useRef(false);
  const defaultCode =
    '// Welcome to CodeSanvaad - A Real-Time Collaborative Code Editor (built on Monaco Editor)!\n// This is a Real time code collabrator editor\n\nfunction helloWorld() {\n  console.log("Hello, World!");\n  return "Monaco Editor with Dark Theme!";\n}\n\nhelloWorld(); \n\n\n\n\n\n\n\n\n\n //         Built with 💚 by Parvesh Bansal';

  useEffect(() => {
    const socket = socketRef;
    if (!socket) return;

    // Listen for initial sync (when joining a room)
    socket.on(ACTIONS.SYNC_CODE, ({ code }) => {
      isRemoteChange.current = true;
      editorRef.current.setValue(code);
    });

    // Listen for  real-time code change
    socket.on(ACTIONS.CODE_CHANGE, ({ code }) => {
      if (editorRef.current && code !== editorRef.current.getValue()) {
        isRemoteChange.current = true;
        editorRef.current.setValue(code);
      }
    });

    return () => {
      if (socket) {
        socket.off(ACTIONS.CODE_CHANGE);
        socket.off(ACTIONS.SYNC_CODE);
      }
    };
  }, [socketRef]);

  // ResizeObserver Error Handling
  useEffect(() => {
    const handleError = (e) => {
      if (
        e.message ===
        "ResizeObserver loop completed with undelivered notifications."
      ) {
        e.stopImmediatePropagation();
      }
    };

    window.addEventListener("error", handleError);

    return () => {
      window.removeEventListener("error", handleError);
    };
  }, []);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    // Custom dark theme
    monaco.editor.defineTheme("customDark", {
      base: "vs-dark", // Base theme
      inherit: true,
      rules: [
        { token: "comment", foreground: "6A9955", fontStyle: "italic" },
        { token: "keyword", foreground: "569CD6", fontStyle: "bold" },
        { token: "string", foreground: "CE9178" },
        { token: "number", foreground: "B5CEA8" },
        { token: "function", foreground: "DCDCAA" },
      ],
      colors: {
        "editor.background": "#1e1e1e",
        "editor.foreground": "#d4d4d4",
        "editor.lineHighlightBackground": "#2d2d30",
        "editor.selectionBackground": "#264f78",
        "editor.inactiveSelectionBackground": "#3a3d41",
        "editorCursor.foreground": "#ffffff",
        "editorLineNumber.foreground": "#858585",
        "editorLineNumber.activeForeground": "#c6c6c6",
      },
    });

    // Apply the custom theme
    monaco.editor.setTheme("customDark");

    // Handle window resize for editor layout
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (editor) {
          editor.layout();
        }
      }, 100);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
    };
  };

  const handleEditorChange = (value) => {
    if (isRemoteChange.current) {
      isRemoteChange.current = false; // reset flag after handling
      return;
    }
    if (socketRef) {
      socketRef.emit(ACTIONS.CODE_CHANGE, {
        roomId,
        code: value,
      });
    }
  };

  return (
    <Box height="100vh" width="100%" position="relative">
      <Editor
        width="100%"
        height="100%"
        language="javascript"
        defaultValue={defaultCode}
        onChange={handleEditorChange}
        theme="vs-dark"
        onMount={handleEditorDidMount}
        options={{
          automaticLayout: true,
          scrollBeyondLastLine: false,
          minimap: {
            enabled: true,
            side: "right",
            scale: 1,
          },
          fontSize: 16,
          fontFamily: "Fira Code, Consolas, Monaco, monospace",
          lineNumbers: "on",
          wordWrap: "on",
          cursorStyle: "line",
          cursorBlinking: "blink",
          renderWhitespace: "selection",
          bracketPairColorization: {
            enabled: true,
          },
          smoothScrolling: true,
          mouseWheelZoom: true,
          formatOnPaste: true,
          formatOnType: true,
          autoClosingBrackets: "always",
          autoClosingQuotes: "always",
          suggestOnTriggerCharacters: true,
          acceptSuggestionOnEnter: "on",
          tabCompletion: "on",
          padding: {
            top: 20,
            bottom: 20,
          },
        }}
      />
    </Box>
  );
};

export default EditorArea;
