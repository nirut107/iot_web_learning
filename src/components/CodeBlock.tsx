'use client';

import React, { useState } from 'react';
import { Check, Copy, Terminal } from 'lucide-react';
import { copyToClipboard } from '@/lib/clipboard';

interface CodeBlockProps {
  command?: string;
  expectedOutput?: string;
  context?: string;
  filename?: string;
  language?: string;
}

export function CodeBlock({
  command,
  expectedOutput,
  context,
  filename,
  language = 'bash'
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!command) return;
    try {
      const ok = await copyToClipboard(command.trim());
      if (ok) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (e) {
      console.warn('Copy action failed:', e);
    }
  };

  return (
    <div className="my-4 overflow-hidden rounded-xl border border-slate-700/60 bg-slate-950 text-slate-100 shadow-md">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 py-2 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <Terminal className="h-3.5 w-3.5 text-emerald-400" />
          {context && (
            <span className="rounded bg-emerald-950/80 px-2 py-0.5 text-[11px] font-semibold text-emerald-300 border border-emerald-800/60">
              {context}
            </span>
          )}
          {filename && <span className="font-semibold text-slate-300">{filename}</span>}
          {!context && !filename && <span>{language}</span>}
        </div>
        {command && (
          <button
            onClick={handleCopy}
            type="button"
            className="flex items-center gap-1.5 rounded bg-slate-800 hover:bg-slate-700 px-2.5 py-1 text-xs text-slate-300 transition-colors cursor-pointer"
            title="คัดลอกคำสั่งเฉพาะโค้ด (ไม่รวม output)"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">คัดลอกแล้ว!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-slate-400" />
                <span>คัดลอกคำสั่ง</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Copyable Command Section */}
      {command && (
        <div className="overflow-x-auto p-4 text-sm font-mono leading-relaxed text-emerald-300 selection:bg-emerald-900 selection:text-emerald-100">
          <pre>
            <code>{command}</code>
          </pre>
        </div>
      )}

      {/* Separate Expected Output Section */}
      {expectedOutput && (
        <div className="border-t border-slate-800/80 bg-slate-900/40 p-4">
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Expected Output (ผลลัพธ์ตัวอย่าง):
          </div>
          <div className="overflow-x-auto text-xs font-mono text-slate-300 leading-relaxed">
            <pre>
              <code>{expectedOutput}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
