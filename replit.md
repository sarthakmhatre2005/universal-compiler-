# CodeCompile - Multi-Language Online Compiler

## Overview
A professional real-time code compiler and execution platform supporting Python, JavaScript, and C++. Features live WebSocket-based output streaming, Monaco Editor integration, and a clean, distraction-free coding interface.

## Architecture

### Frontend
- **React** with TypeScript for type safety
- **Monaco Editor** for professional code editing experience
- **WebSocket** client for real-time output streaming
- **Wouter** for routing
- **Tailwind CSS** + **Shadcn UI** for beautiful, consistent design
- **Dark/Light mode** support with theme toggle

### Backend
- **Express.js** HTTP server
- **WebSocket Server** (ws library) for real-time communication
- **Code Executor Service** with process isolation
- **Security Features**:
  - 10-second execution timeout
  - 1MB output size limit
  - Isolated temporary file execution
  - Process spawning with resource constraints

### Supported Languages
1. **Python 3.11** - Direct execution
2. **JavaScript (Node.js 20)** - Direct execution
3. **C++ (GCC 11)** - Compile then execute

## Key Features
- ✅ Real-time code execution with live output
- ✅ Monaco Editor with syntax highlighting
- ✅ Support for stdin input
- ✅ Beautiful status indicators (running, completed, error, timeout)
- ✅ Execution time tracking
- ✅ Character count display
- ✅ Keyboard shortcuts (Ctrl/Cmd + Enter to run)
- ✅ Responsive design (desktop and mobile)
- ✅ Dark/Light theme support
- ✅ Security constraints (timeouts, output limits)

## File Structure
```
client/
  src/
    components/
      theme-toggle.tsx        # Theme switcher component
      ui/                     # Shadcn UI components
    hooks/
      use-theme.tsx           # Theme context and hook
    lib/
      languages.ts            # Language configurations
    pages/
      compiler.tsx            # Main compiler page
    App.tsx                   # App entry with routing
    index.css                 # Design tokens and utilities

server/
  executor.ts                 # Code execution service
  routes.ts                   # WebSocket server and routes
  
shared/
  schema.ts                   # Shared TypeScript types and validation
```

## User Workflow
1. User selects a programming language from dropdown
2. Writes or pastes code in Monaco Editor
3. (Optional) Provides stdin input in Input tab
4. Clicks "Run Code" or uses Ctrl/Cmd + Enter
5. WebSocket connection established to backend
6. Code executed in isolated process with timeout
7. Output streamed in real-time to Output tab
8. Status badge shows execution state
9. Execution time displayed in status bar

## WebSocket Protocol
**Client → Server:**
```json
{
  "language": "python" | "javascript" | "cpp",
  "code": "print('Hello')",
  "stdin": "optional input"
}
```

**Server → Client (streaming):**
```json
{
  "type": "output",
  "content": "Hello\n"
}
```

**Server → Client (final):**
```json
{
  "type": "result",
  "status": "completed" | "error" | "timeout",
  "executionTime": 123.45,
  "success": true
}
```

## Design Philosophy
Following VS Code, Replit, and LeetCode patterns:
- Clean, distraction-free interface
- Developer-focused color scheme (dark mode primary)
- Professional typography (Inter + JetBrains Mono)
- Minimal animations, maximum functionality
- High contrast for accessibility
- Responsive 60/40 split-pane layout

## Recent Changes
- 2025-10-23: Initial implementation with Python, JavaScript, C++ support
- Full WebSocket integration for real-time output
- Monaco Editor with syntax highlighting
- Theme toggle support
- Security constraints implemented

## Development Notes
- Monaco Editor configured with no minimap for cleaner UI
- WebSocket path: `/ws` (separate from Vite HMR)
- Temporary files created in system temp directory
- Automatic cleanup after execution
- Status bar shows language version, execution time, char count
