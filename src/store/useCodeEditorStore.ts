import { CodeEditorState } from "./../types/index";
import { LANGUAGE_CONFIG } from "@/app/(root)/_constants";
import { create } from "zustand";
import { Monaco } from "@monaco-editor/react";

const getInitialState = () => {
  // if we're on the server, return default values
  if (typeof window === "undefined") {
    return {
      language: "javascript",
      fontSize: 16,
      theme: "vs-dark",
    };
  }

  // if we're on the client, return values from local storage bc localStorage is a browser API.
  const savedLanguage = localStorage.getItem("editor-language") || "javascript";
  const savedTheme = localStorage.getItem("editor-theme") || "vs-dark";
  const savedFontSize = localStorage.getItem("editor-font-size") || 16;

  return {
    language: savedLanguage,
    theme: savedTheme,
    fontSize: Number(savedFontSize),
  };
};

export const useCodeEditorStore = create<CodeEditorState>((set, get) => {
  const initialState = getInitialState();

  return {
    ...initialState,
    output: "",
    isRunning: false,
    error: null,
    editor: null,
    executionResult: null,

    getCode: () => get().editor?.getValue() || "",

    setEditor: (editor: Monaco) => {
      const savedCode = localStorage.getItem(`editor-code-${get().language}`);
      if (savedCode) editor.setValue(savedCode);

      set({ editor });
    },

    setTheme: (theme: string) => {
      localStorage.setItem("editor-theme", theme);
      set({ theme });
    },

    setFontSize: (fontSize: number) => {
      localStorage.setItem("editor-font-size", fontSize.toString());
      set({ fontSize });
    },

    setLanguage: (language: string) => {
      // Save current language code before switching
      const currentCode = get().editor?.getValue();
      if (currentCode) {
        localStorage.setItem(`editor-code-${get().language}`, currentCode);
      }

      localStorage.setItem("editor-language", language);

      set({
        language,
        output: "",
        error: null,
      });
    },

    runCode: async () => {
      const { language, getCode } = get();
      const code = getCode();

      if (!code) {
        set({ error: "Please enter some code" });
        return;
      }

      set({ isRunning: true, error: null, output: "" });

      try {
        const judge0LanguageId = LANGUAGE_CONFIG[language].judge0LanguageId;
        
        const isCustom = Boolean(process.env.NEXT_PUBLIC_JUDGE0_API_URL);
        const rapidApiKey = process.env.NEXT_PUBLIC_RAPIDAPI_KEY;
        
        let API_URL = "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true";
        let headers: Record<string, string> = {
          "Content-Type": "application/json",
        };

        if (isCustom) {
           API_URL = process.env.NEXT_PUBLIC_JUDGE0_API_URL!;
        } else if (rapidApiKey) {
           headers["x-rapidapi-host"] = "judge0-ce.p.rapidapi.com";
           headers["x-rapidapi-key"] = rapidApiKey;
        } else {
           API_URL = "http://localhost:2358/submissions?base64_encoded=false&wait=true";
        }

        const response = await fetch(API_URL, {
          method: "POST",
          headers,
          body: JSON.stringify({
            language_id: judge0LanguageId,
            source_code: code,
          }),
        });

        const data = await response.json();
        console.log("data back from judge0:", data);

        // Handle Rate Limits gracefully
        if (response.status === 429) {
          const errorMsg = data?.message || "Rate limit exceeded. Please wait a moment and try again.";
          set({ error: errorMsg, executionResult: { code, output: "", error: errorMsg } });
          return;
        }

        // API key or rate limit errors
        if (data.message) {
          set({ error: data.message, executionResult: { code, output: "", error: data.message } });
          return;
        }

        // Compilation error
        if (data.compile_output) {
          const error = data.compile_output;
          set({ error, executionResult: { code, output: "", error } });
          return;
        }

        // Runtime error
        if (data.stderr) {
           const error = data.stderr;
           set({ error, executionResult: { code, output: "", error } });
           return;
        }

        // Execution successful
        const output = data.stdout || "";
        
        set({
          output: output.trim(),
          error: null,
          executionResult: {
            code,
            output: output.trim(),
            error: null,
          },
        });
      } catch (error) {
        console.log("Error running code:", error);
        set({
          error: "Error running code",
          executionResult: { code, output: "", error: "Error running code" },
        });
      } finally {
        set({ isRunning: false });
      }
    },
  };
});

export const getExecutionResult = () => useCodeEditorStore.getState().executionResult;
