import React from 'react';

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    example?: string;
    highlight?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, example, highlight }) => {
    return (
        <div className="group relative p-8 rounded-2xl bg-card hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-border">
            {/* Highlight Badge */}
            {highlight && (
                <div className="absolute -top-3 right-6 bg-gradient-to-r from-primary to-accent text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    {highlight}
                </div>
            )}

            {/* Icon Container */}
            <div className="mb-6 transform group-hover:scale-110 group-hover:rotate-2 transition-transform duration-300">
                <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/40 shadow-md text-primary">
                    {icon}
                </div>
            </div>

            {/* Content */}
            <h3 className="text-2xl font-bold mb-3 text-foreground">{title}</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">{description}</p>

            {/* Example */}
            {example && (
                <div className="mt-4 p-4 bg-muted rounded-xl border-l-4 border-primary">
                    <p className="text-sm font-mono text-muted-foreground">{example}</p>
                </div>
            )}

            {/* Hover Glow Effect */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ boxShadow: '0 0 30px rgba(var(--primary), 0.2)' }}
            />
        </div>
    );
};
