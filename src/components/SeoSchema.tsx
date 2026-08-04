import React, { useEffect } from 'react';
import seoData from '../data/seo-schema.json';

export const SeoSchema: React.FC = () => {
  useEffect(() => {
    const scriptId = 'seo-jsonld-schema';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    script.textContent = JSON.stringify(seoData, null, 2);

    return () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return null;
};

export default SeoSchema;
