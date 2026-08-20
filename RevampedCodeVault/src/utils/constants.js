export const JUDGE0_API_URL = 'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true';
export const RAPIDAPI_HOST = 'judge0-ce.p.rapidapi.com';

export const SUPPORTED_LANGUAGES = [
  { id: 'javascript', label: 'JavaScript (Node.js)', judge0Id: 63, monacoLang: 'javascript', ext: 'js' },
  { id: 'typescript', label: 'TypeScript', judge0Id: 74, monacoLang: 'typescript', ext: 'ts' },
  { id: 'python', label: 'Python 3', judge0Id: 71, monacoLang: 'python', ext: 'py' },
  { id: 'java', label: 'Java (OpenJDK)', judge0Id: 62, monacoLang: 'java', ext: 'java' },
  { id: 'csharp', label: 'C# (Mono)', judge0Id: 51, monacoLang: 'csharp', ext: 'cs' },
  { id: 'cpp', label: 'C++ (GCC)', judge0Id: 54, monacoLang: 'cpp', ext: 'cpp' },
  { id: 'c', label: 'C (GCC)', judge0Id: 50, monacoLang: 'c', ext: 'c' },
  { id: 'go', label: 'Go', judge0Id: 60, monacoLang: 'go', ext: 'go' },
  { id: 'rust', label: 'Rust', judge0Id: 73, monacoLang: 'rust', ext: 'rs' },
  { id: 'ruby', label: 'Ruby', judge0Id: 72, monacoLang: 'ruby', ext: 'rb' },
  { id: 'php', label: 'PHP', judge0Id: 68, monacoLang: 'php', ext: 'php' },
  { id: 'bash', label: 'Bash', judge0Id: 46, monacoLang: 'shell', ext: 'sh' },
  { id: 'html', label: 'HTML/CSS', judge0Id: null, monacoLang: 'html', ext: 'html' },
];

export const getLanguageMeta = (id) =>
  SUPPORTED_LANGUAGES.find((l) => l.id === id) ?? SUPPORTED_LANGUAGES[0];