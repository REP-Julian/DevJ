import React from 'react';

export const BrandIcon = ({ name = '', className = 'w-6 h-6' }) => {
    const key = name.toLowerCase().replace(/[\s\-_.]/g, '');

    // 1. Google Gemini
    if (key.includes('gemini') || key.includes('googlegemini')) {
        return (
            <svg viewBox="0 0 296 298" xmlns="http://www.w3.org/2000/svg" className={className} fill="none">
                <mask id="gemini-mask-a" width="296" height="298" x="0" y="0" maskUnits="userSpaceOnUse" style={{ maskType: 'alpha' }}>
                    <path fill="#3186FF" d="M141.201 4.886c2.282-6.17 11.042-6.071 13.184.148l5.985 17.37a184.004 184.004 0 0 0 111.257 113.049l19.304 6.997c6.143 2.227 6.156 10.91.02 13.155l-19.35 7.082a184.001 184.001 0 0 0-109.495 109.385l-7.573 20.629c-2.241 6.105-10.869 6.121-13.133.025l-7.908-21.296a184 184 0 0 0-109.02-108.658l-19.698-7.239c-6.102-2.243-6.118-10.867-.025-13.132l20.083-7.467A183.998 183.998 0 0 0 133.291 26.28l7.91-21.394Z" />
                </mask>
                <g mask="url(#gemini-mask-a)">
                    <g filter="url(#gemini-filter-b)"><ellipse cx="163" cy="149" fill="#3689FF" rx="196" ry="159" /></g>
                    <g filter="url(#gemini-filter-c)"><ellipse cx="33.5" cy="142.5" fill="#F6C013" rx="68.5" ry="72.5" /></g>
                    <g filter="url(#gemini-filter-d)"><ellipse cx="19.5" cy="148.5" fill="#F6C013" rx="68.5" ry="72.5" /></g>
                    <g filter="url(#gemini-filter-e)"><path fill="#FA4340" d="M194 10.5C172 82.5 65.5 134.333 22.5 135L144-66l50 76.5Z" /></g>
                    <g filter="url(#gemini-filter-f)"><path fill="#FA4340" d="M190.5-12.5C168.5 59.5 62 111.333 19 112L140.5-89l50 76.5Z" /></g>
                    <g filter="url(#gemini-filter-g)"><path fill="#14BB69" d="M194.5 279.5C172.5 207.5 66 155.667 23 155l121.5 201 50-76.5Z" /></g>
                    <g filter="url(#gemini-filter-h)"><path fill="#14BB69" d="M196.5 320.5C174.5 248.5 68 196.667 25 196l121.5 201 50-76.5Z" /></g>
                </g>
                <defs>
                    <filter id="gemini-filter-b" width="464" height="390" x="-69" y="-46" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse">
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <feGaussianBlur result="effect1_foregroundBlur_69_17998" stdDeviation="18" />
                    </filter>
                    <filter id="gemini-filter-c" width="265" height="273" x="-99" y="6" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse">
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <feGaussianBlur result="effect1_foregroundBlur_69_17998" stdDeviation="32" />
                    </filter>
                    <filter id="gemini-filter-d" width="265" height="273" x="-113" y="12" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse">
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <feGaussianBlur result="effect1_foregroundBlur_69_17998" stdDeviation="32" />
                    </filter>
                    <filter id="gemini-filter-e" width="299.5" height="329" x="-41.5" y="-130" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse">
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <feGaussianBlur result="effect1_foregroundBlur_69_17998" stdDeviation="32" />
                    </filter>
                    <filter id="gemini-filter-f" width="299.5" height="329" x="-45" y="-153" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse">
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <feGaussianBlur result="effect1_foregroundBlur_69_17998" stdDeviation="32" />
                    </filter>
                    <filter id="gemini-filter-g" width="299.5" height="329" x="-41" y="91" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse">
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <feGaussianBlur result="effect1_foregroundBlur_69_17998" stdDeviation="32" />
                    </filter>
                    <filter id="gemini-filter-h" width="299.5" height="329" x="-39" y="132" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse">
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <feGaussianBlur result="effect1_foregroundBlur_69_17998" stdDeviation="32" />
                    </filter>
                </defs>
            </svg>
        );
    }

    // 2. ChatGPT / OpenAI
    if (key.includes('chatgpt') || key.includes('openai')) {
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                fillRule="evenodd"
                className={className}
                style={{ color: '#10A37F' }}
            >
                <title>OpenAI (ChatGPT)</title>
                <path d="M9.205 8.658v-2.26c0-.19.072-.333.238-.428l4.543-2.616c.619-.357 1.356-.523 2.117-.523 2.854 0 4.662 2.212 4.662 4.566 0 .167 0 .357-.024.547l-4.71-2.759a.797.797 0 00-.856 0l-5.97 3.473zm10.609 8.8V12.06c0-.333-.143-.57-.429-.737l-5.97-3.473 1.95-1.118a.433.433 0 01.476 0l4.543 2.617c1.309.76 2.189 2.378 2.189 3.948 0 1.808-1.07 3.473-2.76 4.163zM7.802 12.703l-1.95-1.142c-.167-.095-.239-.238-.239-.428V5.899c0-2.545 1.95-4.472 4.591-4.472 1 0 1.927.333 2.712.928L8.23 5.067c-.285.166-.428.404-.428.737v6.898zM12 15.128l-2.795-1.57v-3.33L12 8.658l2.795 1.57v3.33L12 15.128zm1.796 7.23c-1 0-1.927-.332-2.712-.927l4.686-2.712c.285-.166.428-.404.428-.737v-6.898l1.974 1.142c.167.095.238.238.238.428v5.233c0 2.545-1.974 4.472-4.614 4.472zm-5.637-5.303l-4.544-2.617c-1.308-.761-2.188-2.378-2.188-3.948A4.482 4.482 0 014.21 6.327v5.423c0 .333.143.571.428.738l5.947 3.449-1.95 1.118a.432.432 0 01-.476 0zm-.262 3.9c-2.688 0-4.662-2.021-4.662-4.519 0-.19.024-.38.047-.57l4.686 2.71c.286.167.571.167.856 0l5.97-3.448v2.26c0 .19-.07.333-.237.428l-4.543 2.616c-.619.357-1.356.523-2.117.523zm5.899 2.83a5.947 5.947 0 005.827-4.756C22.287 18.339 24 15.84 24 13.296c0-1.665-.713-3.282-1.998-4.448.119-.5.19-.999.19-1.498 0-3.401-2.759-5.947-5.946-5.947-.642 0-1.26.095-1.88.31A5.962 5.962 0 0010.205 0a5.947 5.947 0 00-5.827 4.757C1.713 5.447 0 7.945 0 10.49c0 1.666.713 3.283 1.998 4.448-.119.5-.19 1-.19 1.499 0 3.401 2.759 5.946 5.946 5.946.642 0 1.26-.095 1.88-.309a5.96 5.96 0 004.162 1.713z" />
            </svg>
        );
    }

    // 3. DeepSeek AI
    if (key.includes('deepseek')) {
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className={className}
                style={{ flex: 'none', lineHeight: 1 }}
            >
                <path
                    fill="#4D6BFE"
                    d="M23.748 4.482c-.254-.124-.364.113-.512.234-.051.039-.094.09-.137.136-.372.397-.806.657-1.373.626-.829-.046-1.537.214-2.163.848-.133-.782-.575-1.248-1.247-1.548-.352-.156-.708-.311-.955-.65-.172-.241-.219-.51-.305-.774-.055-.16-.11-.323-.293-.35-.2-.031-.278.136-.356.276-.313.572-.434 1.202-.422 1.84.027 1.436.633 2.58 1.838 3.393.137.093.172.187.129.323-.082.28-.18.552-.266.833-.055.179-.137.217-.329.14a5.526 5.526 0 0 1-1.736-1.18c-.857-.828-1.631-1.742-2.597-2.458a11.365 11.365 0 0 0-.689-.471c-.985-.957.13-1.743.388-1.836.27-.098.093-.432-.779-.428-.872.004-1.67.295-2.687.684a3.055 3.055 0 0 1-.465.137 9.597 9.597 0 0 0-2.883-.102c-1.885.21-3.39 1.102-4.497 2.623C.082 8.606-.231 10.684.152 12.85c.403 2.284 1.569 4.175 3.36 5.653 1.858 1.533 3.997 2.284 6.438 2.14 1.482-.085 3.133-.284 4.994-1.86.47.234.962.327 1.78.397.63.059 1.236-.03 1.705-.128.735-.156.684-.837.419-.961-2.155-1.004-1.682-.595-2.113-.926 1.096-1.296 2.746-2.642 3.392-7.003.05-.347.007-.565 0-.845-.004-.17.035-.237.23-.256a4.173 4.173 0 0 0 1.545-.475c1.396-.763 1.96-2.015 2.093-3.517.02-.23-.004-.467-.247-.588zM11.581 18c-2.089-1.642-3.102-2.183-3.52-2.16-.392.024-.321.471-.235.763.09.288.207.486.371.739.114.167.192.416-.113.603-.673.416-1.842-.14-1.897-.167-1.361-.802-2.5-1.86-3.301-3.307-.774-1.393-1.224-2.887-1.298-4.482-.02-.386.093-.522.477-.592a4.696 4.696 0 0 1 1.529-.039c2.132.312 3.946 1.265 5.468 2.774.868.86 1.525 1.887 2.202 2.891.72 1.066 1.494 2.082 2.48 2.914.348.292.625.514.891.677-.802.09-2.14.11-3.054-.614zm1-6.44a.306.306 0 0 1 .415-.287.302.302 0 0 1 .2.288.306.306 0 0 1-.31.307.303.303 0 0 1-.304-.308zm3.11 1.596c-.2.081-.399.151-.59.16a1.245 1.245 0 0 1-.798-.254c-.274-.23-.47-.358-.552-.758a1.73 1.73 0 0 1 .016-.588c.07-.327-.008-.537-.239-.727-.187-.156-.426-.199-.688-.199a.559.559 0 0 1-.254-.078.253.253 0 0 1-.114-.358c.028-.054.16-.186.192-.21.356-.202.767-.136 1.146.016.352.144.618.408 1.001.782.391.451.462.576.685.914.176.265.336.537.445.848.067.195-.019.354-.25.452z"
                />
            </svg>
        );
    }

    // 4. Claude AI / Anthropic
    if (key.includes('claude') || key.includes('anthropic')) {
        return (
            <svg
                fill="#D97757"
                role="img"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className={className}
            >
                <title>Claude</title>
                <path d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z" />
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
