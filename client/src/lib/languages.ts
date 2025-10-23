import { type LanguageInfo } from "@shared/schema";

export const LANGUAGES: LanguageInfo[] = [
  {
    id: "python",
    name: "Python",
    extension: ".py",
    monacoLanguage: "python",
    icon: "python",
    version: "3.11",
    defaultCode: `# Python Code
def greet(name):
    return f"Hello, {name}!"

print(greet("World"))`,
  },
  {
    id: "javascript",
    name: "JavaScript",
    extension: ".js",
    monacoLanguage: "javascript",
    icon: "javascript",
    version: "Node 20",
    defaultCode: `// JavaScript Code
function greet(name) {
    return \`Hello, \${name}!\`;
}

console.log(greet("World"));`,
  },
  {
    id: "cpp",
    name: "C++",
    extension: ".cpp",
    monacoLanguage: "cpp",
    icon: "cpp",
    version: "GCC 11",
    defaultCode: `// C++ Code
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
  },
];

export const getLanguageById = (id: string) =>
  LANGUAGES.find((lang) => lang.id === id) || LANGUAGES[0];
