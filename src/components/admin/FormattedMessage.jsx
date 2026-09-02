import React, { useState } from 'react';
import { Copy, Check, Terminal, Lightbulb, Sparkles } from 'lucide-react';

/**
 * Clean, modern FormattedMessage renderer
 * Eliminates all raw markdown symbols (**, _, -, |, ###) and renders pure, elegant typography.
 */
export const FormattedMessage = ({ content = '' }) => {
    const [copiedCodeId, setCopiedCodeId] = useState(null);

    const handleCopyCode = (code, id) => {
        navigator.clipboard.writeText(code);
        setCopiedCodeId(id);
        setTimeout(() => setCopiedCodeId(null), 2000);
    };

    // Helper to strip and clean all raw formatting symbols
    const cleanRawSymbols = (str) => {
        if (!str) return '';
        return str
            .replace(/\*\*/g, '')
            .replace(/__/g, '')
            .replace(/\*/g, '')
            .replace(/\|/g, ' ')
            .replace(/_/g, ' ')
            .replace(/[ ]{2,}/g, ' ');
    };

    // Helper to format inline text with rich typography, strictly eliminating raw syntax
    const renderInline = (text) => {
        if (!text) return null;

        const parts = [];
        let keyIndex = 0;

        // Match `code`, **bold**, *italic*, _italic_
        const inlineRegex = /(`([^`]+)`)|(\*\*([^*]+)\*\*)|(__([^_]+)__)|(\*([^*]+)\*)|(_([^_]+)_)/g;
        let match;
        let lastIndex = 0;

        while ((match = inlineRegex.exec(text)) !== null) {
            if (match.index > lastIndex) {
                const plain = text.substring(lastIndex, match.index);
                const cleaned = cleanRawSymbols(plain);
                if (cleaned) parts.push(<span key={keyIndex++}>{cleaned}</span>);
            }

            if (match[2]) {
                // Inline `code`
                parts.push(
                    <code
                        key={keyIndex++}
                        className="px-1.5 py-0.5 mx-0.5 rounded-md bg-devyellow-100/90 text-charcoal-900 border border-devyellow-200 font-mono text-[11px] font-bold"
                    >
                        {match[2]}
                    </code>
                );
            } else if (match[4] || match[6]) {
                // **bold** or __bold__
                const boldContent = match[4] || match[6];
                parts.push(
                    <strong key={keyIndex++} className="font-extrabold text-charcoal-950">
                        {cleanRawSymbols(boldContent)}
                    </strong>
                );
            } else if (match[8] || match[10]) {
                // *italic* or _italic_
                const italicContent = match[8] || match[10];
                parts.push(
                    <span key={keyIndex++} className="font-semibold text-charcoal-900">
                        {cleanRawSymbols(italicContent)}
                    </span>
                );
            }

            lastIndex = match.index + match[0].length;
        }

        if (lastIndex < text.length) {
            const plain = text.substring(lastIndex);
            const cleaned = cleanRawSymbols(plain);
            if (cleaned) parts.push(<span key={keyIndex++}>{cleaned}</span>);
        }

        return parts.length > 0 ? parts : cleanRawSymbols(text);
    };

    // Split message into structured blocks
    const blocks = [];
    const lines = (content || '').split('\n');
    let inCodeBlock = false;
    let codeLanguage = '';
    let codeBuffer = [];
    let currentParagraph = [];

    const flushParagraph = () => {
        if (currentParagraph.length > 0) {
            blocks.push({ type: 'paragraph', content: currentParagraph.join('\n') });
            currentParagraph = [];
        }
    };

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // 1. Code block toggle
        if (line.trim().startsWith('```')) {
            if (inCodeBlock) {
                blocks.push({
                    type: 'code',
                    language: codeLanguage || 'javascript',
                    content: codeBuffer.join('\n'),
                });
                codeBuffer = [];
                codeLanguage = '';
                inCodeBlock = false;
            } else {
                flushParagraph();
                inCodeBlock = true;
                codeLanguage = line.trim().replace('```', '').trim();
            }
            continue;
        }

        if (inCodeBlock) {
            codeBuffer.push(line);
            continue;
        }

        // 2. Blank line
        if (!line.trim()) {
            flushParagraph();
            continue;
        }

        // 3. Skip table divider rows (e.g. |---|---| or |:---|---:|)
        if (/^[-|:\s]+$/.test(line.trim())) {
            continue;
        }

        // 4. Horizontal dividers (--- or *** or ___)
        if (/^[-—_*]{3,}$/.test(line.trim())) {
            flushParagraph();
            blocks.push({ type: 'divider' });
            continue;
        }

        // 5. Table rows (e.g. | Col 1 | Col 2 |)
        if (line.includes('|') && line.trim().startsWith('|')) {
            flushParagraph();
            const cells = line.split('|').map((c) => c.trim()).filter(Boolean);
            if (cells.length > 0) {
                blocks.push({ type: 'table-row', cells });
            }
            continue;
        }

        // 6. Headings (#, ##, ###)
        if (line.trim().startsWith('#')) {
            flushParagraph();
            const level = (line.match(/^#+/) || ['#'])[0].length;
            const headingText = cleanRawSymbols(line.replace(/^#+\s*/, ''));
            blocks.push({ type: 'heading', level, content: headingText });
            continue;
        }

        // 7. Numbered list items (e.g. "1. Item" or "1) Item")
        const numMatch = line.match(/^[\s]*(\d+)[\.\)]\s+(.*)/);
        if (numMatch) {
            flushParagraph();
            blocks.push({
                type: 'numbered-item',
                number: numMatch[1],
                content: numMatch[2],
            });
            continue;
        }

        // 8. Bullet items (e.g. "- Item" or "* Item" or "• Item")
        const bulletMatch = line.match(/^[\s]*[-*•]\s+(.*)/);
        if (bulletMatch) {
            flushParagraph();
            blocks.push({
                type: 'bullet-item',
                content: bulletMatch[1],
            });
            continue;
        }

        // 9. Callout / Tip
        if (line.startsWith('>') || line.includes('💡 Tip:') || line.includes('*(Note:')) {
            flushParagraph();
            blocks.push({
                type: 'callout',
                content: line.replace(/^>\s*/, '').replace(/^\*\((.*?)\)\*/, '$1'),
            });
            continue;
        }

        currentParagraph.push(line);
    }
    flushParagraph();

    return (
        <div className="space-y-3 text-xs leading-relaxed text-charcoal-800">
            {blocks.map((block, idx) => {
                if (block.type === 'heading') {
                    return (
                        <h4
                            key={idx}
                            className={`font-black text-charcoal-900 tracking-tight flex items-center gap-1.5 ${
                                block.level === 1
                                    ? 'text-sm sm:text-base text-devorange-600 border-b border-gray-100 pb-1.5 pt-1'
                                    : 'text-xs sm:text-sm pt-1'
                            }`}
                        >
                            <Sparkles className="w-3.5 h-3.5 text-devyellow-500 fill-devyellow-400 shrink-0" />
                            <span>{block.content}</span>
                        </h4>
                    );
                }

                if (block.type === 'divider') {
                    return <div key={idx} className="my-2 border-t border-gray-100" />;
                }

                if (block.type === 'table-row') {
                    return (
                        <div key={idx} className="flex flex-wrap items-center gap-2 my-1 p-2 bg-gray-50/70 rounded-xl border border-gray-100">
                            {block.cells.map((cell, cIdx) => (
                                <span
                                    key={cIdx}
                                    className="px-2.5 py-1 rounded-lg bg-white border border-gray-200/80 text-charcoal-800 font-medium text-[11px] shadow-2xs"
                                >
                                    {renderInline(cell)}
                                </span>
                            ))}
                        </div>
                    );
                }

                if (block.type === 'code') {
                    const codeId = `code-${idx}`;
                    return (
                        <div key={idx} className="my-2 rounded-2xl overflow-hidden border border-charcoal-800 bg-charcoal-900 text-white shadow-md">
                            <div className="flex items-center justify-between px-3.5 py-1.5 bg-charcoal-950/80 border-b border-charcoal-800 text-[10px] font-mono text-charcoal-400">
                                <span className="flex items-center gap-1.5 font-bold uppercase text-devyellow-400">
                                    <Terminal className="w-3 h-3" /> {block.language || 'code'}
                                </span>
                                <button
                                    onClick={() => handleCopyCode(block.content, codeId)}
                                    className="flex items-center gap-1 text-charcoal-300 hover:text-white transition-colors"
                                >
                                    {copiedCodeId === codeId ? (
                                        <>
                                            <Check className="w-3 h-3 text-emerald-400" /> Copied
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-3 h-3" /> Copy Code
                                        </>
                                    )}
                                </button>
                            </div>
                            <pre className="p-3.5 overflow-x-auto text-[11px] font-mono leading-relaxed text-gray-200">
                                <code>{block.content}</code>
                            </pre>
                        </div>
                    );
                }

                if (block.type === 'numbered-item') {
                    return (
                        <div key={idx} className="flex items-start gap-2.5 my-1">
                            <span className="w-5 h-5 rounded-lg bg-devyellow-100 text-devorange-600 font-extrabold text-[10px] flex items-center justify-center shrink-0 mt-0.5 border border-devyellow-200 shadow-xs">
                                {block.number}
                            </span>
                            <div className="flex-1 leading-relaxed">
                                {renderInline(block.content)}
                            </div>
                        </div>
                    );
                }

                if (block.type === 'bullet-item') {
                    return (
                        <div key={idx} className="flex items-start gap-2.5 my-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-devorange-500 shrink-0 mt-2" />
                            <div className="flex-1 leading-relaxed">
                                {renderInline(block.content)}
                            </div>
                        </div>
                    );
                }

                if (block.type === 'callout') {
                    return (
                        <div
                            key={idx}
                            className="p-3 rounded-xl bg-devyellow-50/70 border border-devyellow-200 text-charcoal-800 text-[11px] flex items-start gap-2 my-2 shadow-xs"
                        >
                            <Lightbulb className="w-4 h-4 text-devorange-500 shrink-0 mt-0.5" />
                            <div className="flex-1 leading-relaxed">
                                {renderInline(block.content)}
                            </div>
                        </div>
                    );
                }

                return (
                    <p key={idx} className="leading-relaxed">
                        {renderInline(block.content)}
                    </p>
                );
            })}
        </div>
    );
};

export default FormattedMessage;
