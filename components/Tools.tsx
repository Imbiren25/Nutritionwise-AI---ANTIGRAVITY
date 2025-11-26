import React from 'react';
import Icon from './Icon';

const Tools: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
    <Icon name="apps" className="w-24 h-24 mb-4 text-muted-foreground/50" />
    <h2 className="text-2xl font-bold text-foreground">Information Tools</h2>
    <p className="mt-2 max-w-md">This area will provide helpful offline resources like a food library, conversion tables, a glossary of terms, and intake measurement guides to support you in the field.</p>
  </div>
);

export default Tools;
