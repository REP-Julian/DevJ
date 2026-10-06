// ========== React Helmet Meta Tags Helper ==========
// Use this component to dynamically update meta tags for different pages

import React from 'react';

export const SEOHelmet = {
    setPageTitle: (title) => {
        document.title = title + ' | DevJ — AI Engineer & Full-Stack Developer';
    },

    setPageMeta: (config) => {
        const { 
            title, 
            description, 
            image = '/og-image.svg',
            url = window.location.href,
            type = 'website'
        } = config;

        // Update title
        if (title) document.title = title + ' | DevJ';

        // Update description
        if (description) {
            let descMeta = document.querySelector('meta[name="description"]');
            if (!descMeta) {
                descMeta = document.createElement('meta');
                descMeta.name = 'description';
                document.head.appendChild(descMeta);
            }
            descMeta.content = description;
        }

        // Update OG tags
        const ogTags = {
            'og:title': title || 'DevJ — AI Engineer & Full-Stack Developer',
            'og:description': description || 'Interactive portfolio featuring Generative AI projects and full-stack web applications.',
            'og:image': image,
            'og:url': url,
            'og:type': type
        };

        Object.entries(ogTags).forEach(([property, content]) => {
            let meta = document.querySelector(`meta[property="${property}"]`);
            if (!meta) {
                meta = document.createElement('meta');
                meta.setAttribute('property', property);
                document.head.appendChild(meta);
            }
            meta.content = content;
        });

        // Update Twitter tags
        const twitterTags = {
            'twitter:title': title || 'DevJ — AI Engineer & Full-Stack Developer',
            'twitter:description': description || 'Interactive portfolio featuring Generative AI projects and full-stack web applications.',
            'twitter:image': image
        };

        Object.entries(twitterTags).forEach(([name, content]) => {
            let meta = document.querySelector(`meta[name="${name}"]`);
            if (!meta) {
                meta = document.createElement('meta');
                meta.name = name;
                document.head.appendChild(meta);
            }
            meta.content = content;
        });

        // Update canonical
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.rel = 'canonical';
            document.head.appendChild(canonical);
        }
        canonical.href = url;
    },

    setStructuredData: (data) => {
        let script = document.querySelector('script[type="application/ld+json"]');
        if (!script) {
            script = document.createElement('script');
            script.type = 'application/ld+json';
            document.head.appendChild(script);
        }
        script.textContent = JSON.stringify(data);
    }
};

export default SEOHelmet;
