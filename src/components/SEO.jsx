import { useEffect } from 'react';

const SEO = ({
  title,
  description,
  keywords,
  ogType = 'website',
  ogImage = 'https://pixelbros.pe/images/og-default.jpg',
  schema
}) => {
  useEffect(() => {
    // 1. Título de la página
    if (title) {
      document.title = title;
    }

    // Helper para actualizar o crear meta tags
    const updateMetaTag = (attrName, attrValue, content) => {
      if (!content) return;
      let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Meta Description
    updateMetaTag('name', 'description', description);

    // 3. Meta Keywords
    if (keywords) {
      updateMetaTag('name', 'keywords', keywords);
    }

    // 4. Open Graph Tags
    if (title) {
      updateMetaTag('property', 'og:title', title);
    }
    updateMetaTag('property', 'og:description', description);
    updateMetaTag('property', 'og:type', ogType);
    updateMetaTag('property', 'og:image', ogImage);
    updateMetaTag('property', 'og:url', window.location.href);

    // 5. Link Canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', window.location.href);

    // 6. Structured Data (JSON-LD)
    let jsonLdScript = document.getElementById('json-ld-structured-data');
    if (schema) {
      if (!jsonLdScript) {
        jsonLdScript = document.createElement('script');
        jsonLdScript.id = 'json-ld-structured-data';
        jsonLdScript.type = 'application/ld+json';
        document.head.appendChild(jsonLdScript);
      }
      jsonLdScript.text = JSON.stringify(schema);
    } else if (jsonLdScript) {
      jsonLdScript.remove();
    }

    // Cleanup opcional al desmontar
    return () => {
      const dynamicSchema = document.getElementById('json-ld-structured-data');
      if (dynamicSchema) {
        dynamicSchema.remove();
      }
    };
  }, [title, description, keywords, ogType, ogImage, schema]);

  return null;
};

export default SEO;
