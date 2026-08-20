import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { getLanguageMeta } from '../utils/constants';

function encodeBase64(str) {
  return btoa(unescape(encodeURIComponent(str ?? '')));
}

function decodeBase64(str) {
  if (!str) return '';
  return decodeURIComponent(escape(atob(str)));
}

export function useCompiler() {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const run = useCallback(async (language, code, stdin = '') => {
    setIsRunning(true);
    setError(null);
    setResult(null);
    const startedAt = performance.now();

    try {
      const meta = getLanguageMeta(language);

      // Handle HTML iframe preview
      if (meta.id === 'html') {
        const durationMs = Math.round(performance.now() - startedAt);
        setResult({ stdout: '', stderr: '', durationMs, isHtml: true });
        setIsRunning(false);
        return;
      }

      // Securely invoke Supabase Edge Function
      const { data, error: fnError } = await supabase.functions.invoke('run-code', {
        body: {
          source_code: encodeBase64(code),
          language_id: meta.judge0Id,
          stdin: encodeBase64(stdin),
        },
      });

      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);

      const durationMs = Math.round(performance.now() - startedAt);
      const stderrText = decodeBase64(data.stderr) || decodeBase64(data.compile_output);

      setResult({
        stdout: decodeBase64(data.stdout),
        stderr: stderrText,
        time: data.time,
        memory: data.memory,
        durationMs,
        isHtml: false,
      });
    } catch (err) {
      setError(err.message || 'Execution failed.');
    } finally {
      setIsRunning(false);
    }
  }, []);

  return { run, isRunning, result, error };
}