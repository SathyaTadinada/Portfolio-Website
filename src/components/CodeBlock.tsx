'use client';

import {
    useState,
    type ReactNode,
    type ReactElement,
    isValidElement,
} from 'react';

/* ---------------- helpers ---------------- */

function hasProps(
    node: ReactNode,
): node is ReactElement<{ className?: string; children?: ReactNode }> {
    return isValidElement(node);
}

function nodeToString(node: ReactNode): string {
    if (typeof node === 'string') return node;
    if (Array.isArray(node)) return node.map(nodeToString).join('');
    if (hasProps(node)) return nodeToString(node.props.children);
    return '';
}

function getLang(node: ReactNode, fallback = ''): string {
    let cls = fallback;
    if (hasProps(node)) cls = node.props.className ?? fallback;
    const m = /language-([\w-]+)/.exec(cls);
    return m?.[1] ?? '';
}

/* ---------------- component ---------------- */

type PreProps = React.ComponentProps<'pre'> & { children: ReactNode };

export default function CodeBlock({ children, className = '', ...rest }: PreProps) {
    const raw = nodeToString(children);
    const lang = getLang(children, className);

    const [copied, setCopied] = useState(false);
    const copy = async () => {
        await navigator.clipboard.writeText(raw);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <pre
            {...rest}
            /* not-prose = ignore typography defaults; bg-[#0f0f10] is very dark */
            className="
                not-prose group relative whitespace-pre
                rounded-3xl bg-[#18181a] dark:bg-[#0b0b0d] pt-10 pb-4 px-4
                text-xs leading-7 text-zinc-50
            "
            data-language={lang}
        >
            {/* language badge */}
            {lang && (
                <span className="absolute left-4 top-2 select-none text-[12px] lowercase tracking-wider text-zinc-400/80">
                    {lang}
                </span>
            )}

            {/* copy button */}
            <button
                onClick={copy}
                aria-label="Copy code"
                className="
                    absolute right-2 top-2 rounded-md border border-zinc-700 px-2 py-0.5
                    text-[11px] font-mono opacity-0 transition group-hover:opacity-100
                "
            >
                {copied ? '✓' : 'Copy'}
            </button>

            <div className="overflow-x-auto">
                <code className={`${className} bg-transparent`}>
                    {children}
                </code>
            </div>
        </pre>
    );
}
