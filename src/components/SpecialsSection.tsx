import React, { useEffect, useState } from 'react';
import specialsMd from '@/content/specials.md?raw';

const SpecialsSection = () => {
    const [content, setContent] = useState<string>('');

    useEffect(() => {
        setContent(specialsMd);
    }, []);

    // Simple Markdown Parser for the Demo
    const parseMarkdown = (md: string) => {
        const lines = md.split('\n');
        return lines.map((line, index) => {
            if (line.startsWith('# ')) {
                return <h1 key={index} className="text-4xl font-serif font-bold mb-6 text-primary">{line.replace('# ', '')}</h1>;
            }
            if (line.startsWith('## ')) {
                return <h2 key={index} className="text-2xl font-serif font-semibold mt-8 mb-4 text-secondary">{line.replace('## ', '')}</h2>;
            }
            if (line.startsWith('- ')) {
                const text = line.replace('- ', '');
                // Bold parsing (**text**)
                const parts = text.split(/(\*\*.*?\*\*)/g);
                return (
                    <li key={index} className="ml-4 mb-2 text-muted-foreground list-disc marker:text-primary">
                        {parts.map((part, i) => {
                            if (part.startsWith('**') && part.endsWith('**')) {
                                return <strong key={i} className="text-foreground font-medium">{part.slice(2, -2)}</strong>;
                            }
                            return part;
                        })}
                    </li>
                );
            }
            if (line.trim() === '') {
                return <br key={index} />;
            }
            return <p key={index} className="mb-2">{line}</p>;
        });
    };

    return (
        <section className="container py-12 md:py-16">
            <div className="max-w-3xl mx-auto bg-card border border-border rounded-lg p-8 shadow-sm">
                <div className="prose prose-stone dark:prose-invert max-w-none">
                    {parseMarkdown(content)}
                </div>
            </div>
        </section>
    );
};

export default SpecialsSection;
