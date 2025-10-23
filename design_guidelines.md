# Design Guidelines: Multi-Language Real-Time Code Compiler

## Design Approach: Developer Tool Reference-Based

**Primary References:** VS Code, Replit, CodePen, LeetCode
**Philosophy:** Clean, distraction-free coding environment optimized for focus and efficiency

## Core Design Elements

### A. Color Palette

**Dark Mode (Primary):**
- Background Primary: `222 23% 11%` (deep charcoal)
- Background Secondary: `222 20% 14%` (panel backgrounds)
- Background Tertiary: `222 18% 18%` (elevated elements, headers)
- Border: `222 10% 25%` (subtle panel dividers)
- Text Primary: `0 0% 95%`
- Text Secondary: `0 0% 70%`
- Success (code executed): `142 71% 45%`
- Error: `0 84% 60%`
- Warning (timeout): `38 92% 50%`
- Accent/Primary: `217 91% 60%` (blue for CTAs, active states)

**Light Mode (Secondary):**
- Background: `0 0% 98%`
- Panel backgrounds: `0 0% 100%`
- Borders: `220 13% 91%`
- Text: `222 47% 11%`

### B. Typography

**Fonts:**
- UI Text: Inter (Google Fonts) - weights 400, 500, 600
- Code Editor: JetBrains Mono (Google Fonts) - weights 400, 500 for code display
- Fallback: system-ui, -apple-system

**Scale:**
- Headings: text-lg (18px) font-semibold
- Body: text-sm (14px) 
- Code: text-sm with font-mono
- Labels: text-xs (12px) uppercase tracking-wide
- Button text: text-sm font-medium

### C. Layout System

**Spacing Primitives:** Use Tailwind units of 2, 3, 4, 6, 8
- Tight spacing: p-2, gap-2
- Standard spacing: p-4, gap-4, m-4
- Section spacing: p-6, py-8
- Never use spacing larger than 8 except for major layout sections

**Grid System:**
- Main container: max-w-7xl mx-auto
- Split-pane layout: 60/40 ratio (editor/output) on desktop
- Responsive breakpoints: Stack vertically below md (768px)

### D. Component Library

**1. Top Navigation Bar**
- Height: h-14
- Background: bg-tertiary with border-b
- Content: Logo (left), Language selector (center), Run/Execute button (right)
- Padding: px-4
- Sticky positioning: sticky top-0 z-50

**2. Language Selector**
- Dropdown with icon indicators for each language
- Selected state: Accent color background
- Options: Python, JavaScript, C++, Java, etc.
- Include execution mode toggle (Compile, Run, Compile+Run)

**3. Code Editor Panel**
- Monaco Editor integration
- Theme: VS Code Dark+ (default)
- Line numbers: enabled
- Minimap: disabled for cleaner look
- Font size: 14px
- Tab size: 2 spaces
- Border: 1px border on right side only
- Header: Language name + file extension display

**4. Input/Output Split View**
- Two-tab system: "Input (stdin)" and "Output"
- Tab bar: h-10 with border-b
- Active tab: border-b-2 with accent color
- Content area: p-4
- Monospace font for both input/output
- Output has color-coded messages (error in red, success in green)

**5. Execution Controls**
- Primary button: "Run Code" - accent color, h-10, px-6
- Secondary actions: "Clear Output", "Reset Code"
- Execution status badge: Running (animated pulse), Completed, Error, Timeout

**6. Status Bar (Bottom)**
- Height: h-8
- Background: bg-secondary
- Content: Execution time, language version, character count
- Text: text-xs text-secondary

**7. Settings Panel (Collapsible)**
- Gear icon trigger in top-right
- Slide-out panel from right
- Options: Theme toggle, Font size, Auto-run toggle, Timeout duration
- Width: w-80

### E. Layout Structure

**Main Layout:**
```
┌─────────────────────────────────────┐
│     Top Nav (Logo | Lang | Run)     │
├─────────────────┬───────────────────┤
│                 │  ┌─────────────┐  │
│                 │  │Input│Output │  │
│   Code Editor   │  ├─────────────┤  │
│                 │  │             │  │
│   (60%)        │  │   Content   │  │
│                 │  │   (40%)     │  │
│                 │  │             │  │
└─────────────────┴──┴─────────────┴──┘
│         Status Bar                   │
└─────────────────────────────────────┘
```

**Responsive (Mobile):**
- Stack vertically: Editor → Input → Output
- Editor height: 50vh minimum
- Collapsible panels with clear section headers

### F. Interaction Patterns

**No Images Required:** This is a functional tool, not a marketing page

**Visual Feedback:**
- Button states: Distinct hover (opacity-90), active (scale-95)
- Loading states: Spinner with "Executing..." text
- Success: Green border flash on output panel
- Error: Red border pulse on output panel
- Smooth transitions: transition-all duration-200

**Keyboard Shortcuts:**
- Display shortcut hints: Ctrl/Cmd + Enter to run
- Show shortcuts overlay: accessible via "?" key

**Animations:** Minimal and purposeful only
- Panel resize: smooth transition
- Tab switching: fade transition (150ms)
- Status changes: color transition only
- NO decorative animations

### G. Accessibility & Polish

- High contrast ratios (WCAG AA minimum)
- Keyboard navigation for all controls
- Focus indicators: 2px accent-colored outline
- Screen reader labels for icon-only buttons
- Error messages: Clear, actionable text
- Resizable panels: drag handle with clear affordance

### H. Advanced Features Display

**Execution History (Optional sidebar):**
- Previous runs with timestamp
- Quick re-run capability
- Collapsible: w-64 when open

**Code Snippets Library:**
- Dropdown in toolbar
- Quick insert for common patterns
- Organized by language

This design prioritizes functionality, readability, and efficient code execution workflows while maintaining a modern, professional aesthetic standard in developer tools.