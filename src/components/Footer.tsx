import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  const { branding, links, copyright } = t.common.footer;

  return (
    <footer className="w-full border-t border-white/10 bg-[#0A0A0B] py-12 lg:py-16 px-6 lg:px-0">
      <div className="container mx-auto flex flex-col lg:flex-row justify-between items-center gap-10 lg:gap-8">
        <div className="text-xl lg:text-lg font-black text-white italic tracking-tighter select-none">
          {branding}
        </div>
        <div className="flex gap-6 lg:gap-8">
          {links.map((link, idx) => (
            <React.Fragment key={idx}>
              {link.url.startsWith('http') ? (
                <a 
                  href={link.url}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-epilogue font-bold uppercase text-[10px] tracking-widest text-neutral-500 hover:text-lime-400 transition-colors"
                >
                  {link.name}
                </a>
              ) : (
                <Link 
                  to={link.url} 
                  className="font-epilogue font-bold uppercase text-[10px] tracking-widest text-neutral-500 hover:text-lime-400 transition-colors"
                >
                  {link.name}
                </Link>
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="font-epilogue font-bold uppercase text-[10px] tracking-widest text-neutral-500 text-center lg:text-right">
          {copyright}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
