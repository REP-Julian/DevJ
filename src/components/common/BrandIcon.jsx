import React from 'react';

export const BrandIcon = ({ name = '', className = 'w-6 h-6' }) => {
    const key = name.toLowerCase().replace(/[\s\-_.]/g, '');

    // 1. Google Gemini
    if (key.includes('gemini') || key.includes('googlegemini')) {
        return (
            <svg className={className} viewBox="0 0 24 24" fill="none">
                <defs>
                    <linearGradient id="gemini-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#4E82EE" />
                        <stop offset="50%" stopColor="#9B72CB" />
                        <stop offset="100%" stopColor="#D96570" />
                    </linearGradient>
                </defs>
                <path
                    d="M12 2C12 7.523 7.523 12 2 12C7.523 12 12 16.477 12 22C12 16.477 16.477 12 22 12C16.477 12 12 7.523 12 2Z"
                    fill="url(#gemini-grad)"
                />
            </svg>
        );
    }

    // 2. ChatGPT / OpenAI
    if (key.includes('chatgpt') || key.includes('openai')) {
        return (
            <svg className={className} viewBox="0 0 24 24" fill="currentColor" style={{ color: '#10A37F' }}>
                <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.259 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7466-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1683a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4947zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1683a.0757.0757 0 0 1-.071 0l-4.8303-2.7866A4.504 4.504 0 0 1 2.3408 7.8956zm16.0993 3.8558L12.5973 8.3829l2.02-1.1635a.0804.0804 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.402-.6863zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L8.909 9.2298V6.8974a.0662.0662 0 0 1 .0331-.0615l4.981-2.8764a4.504 4.504 0 0 1 6.5204 2.8906v.071zm-11.071 4.5457l2.628-1.5152 2.6328 1.5152v3.0304l-2.6328 1.5151-2.628-1.5151z"/>
            </svg>
        );
    }

    // 3. Claude AI / Anthropic
    if (key.includes('claude') || key.includes('anthropic')) {
        return (
            <svg className={className} viewBox="0 0 24 24" fill="currentColor" style={{ color: '#D97706' }}>
                <path d="M13.5 2h-3l-.5 4.5L6 4.5l-1.5 2.5 4 2.5L5 12l3.5 2.5-4 2.5L6 19.5l4-2-.5 4.5h3l.5-4.5 4 2 1.5-2.5-4-2.5 3.5-2.5-3.5-2.5 4-2.5-1.5-2.5-4 2z" />
            </svg>
        );
    }

    // 4. DeepSeek AI
    if (key.includes('deepseek')) {
        return (
            <svg className={className} viewBox="0 0 24 24" fill="none">
                <defs>
                    <linearGradient id="deepseek-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#0066FF" />
                        <stop offset="100%" stopColor="#00D2FF" />
                    </linearGradient>
                </defs>
                <path
                    d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2ZM17.5 12.8C16.8 15.6 14.1 17.7 11 17.7C8.1 17.7 5.7 15.9 4.8 13.3C4.6 12.8 4.9 12.3 5.4 12.3C5.8 12.3 6.2 12.6 6.3 13C7 15 9 16.3 11.2 16.3C13.6 16.3 15.7 14.7 16.2 12.4C16.3 12 16.7 11.7 17.1 11.8C17.6 11.9 17.8 12.4 17.5 12.8ZM16.8 9.5C15.8 7.5 13.6 6.2 11.2 6.2C9 6.2 7 7.5 6.3 9.5C6.2 9.9 5.8 10.2 5.4 10.2C4.9 10.2 4.6 9.7 4.8 9.2C5.7 6.6 8.1 4.8 11 4.8C14.1 4.8 16.8 6.9 17.5 9.7C17.8 10.1 17.6 10.6 17.1 10.7C16.7 10.8 16.3 10.5 16.8 9.5Z"
                    fill="url(#deepseek-grad)"
                />
            </svg>
        );
    }

    // 5. JavaScript
    if (key.includes('javascript') || key === 'js') {
        return (
            <svg className={className} viewBox="0 0 24 24" fill="none">
                <rect width="24" height="24" rx="4" fill="#F7DF1E" />
                <path d="M7 16.5c.5.8 1.2 1.3 2.3 1.3 1.2 0 2-.6 2-1.9v-6.4H9.7v6.3c0 .7-.3 1-1 1-.5 0-.8-.3-1-.7l-1.7 1.4zm8.6-6.4c-1.8 0-3 1-3 2.6 0 1.5.9 2.2 2.3 2.8.9.4 1.3.7 1.3 1.3 0 .6-.5 1-1.3 1-.8 0-1.4-.4-1.8-1.2l-1.7 1.1c.7 1.3 1.8 2 3.5 2 2 0 3.3-1.1 3.3-2.8 0-1.4-.8-2.2-2.3-2.8-.8-.4-1.3-.7-1.3-1.2 0-.5.4-.9 1.1-.9.6 0 1.1.3 1.4.8l1.7-1.1c-.6-1-1.6-1.6-3-1.6z" fill="#000000" />
            </svg>
        );
    }

    // 6. Python
    if (key.includes('python')) {
        return (
            <svg className={className} viewBox="0 0 24 24" fill="none">
                <defs>
                    <linearGradient id="py-blue" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#387EB8" />
                        <stop offset="100%" stopColor="#366994" />
                    </linearGradient>
                    <linearGradient id="py-yellow" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFE873" />
                        <stop offset="100%" stopColor="#FFD43B" />
                    </linearGradient>
                </defs>
                <path d="M11.9 2c-4.4 0-4.1 1.9-4.1 1.9l.01 2h4.2v.6H5.8S2 6.1 2 10.5c0 4.4 3.3 4.2 3.3 4.2h2v-2.8s-.1-3.3 3.3-3.3h5.7s3.2.1 3.2-3.2c0-3.3-2.7-3.4-2.7-3.4h-4.9zm-2.4 1.3c.5 0 .9.4.9.9s-.4.9-.9.9-.9-.4-.9-.9.4-.9.9-.9z" fill="url(#py-blue)" />
                <path d="M12.1 22c4.4 0 4.1-1.9 4.1-1.9l-.01-2h-4.2v-.6h6.2s3.8.4 3.8-4c0-4.4-3.3-4.2-3.3-4.2h-2v2.8s.1 3.3-3.3 3.3H7.7S4.5 15.3 4.5 18.6c0 3.3 2.7 3.4 2.7 3.4h4.9zm2.4-1.3c-.5 0-.9-.4-.9-.9s.4-.9.9-.9.9.4.9.9-.4.9-.9.9z" fill="url(#py-yellow)" />
            </svg>
        );
    }

    // 7. Java
    if (key.includes('java') && !key.includes('javascript')) {
        return (
            <svg className={className} viewBox="0 0 24 24" fill="none">
                <path d="M8.5 18.5c2.5.5 5.5.5 7.5-.5 0 0-1 1-3.5 1.5-2.5.5-4 0-4-1zm-.5 2.5c3 .5 6.5.5 9-.5 0 0-1.5 1-4.5 1.5-3 .5-4.5 0-4.5-1zm3.5-19C9.5 5 10 7.5 12 9c-1-2-1.5-4-.5-7zm3 4c-.5 2 0 3.5 1 5-1-1.5-1.5-3.5-1-5zm-5 4c-.5 2 .5 3.5 1.5 5-1-1.5-1.5-3.5-1.5-5zm7.5 6c-2 2-6 2-8 0-1-1-1-2.5 0-3.5 1-1 3.5-1.5 5-1.5 3 0 4.5 1.5 4 3.5-.5 1-1 1.5-1 1.5z" fill="#EA2D2E" />
                <path d="M17.5 14c1.5-1 2-2.5 1.5-3.5-.5-1-2-1.5-2-1.5s.5.5.5 1c0 .5-.5 1-1.5 1.5l1.5 2.5z" fill="#5382A1" />
            </svg>
        );
    }

    // 8. HTML / HTML5
    if (key.includes('html')) {
        return (
            <svg className={className} viewBox="0 0 24 24" fill="none">
                <path d="M3 2l1.6 18.2L12 22.4l7.4-2.2L21 2H3zm14.8 5.6h-7.6l.2 2.3h7.2l-.6 6.8-4.6 1.3-4.6-1.3-.3-3.6h2.3l.2 1.8 2.4.6 2.4-.6.3-3.1H7.8L7.2 4.4h10.8l-.2 3.2z" fill="#E34F26" />
            </svg>
        );
    }

    // 9. CSS / CSS3
    if (key.includes('css')) {
        return (
            <svg className={className} viewBox="0 0 24 24" fill="none">
                <path d="M3 2l1.6 18.2L12 22.4l7.4-2.2L21 2H3zm14.8 5.6h-7.6l.2 2.3h7.2l-.6 6.8-4.6 1.3-4.6-1.3-.3-3.6h2.3l.2 1.8 2.4.6 2.4-.6.3-3.1H7.8L7.2 4.4h10.8l-.2 3.2z" fill="#1572B6" />
            </svg>
        );
    }

    // 10. TypeScript
    if (key.includes('typescript') || key === 'ts') {
        return (
            <svg className={className} viewBox="0 0 24 24" fill="none">
                <rect width="24" height="24" rx="4" fill="#3178C6" />
                <path d="M6 9.5h6v1.8H9.8v6.7H7.8v-6.7H6V9.5zm9 5.8c.6.4 1.3.6 2 .6.8 0 1.2-.3 1.2-.8 0-.5-.4-.7-1.3-1.1-1.2-.5-2-1.1-2-2.1 0-1.5 1.2-2.5 2.8-2.5.9 0 1.7.2 2.3.6l-.6 1.6c-.5-.3-1.1-.5-1.7-.5-.7 0-1.1.3-1.1.7 0 .4.3.7 1.2 1 1.3.5 2.1 1.2 2.1 2.2 0 1.6-1.2 2.6-3 2.6-1 0-2-.3-2.6-.8l.7-1.5z" fill="#FFFFFF" />
            </svg>
        );
    }

    // 11. React
    if (key.includes('react')) {
        return (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#61DAFB" strokeWidth="1.5">
                <ellipse cx="12" cy="12" rx="3.5" ry="9" transform="rotate(30 12 12)" />
                <ellipse cx="12" cy="12" rx="3.5" ry="9" transform="rotate(90 12 12)" />
                <ellipse cx="12" cy="12" rx="3.5" ry="9" transform="rotate(150 12 12)" />
                <circle cx="12" cy="12" r="1.8" fill="#61DAFB" />
            </svg>
        );
    }

    // 12. Node.js
    if (key.includes('node')) {
        return (
            <svg className={className} viewBox="0 0 24 24" fill="#5FA04E">
                <path d="M12 2l9 5.2v10.4l-9 5.2-9-5.2V7.2L12 2zm0 2.3L4.8 8.4v7.2L12 19.7l7.2-4.1V8.4L12 4.3z" />
            </svg>
        );
    }

    // Default Tech Code icon
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
        </svg>
    );
};

export default BrandIcon;
