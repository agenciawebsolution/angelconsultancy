import React, { useEffect } from 'react';
import { useSettings } from '../../context/SettingsContext';

interface DynamicHeadProps {
  title?: string;
  description?: string;
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  canonicalUrl?: string;
  robots?: string;
}

export const DynamicHead: React.FC<DynamicHeadProps> = ({
  title,
  description,
  ogImage,
  ogTitle,
  ogDescription,
  canonicalUrl,
  robots,
}) => {
  const { settings } = useSettings();

  useEffect(() => {
    // 1. Título da página
    const siteTitle = settings.seo_site_title || 'Angel Consultancy and Network';
    document.title = title ? `${title} | ${siteTitle}` : siteTitle;

    // Helper para atualizar ou criar meta tag
    const setMetaTag = (name: string, content: string | null | undefined, isProperty: boolean = false) => {
      if (!content) return;
      const attr = isProperty ? 'property' : 'name';
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    // 2. Metas de SEO
    const finalDesc = description || settings.seo_meta_description;
    setMetaTag('description', finalDesc);
    setMetaTag('robots', robots || settings.seo_robots || 'index, follow');

    // 3. Open Graph
    setMetaTag('og:title', ogTitle || title || siteTitle, true);
    setMetaTag('og:description', ogDescription || finalDesc, true);
    setMetaTag('og:image', ogImage || settings.seo_default_og_image || '/logo.png', true);
    setMetaTag('og:url', canonicalUrl || window.location.href, true);

    // 4. Twitter Card
    setMetaTag('twitter:title', ogTitle || title || siteTitle);
    setMetaTag('twitter:description', ogDescription || finalDesc);
    setMetaTag('twitter:image', ogImage || settings.seo_default_og_image || '/logo.png');

    // 5. Canonical Link
    const finalCanonical = canonicalUrl || settings.seo_canonical_url;
    if (finalCanonical) {
      let linkEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!linkEl) {
        linkEl = document.createElement('link');
        linkEl.rel = 'canonical';
        document.head.appendChild(linkEl);
      }
      linkEl.href = finalCanonical;
    }

    // 6. Google Search Console Token
    if (settings.google_search_console_token) {
      setMetaTag('google-site-verification', settings.google_search_console_token);
    }

    // 7. Google Analytics GA4
    const gaId = settings.google_analytics_id?.trim();
    if (gaId && gaId.startsWith('G-')) {
      const existingScript = document.getElementById('angel-ga4-script');
      if (!existingScript) {
        const gaScript = document.createElement('script');
        gaScript.id = 'angel-ga4-script';
        gaScript.async = true;
        gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
        document.head.appendChild(gaScript);

        const inlineScript = document.createElement('script');
        inlineScript.id = 'angel-ga4-inline';
        inlineScript.text = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `;
        document.head.appendChild(inlineScript);
      }
    }
  }, [title, description, ogImage, ogTitle, ogDescription, canonicalUrl, robots, settings]);

  return null;
};
