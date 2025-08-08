'use client';

import {
    useState,
    type ReactNode,
    type ReactElement,
    isValidElement,
} from 'react';

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
            className="
                not-prose group relative whitespace-pre
                rounded-3xl bg-[#282c34] dark:bg-[#101016] pt-10 pb-4 px-4 my-6
                text-xs leading-7 text-zinc-50
            "
            data-language={lang}
        >
            {lang && (
                <span className="absolute left-4 top-2 select-none text-[10px] lowercase tracking-wider text-zinc-400/80">
                    {lang}
                </span>
            )}
            <button
                onClick={copy}
                aria-label="Copy code"
                className="
                    absolute right-2 top-2 rounded-md border border-zinc-700 px-2 py-0.5
                    text-[11px] font-mono sm:opacity-100 md:opacity-0 transition md:group-hover:opacity-100
                "
            >
                {copied ? 'Copied!' : 'Copy'}
            </button>

            <div className="overflow-x-auto">
                <code className={`${className} bg-transparent`}>
                    {children}
                </code>
            </div>
        </pre>
    );
}
