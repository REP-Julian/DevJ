import React, { useState } from 'react';
import { Copy, Check, Terminal, Lightbulb, Sparkles } from 'lucide-react';

/**
 * Clean, modern FormattedMessage renderer
 * Converts markdown (bold, lists, code blocks, headers) into clean typography without raw ** or # symbols.
 */
export const FormattedMessage = ({ content = '' }) => {
    const [copiedCodeId, setCopiedCodeId] = useState(null);

    const handleCopyCode = (code, id) => {
        navigator.clipboard.writeText(code);
        setCopiedCodeId(id);
        setTimeout(() => setCopiedCodeId(null), 2000);
    };

    // Helper to format inline text (removes ** asterisks and converts to styled <strong>, `code`, etc.)
    const renderInline = (text) => {
        if (!text) return null;

        // Clean out any stray triple/double asterisks
        const parts = [];
        let remaining = text;
        let keyIndex = 0;

        // Regular expression matching **bold**, *italic*, `code`, and [links]
        const inlineRegex = /(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(`([^`]+)`)/g;
        let match;
        let lastIndex = 0;

        while ((match = inlineRegex.exec(text)) !== null) {
            // Push text before match
            if (match.index > lastIndex) {
                const plain = text.substring(lastIndex, match.index).replace(/\*\*/g, '');
                parts.push(<span key={keyIndex++}>{plain}</span>);
            }

            if (match[2]) {
                // Bold match (**text**)
                parts.push(
                    <strong key={keyIndex++} className="font-black text-charcoal-950">
                        {match[2]}
                    </strong>
                );
            } else if (match[4]) {
                // Italic match (*text*)
                parts.push(
                    <em key={keyIndex++} className="italic text-charcoal-800">
                        {match[4]}
                    </em>
                );
            } else if (match[6]) {
                // Code match (`text`)
                parts.push(
                    <code
                        key={keyIndex++}
                        className="px-1.5 py-0.5 mx-0.5 rounded-md bg-devyellow-100/80 text-charcoal-900 border border-devyellow-200 font-mono text-[11px] font-bold"
                    >
                        {match[6]}
                    </code>
                );
            }

            lastIndex = match.index + match[0].length;
        }

        // Push any remaining text
        if (lastIndex < text.length) {
            const plain = text.substring(lastIndex).replace(/\*\*/g, '');
            parts.push(<span key={keyIndex++}>{plain}</span>);
        }

        return parts.length > 0 ? parts : text.replace(/\*\*/g, '');
    };

    // Split message into logical blocks (code blocks, lists, paragraphs, headers)
    const blocks = [];
    const lines = content.split('\n');
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

        // Code block toggle
        if (line.trim().startsWith('```')) {
            if (inCodeBlock) {
                // End code block
                blocks.push({
                    type: 'code',
                    language: codeLanguage || 'javascript',
                    content: codeBuffer.join('\n'),
                });
                codeBuffer = [];
                codeLanguage = '';
                inCodeBlock = false;
            } else {
                // Start code block
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

        // Blank lines act as block separators
        if (!line.trim()) {
            flushParagraph();
            continue;
        }

        // Headers (#, ##, ###)
        if (line.startsWith('#')) {
            flushParagraph();
            const level = (line.match(/^#+/) || ['#'])[0].length;
            const headingText = line.replace(/^#+\s*/, '').replace(/\*\*/g, '');
            blocks.push({ type: 'heading', level, content: headingText });
            continue;
        }

        // Numbered list item (e.g. "1. Item" or "1) Item")
        const numMatch = line.match(/^(\d+)[\.\)]\s+(.*)/);
        if (numMatch) {
            flushParagraph();
            blocks.push({
                type: 'numbered-item',
                number: numMatch[1],
                content: numMatch[2],
            });
            continue;
        }

        // Bullet point item (e.g. "- Item" or "* Item" or "• Item")
        const bulletMatch = line.match(/^[-*•]\s+(.*)/);
        if (bulletMatch) {
            flushParagraph();
            blocks.push({
                type: 'bullet-item',
                content: bulletMatch[1],
            });
            continue;
        }

        // Callout or Tip line (e.g. starting with "(Note:" or "💡" or ">")
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

                // Standard paragraph
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
