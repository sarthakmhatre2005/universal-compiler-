import { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Play, RotateCcw, Code2, Loader2, CheckCircle2, XCircle, Clock, FileCode2, Braces, Cog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTheme } from "@/hooks/use-theme";
import { LANGUAGES, getLanguageById } from "@/lib/languages";
import { type Language, type ExecutionResult } from "@shared/schema";

export default function Compiler() {
  const { theme } = useTheme();
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("python");
  const [code, setCode] = useState(getLanguageById("python").defaultCode);
  const [stdin, setStdin] = useState("");
  const [output, setOutput] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [executionStatus, setExecutionStatus] = useState<ExecutionResult["status"] | null>(null);
  const [activeTab, setActiveTab] = useState<"input" | "output">("output");
  const wsRef = useRef<WebSocket | null>(null);
  const editorRef = useRef<any>(null);

  const currentLanguage = getLanguageById(selectedLanguage);
  const charCount = code.length;

  const getLanguageIcon = (iconName: string) => {
    switch (iconName) {
      case "python":
        return <FileCode2 className="h-4 w-4" />;
      case "javascript":
        return <Braces className="h-4 w-4" />;
      case "cpp":
        return <Cog className="h-4 w-4" />;
      default:
        return <Code2 className="h-4 w-4" />;
    }
  };

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setSelectedLanguage(lang);
    const langInfo = getLanguageById(lang);
    setCode(langInfo.defaultCode);
    setOutput("");
    setExecutionStatus(null);
    setExecutionTime(null);
  };

  const handleRunCode = async () => {
    if (!code.trim()) return;

    setIsExecuting(true);
    setOutput("");
    setExecutionStatus("running");
    setActiveTab("output");

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          language: selectedLanguage,
          code,
          stdin,
        })
      );
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === "output") {
          setOutput((prev) => prev + data.content);
        } else if (data.type === "result") {
          setExecutionStatus(data.status);
          setExecutionTime(data.executionTime);
          setIsExecuting(false);
          
          if (data.error) {
            setOutput((prev) => prev + "\n" + data.error);
          }
        }
      } catch (err) {
        console.error("Failed to parse WebSocket message:", err);
      }
    };

    ws.onerror = () => {
      setOutput("Connection error. Please try again.");
      setExecutionStatus("error");
      setIsExecuting(false);
    };

    ws.onclose = () => {
      if (isExecuting) {
        setIsExecuting(false);
        if (executionStatus === "running") {
          setExecutionStatus("completed");
        }
      }
    };
  };

  const handleReset = () => {
    setCode(currentLanguage.defaultCode);
    setOutput("");
    setStdin("");
    setExecutionStatus(null);
    setExecutionTime(null);
  };

  const getStatusIcon = () => {
    switch (executionStatus) {
      case "running":
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case "completed":
        return <CheckCircle2 className="h-4 w-4" />;
      case "error":
        return <XCircle className="h-4 w-4" />;
      case "timeout":
        return <Clock className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (executionStatus) {
      case "running":
        return "bg-primary";
      case "completed":
        return "bg-success";
      case "error":
        return "bg-destructive";
      case "timeout":
        return "bg-warning";
      default:
        return "bg-muted";
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleRunCode();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [code, stdin, selectedLanguage]);

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 h-14 border-b bg-tertiary flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Code2 className="h-6 w-6 text-primary" />
          <h1 className="text-lg font-semibold" data-testid="text-app-title">
            CodeCompile
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-48" data-testid="select-language">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang.id} value={lang.id}>
                  <div className="flex items-center gap-2">
                    {getLanguageIcon(lang.icon)}
                    <span>{lang.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {lang.extension}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={handleRunCode}
            disabled={isExecuting || !code.trim()}
            data-testid="button-run"
            className="h-10 px-6"
          >
            {isExecuting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Run Code
              </>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={handleReset}
            data-testid="button-reset"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>

          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Panel */}
        <div className="w-full md:w-3/5 flex flex-col border-r">
          <div className="h-10 border-b bg-card px-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {currentLanguage.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {currentLanguage.extension}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              Ctrl/Cmd + Enter to run
            </span>
          </div>

          <div className="flex-1 relative">
            <Editor
              height="100%"
              language={currentLanguage.monacoLanguage}
              value={code}
              onChange={(value) => setCode(value || "")}
              theme={theme === "dark" ? "vs-dark" : "light"}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                tabSize: 2,
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 16, bottom: 16 },
                fontFamily: "var(--font-mono)",
              }}
              onMount={(editor) => {
                editorRef.current = editor;
              }}
            />
          </div>
        </div>

        {/* Input/Output Panel */}
        <div className="w-full md:w-2/5 flex flex-col bg-card">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="flex flex-col h-full">
            <TabsList className="h-10 w-full rounded-none border-b justify-start bg-transparent p-0">
              <TabsTrigger
                value="input"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                data-testid="tab-input"
              >
                Input (stdin)
              </TabsTrigger>
              <TabsTrigger
                value="output"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                data-testid="tab-output"
              >
                Output
              </TabsTrigger>
            </TabsList>

            <TabsContent value="input" className="flex-1 m-0 p-4 overflow-auto">
              <Textarea
                value={stdin}
                onChange={(e) => setStdin(e.target.value)}
                placeholder="Enter input for your program (stdin)..."
                className="min-h-full font-mono text-sm resize-none border-0 focus-visible:ring-0 p-0"
                data-testid="textarea-stdin"
              />
            </TabsContent>

            <TabsContent value="output" className="flex-1 m-0 overflow-hidden">
              <div
                className={`h-full p-4 overflow-auto font-mono text-sm whitespace-pre-wrap transition-all duration-200 ${
                  executionStatus === "error"
                    ? "border-l-4 border-destructive"
                    : executionStatus === "completed"
                    ? "border-l-4 border-success"
                    : ""
                }`}
                data-testid="text-output"
              >
                {output || (
                  <span className="text-muted-foreground italic">
                    Run your code to see output here...
                  </span>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Status Bar */}
      <footer className="h-8 border-t bg-secondary px-4 flex items-center justify-between text-xs">
        <div className="flex items-center gap-4">
          <span className="text-muted-foreground">
            {currentLanguage.name} {currentLanguage.version}
          </span>
          {executionStatus && (
            <div className="flex items-center gap-2">
              <Badge
                className={`${getStatusColor()} flex items-center gap-1`}
                data-testid={`badge-status-${executionStatus}`}
              >
                {getStatusIcon()}
                <span className="capitalize">{executionStatus}</span>
              </Badge>
            </div>
          )}
          {executionTime !== null && (
            <span className="text-muted-foreground" data-testid="text-execution-time">
              Execution time: {executionTime.toFixed(2)}ms
            </span>
          )}
        </div>
        <span className="text-muted-foreground" data-testid="text-char-count">
          {charCount} characters
        </span>
      </footer>
    </div>
  );
}
