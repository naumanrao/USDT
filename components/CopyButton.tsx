"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/Toast";

interface CopyButtonProps {
    text: string;
    label?: string;
}

export default function CopyButton({ text, label = "Copy" }: CopyButtonProps) {
    const { toast } = useToast();
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            toast("Copied to clipboard!", "success");
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast("Failed to copy", "error");
        }
    };

    return (
        <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-zinc-700 dark:text-gray-300 dark:hover:bg-zinc-600 transition-colors"
            title="Click to copy"
        >
            {copied ? (
                <>
                    <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-green-600">Copied</span>
                </>
            ) : (
                <>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m2 4h6m-6 4h6m-6 4h6" />
                    </svg>
                    <span>{label}</span>
                </>
            )}
        </button>
    );
}
