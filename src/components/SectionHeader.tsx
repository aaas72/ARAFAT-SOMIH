import React from 'react';

interface SectionHeaderProps {
  title: string; // Changed to string for data-driven highlight parsing
  subtitle: string;
  meta?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, meta }) => {
  // Parse title to inject highlight span where {word} is found
  const renderTitle = () => {
    const parts = title.split(/(\{.*?\})/g);
    return parts.map((part, i) => {
      if (part.startsWith('{') && part.endsWith('}')) {
        const word = part.slice(1, -1);
        return <span key={i} className="text-primary-container">{word}</span>;
      }
      return part;
    });
  };

  return (
    <section className="w-full mb-16 lg:mb-24 overflow-hidden">
      <div className="container mx-auto mb-8 lg:mb-12 px-6 lg:px-0">
        <h1 className="font-epilogue text-5xl lg:text-8xl font-black text-white uppercase leading-[0.9] lg:leading-[0.8] tracking-tighter m-0 p-0 break-words">
          {renderTitle()}
        </h1>
      </div>

      <div className="container mx-auto px-6 lg:px-0">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-gutter justify-between items-start lg:items-end border-t border-white/10 pt-8 lg:pt-10">
          <div className="max-w-2xl">
            <p className="font-inter text-body-md lg:text-body-lg text-gray-400 leading-relaxed">
              {subtitle}
            </p>
          </div>
          
          {meta && (
            <div className="font-inter font-bold text-[10px] lg:text-label-caps text-on-surface-variant uppercase tracking-[0.2em] whitespace-nowrap mt-4 lg:mt-0 opacity-60 lg:opacity-100">
              {meta}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SectionHeader;
