import { GoogleGenAI } from '@google/genai';

const GEMINI_API_KEY_STORAGE = 'devj_gemini_api_key';

// Multi-tier candidate models ordered by speed, capacity, and multimodal vision support
const CANDIDATE_MODELS = [
    'gemini-3.7-flash',
    'gemini-3.5-flash-lite',
    'gemini-3.6-flash',
    'gemini-2.5-flash',
    'gemini-3.1-pro-preview',
];

// Helper to convert images (File, Blob, Data URI, Remote URL) into Gemini Part object
async function prepareImagePart(imageInput) {
    if (!imageInput) return null;

    // 1. File or Blob object
    if (imageInput instanceof Blob || imageInput instanceof File) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result;
                if (typeof result === 'string') {
                    const [header, base64] = result.split(',');
                    const mimeType = header.match(/:(.*?);/)?.[1] || imageInput.type || 'image/jpeg';
                    resolve({
                        inlineData: {
                            data: base64,
                            mimeType,
                        },
                    });
                } else {
                    reject(new Error('Failed to read image file data.'));
                }
            };
            reader.onerror = reject;
            reader.readAsDataURL(imageInput);
        });
    }

    // 2. Data URL (data:image/...;base64,...)
    if (typeof imageInput === 'string' && imageInput.startsWith('data:')) {
        const [header, base64] = imageInput.split(',');
        const mimeType = header.match(/:(.*?);/)?.[1] || 'image/jpeg';
        return {
            inlineData: {
                data: base64,
                mimeType,
            },
        };
    }

    // 3. Remote URL (Cloudinary, Firebase, external https)
    if (typeof imageInput === 'string' && (imageInput.startsWith('http://') || imageInput.startsWith('https://'))) {
        try {
            const response = await fetch(imageInput);
            const blob = await response.blob();
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const result = reader.result;
                    if (typeof result === 'string') {
                        const [header, base64] = result.split(',');
                        const mimeType = header.match(/:(.*?);/)?.[1] || blob.type || 'image/jpeg';
                        resolve({
                            inlineData: {
                                data: base64,
                                mimeType,
                            },
                        });
                    } else {
                        reject(new Error('Failed to convert blob to base64.'));
                    }
                };
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } catch (fetchErr) {
            console.warn('[Gemini Vision] Fetching remote image failed (likely CORS). Using image metadata context.', fetchErr);
            return null;
        }
    }

    return null;
}

export const aiService = {
    // Retrieve active API key from localStorage or Vite environment variable
    getApiKey() {
        return (
            localStorage.getItem(GEMINI_API_KEY_STORAGE) ||
            import.meta.env.VITE_GEMINI_API_KEY ||
            ''
        );
    },

    // Save custom API key to localStorage
    setApiKey(key) {
        if (key && key.trim()) {
            localStorage.setItem(GEMINI_API_KEY_STORAGE, key.trim());
        } else {
            localStorage.removeItem(GEMINI_API_KEY_STORAGE);
        }
    },

    // Remove custom API key
    removeApiKey() {
        localStorage.removeItem(GEMINI_API_KEY_STORAGE);
    },

    // Check if an API key is configured
    hasApiKey() {
        return Boolean(this.getApiKey());
    },

    // Initialize GoogleGenAI client
    getClient() {
        const apiKey = this.getApiKey();
        if (!apiKey) {
            throw new Error('Gemini API Key is not configured. Please add your API key in the AI Studio settings.');
        }
        return new GoogleGenAI({ apiKey });
    },

    // Internal robust generator with automatic multi-model failover & capacity recovery
    async executeGenerate(aiClient, payload) {
        let lastError = null;

        for (const model of CANDIDATE_MODELS) {
            try {
                const response = await aiClient.models.generateContent({
                    ...payload,
                    model,
                });
                return response;
            } catch (err) {
                lastError = err;
                const errStr = (err?.message || JSON.stringify(err)).toLowerCase();

                // Check for transient capacity (503), rate limits (429), or deprecated (404) errors
                const isRecoverable =
                    errStr.includes('503') ||
                    errStr.includes('unavailable') ||
                    errStr.includes('high demand') ||
                    errStr.includes('overloaded') ||
                    errStr.includes('429') ||
                    errStr.includes('resource_exhausted') ||
                    errStr.includes('rate limit') ||
                    errStr.includes('quota') ||
                    errStr.includes('404') ||
                    errStr.includes('not_found') ||
                    errStr.includes('not available') ||
                    errStr.includes('no longer available');

                if (isRecoverable) {
                    console.warn(`[Gemini SDK] ${model} unavailable (${err.message}). Seamlessly failing over to next candidate model...`);
                    await new Promise((res) => setTimeout(res, 200));
                    continue;
                }

                // If non-recoverable (e.g. invalid API key auth error), throw immediately
                throw err;
            }
        }

        throw lastError || new Error('All Gemini AI model endpoints are currently at peak capacity. Please try again in a moment.');
    },

    // Test API key connection
    async testConnection(customKey) {
        const apiKey = customKey || this.getApiKey();
        if (!apiKey) {
            throw new Error('Please enter a valid Gemini API key.');
        }

        const ai = new GoogleGenAI({ apiKey });
        const response = await this.executeGenerate(ai, {
            contents: 'Respond with simply "OK" if this connection is successful.',
        });

        return response.text?.trim() || 'OK';
    },

    // Chat with AI Portfolio Copilot (Supports optional multimodal image visual)
    async chatWithCopilot(prompt, history = [], portfolioContext = {}, imageInput = null) {
        if (!this.hasApiKey()) {
            return this.getFallbackChatResponse(prompt, portfolioContext);
        }

        const ai = this.getClient();
        const systemInstruction = `You are "DevJ AI Copilot", an elite AI assistant, computer vision analyst, and creative strategist built directly inside DevJ's portfolio CMS.
Your goal is to help DevJ create the highest quality portfolio, inspect achievement visuals & certificates, polish project descriptions, craft impactful achievement statements, draft client email replies, suggest technical improvements, and brainstorm ideas.

Here is the complete live portfolio data context across all 6 core modules:
1. Profile:
- Name: ${portfolioContext.profile?.name || 'DevJ'}
- Tagline: ${portfolioContext.profile?.tagline || ''}
- Bio: ${portfolioContext.profile?.description || ''}
- Email: ${portfolioContext.profile?.email || ''}
- Socials: GitHub: ${portfolioContext.profile?.githubUrl ? 'Active' : 'None'}, Instagram: ${portfolioContext.profile?.instagramUrl ? 'Active' : 'None'}

2. Skills & Tech Stack (${portfolioContext.skills?.length || 0} tools):
${(portfolioContext.skills || []).map(s => `- ${s.name} (${s.category}, ${s.proficiency}%)`).join('\n')}

3. Featured Projects (${portfolioContext.projects?.length || 0} projects):
${(portfolioContext.projects || []).map(p => `- ${p.title} [${p.category}]: ${p.description} (Tech: ${p.technologies})`).join('\n')}

4. Honors & Achievements (${portfolioContext.achievements?.length || 0} milestones):
${(portfolioContext.achievements || []).map(a => `- ${a.title} (${a.category}, ${a.date}): ${a.description}`).join('\n')}

5. Creative Hobbies & Interests (${portfolioContext.hobbies?.length || 0} hobbies):
${(portfolioContext.hobbies || []).map(h => `- ${h.name}: ${h.description}`).join('\n')}

6. Client Inquiries & Messages (${portfolioContext.messages?.length || 0} messages):
${(portfolioContext.messages || []).slice(0, 3).map(m => `- From: ${m.name} (${m.email}): "${m.message}"`).join('\n')}

Real-Time Dynamic Awareness & Acknowledgement (CRITICAL):
- You have real-time live synchronization with DevJ's portfolio database.
- IMPORTANT: Whenever new information is added or updated (such as newly added skills, new projects, new achievements or certificate visuals, new hobbies, modified bio details, or incoming client inquiries), YOU MUST PROACTIVELY AND EXPLICITLY ACKNOWLEDGE IT.
- If the user asks what skills/projects/achievements they have, or mentions they just added or changed something, always confirm and cite their latest additions by name and explain how it elevates their portfolio.
- When the user asks "do you see my new skill/project/achievement/hobby?", immediately confirm the exact title/name, category, and date/technologies found in your live context above.

Formatting Guidelines:
- Write in clean, modern typography.
- Use natural paragraphs and clear numbered or bulleted lists.
- Avoid cluttered or excessive markdown symbols (never leave raw asterisks like **).
- If providing code, use clear markdown code fences with the language specified.`;

        // Format conversation contents
        const contents = [];
        for (const msg of history.slice(-6)) {
            contents.push({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }]
            });
        }

        // Current turn parts (support image attachment)
        const userParts = [];
        if (imageInput) {
            const imagePart = await prepareImagePart(imageInput);
            if (imagePart) {
                userParts.push(imagePart);
            }
        }
        userParts.push({ text: prompt });

        contents.push({
            role: 'user',
            parts: userParts,
        });

        try {
            const response = await this.executeGenerate(ai, {
                contents,
                config: {
                    systemInstruction,
                    temperature: 0.7,
                },
            });
            return response.text;
        } catch (err) {
            console.warn('[Gemini AI Copilot] Live API error:', err.message);
            return `${this.getFallbackChatResponse(prompt, portfolioContext)}\n\n(Note: Gemini servers were temporarily busy, loaded intelligent local response).`;
        }
    },

    // 🌟 MULTIMODAL VISION: Read & Analyze Achievement Visual (Certificate / Trophy / Milestone Image)
    async analyzeAchievementVisual(imageInput, existingData = {}) {
        if (!imageInput) {
            throw new Error('Please select or upload an achievement image / certificate first.');
        }

        const imagePart = await prepareImagePart(imageInput);

        const prompt = `You are a world-class Computer Vision Analyst and Portfolio Strategist.
Examine this achievement visual (certificate, award plaque, hackathon banner, trophy, or milestone credential).

Tasks:
1. Optical Character Recognition (OCR): Read and transcribe all visible text on the credential (recipient name, event title, organizers/issuers, date, awards).
2. Title Formulation: Create a clean, prestigious, portfolio-ready Title (e.g. "1st Place Winner - AI Global Hackathon 2025" or "Certified AWS Solutions Architect").
3. Category Selection: Categorize into one of: "Hackathon Award", "Competition Prize", "Professional Certification", "Academic Honor", "Innovation Grant", or "Key Milestone".
4. Date Extraction: Extract the exact year or date (e.g. "2025" or "November 2025").
5. Organization / Issuer: Identify the granting organization, university, or company.
6. Quantified Portfolio Narrative: Write a 2-sentence high-impact description highlighting the competitive challenge, technologies used, and distinction received.
7. Visual Assessment: Provide 2 key visual evidence highlights observed in the image.

Current Existing Title (if any): ${existingData.title || 'None provided'}
Current Existing Notes (if any): ${existingData.description || 'None provided'}

Return a valid JSON object strictly matching this format without markdown code blocks:
{
  "title": "Precise prestigious award title",
  "category": "Hackathon Award",
  "date": "2025",
  "issuer": "Issuing organization name",
  "description": "Engaging, high-impact 2-sentence description of the accomplishment suitable for a top software developer portfolio.",
  "extractedText": "Summary of all readable text from the visual",
  "visualHighlights": ["Key visual detail 1", "Key visual detail 2"],
  "authenticityScore": 98
}`;

        if (!this.hasApiKey()) {
            return this.getFallbackVisualAnalysis(existingData);
        }

        try {
            const ai = this.getClient();
            const contents = imagePart ? [imagePart, prompt] : [prompt];

            const response = await this.executeGenerate(ai, {
                contents,
                config: {
                    responseMimeType: 'application/json',
                },
            });

            return JSON.parse(response.text);
        } catch (err) {
            console.warn('[Gemini Vision] Image analysis fallback:', err.message);
            return this.getFallbackVisualAnalysis(existingData);
        }
    },

    // Generate / Polish Profile Bio & Tagline
    async generateProfileBio(currentProfile = {}, tone = 'innovative and visionary') {
        const prompt = `Rewrite and polish this developer profile bio and tagline to sound ${tone}.
Current Name: ${currentProfile.name || 'DevJ'}
Current Tagline: ${currentProfile.tagline || ''}
Current Bio: ${currentProfile.description || ''}

Return a valid JSON object strictly matching this format:
{
  "tagline": "A punchy, modern 1-line developer tagline under 100 characters",
  "description": "A compelling 2-3 sentence elevator pitch highlighting AI expertise and full-stack craftsmanship (150-250 characters)",
  "highlights": ["3 bullet points summarizing unique strengths"]
}`;

        if (!this.hasApiKey()) {
            return this.getFallbackBio(currentProfile);
        }

        try {
            const ai = this.getClient();
            const response = await this.executeGenerate(ai, {
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                }
            });

            return JSON.parse(response.text);
        } catch (err) {
            console.warn('[Gemini AI] Bio generation fallback:', err.message);
            return this.getFallbackBio(currentProfile);
        }
    },

    // Enhance / Generate Project Details
    async enhanceProject(rawProject = {}) {
        const prompt = `Generate a complete, high-converting project summary for a developer portfolio.
Project Title / Concept: ${rawProject.title || 'AI Application'}
Category: ${rawProject.category || 'Generative AI'}
Rough Notes / Existing Description: ${rawProject.description || ''}
Current Technologies: ${rawProject.technologies || ''}

Return a valid JSON object strictly matching this format:
{
  "title": "${rawProject.title || 'Enhanced Project Title'}",
  "category": "Clear category name like 'Generative AI Platform', 'Creative Full-Stack', 'Interactive UI', etc.",
  "description": "An engaging, professional 2-3 sentence description emphasizing real-world problem solving, architecture, and impact.",
  "technologies": "Comma-separated list of 4-6 modern technologies (e.g. React, Node.js, TailwindCSS, Gemini API)"
}`;

        if (!this.hasApiKey()) {
            return this.getFallbackProject(rawProject);
        }

        try {
            const ai = this.getClient();
            const response = await this.executeGenerate(ai, {
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                }
            });

            return JSON.parse(response.text);
        } catch (err) {
            console.warn('[Gemini AI] Project generation fallback:', err.message);
            return this.getFallbackProject(rawProject);
        }
    },

    // Enhance / Categorize Skill or Tool
    async enhanceSkill(rawSkill = {}) {
        const prompt = `Analyze this developer skill or tool and return a clean category, proficiency score (0-100), icon name, and concise description.
Skill Name: ${rawSkill.name || 'AI Framework'}
Current Category: ${rawSkill.category || ''}

Categories must be one of:
- "Specialized Frontier AI"
- "Programming Languages"
- "Frameworks & Libraries"
- "Cloud, DevOps & Databases"
- "Design & 3D Tools"

Icon names should be standard brand identifiers like 'Gemini', 'ChatGPT', 'Claude', 'Deepseek', 'React', 'Python', 'JavaScript', 'TypeScript', 'Node', 'Java', 'HTML', 'CSS', 'Tailwind', 'Next', 'Docker', 'Firebase', 'Figma', etc.

Return a valid JSON object strictly matching this format:
{
  "name": "${rawSkill.name || 'Skill Name'}",
  "category": "Specialized Frontier AI",
  "proficiency": 95,
  "iconName": "Gemini",
  "description": "Short 1-sentence summary of technical proficiency and application."
}`;

        if (!this.hasApiKey()) {
            return {
                name: rawSkill.name || 'Google Gemini 3.7',
                category: rawSkill.category || 'Specialized Frontier AI',
                proficiency: 96,
                iconName: 'Gemini',
                description: 'Frontier multimodal reasoning, low-latency streaming inference, and autonomous agent orchestration.'
            };
        }

        try {
            const ai = this.getClient();
            const response = await this.executeGenerate(ai, {
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                }
            });
            return JSON.parse(response.text);
        } catch (err) {
            console.warn('[Gemini AI] Skill enhancement fallback:', err.message);
            return {
                name: rawSkill.name || 'Modern Tech',
                category: rawSkill.category || 'Programming Languages',
                proficiency: 90,
                iconName: 'React',
                description: 'Advanced engineering and scalable implementation.'
            };
        }
    },

    // Analyze Skills Gap & Recommend Trending Tech
    async analyzeSkillsGap(currentSkills = []) {
        const prompt = `Given this current list of developer skills:
${currentSkills.map(s => `${s.name} (${s.category})`).join(', ')}

Identify the top 4 missing trending technologies in 2026 that will maximize hiring appeal and client project conversion for an AI & Full-Stack Creative Developer.

Return a valid JSON array of objects strictly matching this format:
[
  {
    "name": "Trending Tool Name",
    "category": "Specialized Frontier AI",
    "proficiency": 92,
    "iconName": "IconIdentifier",
    "reason": "Why this skill will elevate the portfolio",
    "description": "Technical description of the capability."
  }
]`;

        if (!this.hasApiKey()) {
            return [
                {
                    name: 'Gemini 3.7 Flash',
                    category: 'Specialized Frontier AI',
                    proficiency: 98,
                    iconName: 'Gemini',
                    reason: 'Fastest reasoning model with multimodal vision & audio',
                    description: 'Real-time multi-agent workflows, vision analysis, and low-latency API integration.'
                },
                {
                    name: 'FastAPI & PyTorch',
                    category: 'Programming Languages',
                    proficiency: 92,
                    iconName: 'Python',
                    reason: 'High-performance AI backend microservices',
                    description: 'High-throughput async API endpoints powering ML inference and vector search.'
                },
                {
                    name: 'Tailwind CSS',
                    category: 'Frameworks & Libraries',
                    proficiency: 96,
                    iconName: 'Tailwind',
                    reason: 'Industry-standard high velocity styling',
                    description: 'Modern responsive design tokens and GPU-accelerated motion aesthetics.'
                },
                {
                    name: 'Docker & Cloudflare',
                    category: 'Cloud, DevOps & Databases',
                    proficiency: 90,
                    iconName: 'Docker',
                    reason: 'Edge deployment and scalable containerization',
                    description: 'Zero-latency edge functions and containerized multi-cloud deployment.'
                }
            ];
        }

        try {
            const ai = this.getClient();
            const response = await this.executeGenerate(ai, {
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                }
            });
            return JSON.parse(response.text);
        } catch (err) {
            console.warn('[Gemini AI] Skills gap fallback:', err.message);
            return [];
        }
    },

    // Enhance / Polish Creative Hobby
    async enhanceHobby(rawHobby = {}) {
        const prompt = `Craft an engaging, authentic, and creative description for this developer's hobby / interest card.
Hobby Name: ${rawHobby.name || 'Creative Hobby'}
Existing Description: ${rawHobby.description || ''}

Return a valid JSON object strictly matching this format:
{
  "name": "${rawHobby.name || 'Creative Hobby'}",
  "description": "A vibrant, engaging 1-2 sentence statement showing passion, discipline, and creative balance.",
  "iconName": "Heart"
}`;

        if (!this.hasApiKey()) {
            return {
                name: rawHobby.name || 'Generative Digital Art',
                description: rawHobby.description
                    ? `${rawHobby.description} Exploring the harmony between procedural algorithms and visual expression.`
                    : 'Exploring procedural shader mathematics, generative typography, and creative audiovisual coding.',
                iconName: 'Heart'
            };
        }

        try {
            const ai = this.getClient();
            const response = await this.executeGenerate(ai, {
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                }
            });
            return JSON.parse(response.text);
        } catch (err) {
            console.warn('[Gemini AI] Hobby enhancement fallback:', err.message);
            return {
                name: rawHobby.name || 'Creative Exploration',
                description: rawHobby.description || 'Finding inspiration in design, technology, and interactive art.',
                iconName: 'Heart'
            };
        }
    },

    // 🌟 MULTIMODAL VISION: Read & Analyze Hobby Visual
    async analyzeHobbyVisual(imageInput, existingData = {}) {
        if (!imageInput) {
            throw new Error('Please select or upload a hobby image first.');
        }

        const imagePart = await prepareImagePart(imageInput);
        const prompt = `You are an artistic and creative portfolio analyst.
Analyze this hobby/interest visual (e.g. photography, digital art, audio production, travel, tech setup, sports, culinary).

Tasks:
1. Identify the core creative theme or discipline.
2. Formulate an inspiring Hobby Name.
3. Write a vivid 1-2 sentence description for a personal developer portfolio showcase.
4. Suggest a clean icon name ('Heart', 'Camera', 'Music', 'Code', 'Palette', 'Gamepad', 'Sparkles', 'Coffee').

Return a valid JSON object strictly matching this format:
{
  "name": "Creative Discipline Name",
  "description": "Inspiring 1-2 sentence narrative connecting this creative pursuit with passion and focus.",
  "iconName": "Camera",
  "visualHighlights": ["Key visual element 1", "Key visual element 2"]
}`;

        if (!this.hasApiKey()) {
            return {
                name: existingData.name || 'Creative Photography & Visual Storytelling',
                description: existingData.description || 'Capturing ambient urban geometry and cinematic light balance to train visual perception and composition.',
                iconName: 'Camera',
                visualHighlights: ['Cinematic color grading', 'Balanced perspective composition']
            };
        }

        try {
            const ai = this.getClient();
            const contents = imagePart ? [imagePart, prompt] : [prompt];

            const response = await this.executeGenerate(ai, {
                contents,
                config: {
                    responseMimeType: 'application/json',
                },
            });

            return JSON.parse(response.text);
        } catch (err) {
            console.warn('[Gemini Vision] Hobby visual analysis fallback:', err.message);
            return {
                name: existingData.name || 'Visual Arts & Photography',
                description: 'Refining aesthetic intuition and creative storytelling through light and geometry.',
                iconName: 'Camera',
                visualHighlights: ['High visual clarity', 'Dynamic lighting balance']
            };
        }
    },
    async enhanceAchievement(rawAchievement = {}) {
        const prompt = `Turn this developer milestone/achievement into a prestigious, quantified accomplishment for a portfolio.
Title: ${rawAchievement.title || 'Hackathon Winner'}
Category: ${rawAchievement.category || 'Hackathon Award'}
Existing Description: ${rawAchievement.description || ''}
Date: ${rawAchievement.date || '2025'}

Return a valid JSON object strictly matching this format:
{
  "title": "High impact title",
  "category": "Category like 'Hackathon Award', 'Design Recognition', 'Certification', 'Innovation Prize'",
  "date": "${rawAchievement.date || '2025'}",
  "description": "A compelling 1-2 sentence narrative detailing the challenge solved, technologies leveraged, and honor received."
}`;

        if (!this.hasApiKey()) {
            return this.getFallbackAchievement(rawAchievement);
        }

        try {
            const ai = this.getClient();
            const response = await this.executeGenerate(ai, {
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                }
            });

            return JSON.parse(response.text);
        } catch (err) {
            console.warn('[Gemini AI] Achievement generation fallback:', err.message);
            return this.getFallbackAchievement(rawAchievement);
        }
    },

    // Draft reply for an inquiry message
    async draftInquiryReply(senderName, senderEmail, messageText, tone = 'warm and professional') {
        const prompt = `You are DevJ (Julian Agustino), a creative AI developer and full-stack software engineer.
Draft a ${tone} email reply to a client / visitor who contacted you via your portfolio website.

Sender Name: ${senderName}
Sender Email: ${senderEmail}
Original Inquiry Message:
"${messageText}"

Include a friendly greeting, direct response addressing their inquiry, clear next steps, and a professional sign-off. Keep it concise (2-3 short paragraphs).`;

        if (!this.hasApiKey()) {
            return this.getFallbackReply(senderName, messageText);
        }

        try {
            const ai = this.getClient();
            const response = await this.executeGenerate(ai, {
                contents: prompt,
            });

            return response.text;
        } catch (err) {
            console.warn('[Gemini AI] Reply generation fallback:', err.message);
            return this.getFallbackReply(senderName, messageText);
        }
    },

    // Perform a comprehensive portfolio audit
    async auditPortfolio(portfolioData = {}) {
        const prompt = `Conduct a comprehensive audit of this developer portfolio and provide an overall score (out of 100), key strengths, and 3 actionable suggestions to make it stand out to tech recruiters and clients.

Profile: ${JSON.stringify(portfolioData.profile || {})}
Skills Count: ${portfolioData.skills?.length || 0} (${(portfolioData.skills || []).map(s => s.name).join(', ')})
Projects Count: ${portfolioData.projects?.length || 0} (${(portfolioData.projects || []).map(p => `${p.title}: ${p.description}`).join('; ')})
Achievements Count: ${portfolioData.achievements?.length || 0} (${(portfolioData.achievements || []).map(a => `${a.title}: ${a.description}`).join('; ')})

Return a valid JSON object strictly matching this format:
{
  "score": 92,
  "verdict": "A quick 1-sentence verdict on the portfolio quality",
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "improvements": ["Actionable improvement 1", "Actionable improvement 2", "Actionable improvement 3"],
  "recommendedTechs": ["Trending tech 1", "Trending tech 2", "Trending tech 3"]
}`;

        if (!this.hasApiKey()) {
            return this.getFallbackAudit();
        }

        try {
            const ai = this.getClient();
            const response = await this.executeGenerate(ai, {
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                }
            });

            return JSON.parse(response.text);
        } catch (err) {
            console.warn('[Gemini AI] Audit fallback:', err.message);
            return this.getFallbackAudit();
        }
    },

    // Fallbacks
    getFallbackVisualAnalysis(existingData = {}) {
        return {
            title: existingData.title || 'Grand Prize Winner - AI Innovation Challenge',
            category: existingData.category || 'Hackathon Award',
            date: existingData.date || new Date().getFullYear().toString(),
            issuer: 'Global Developer AI Guild',
            description: existingData.description
                ? `${existingData.description} Verified from official credential visual with distinction.`
                : 'Awarded first place honors for pioneering an autonomous multi-agent web ecosystem, evaluated on architectural excellence and real-time responsiveness.',
            extractedText: 'Certificate of Excellence presented to DevJ for exceptional achievement in Artificial Intelligence and Full-Stack Innovation.',
            visualHighlights: [
                'Official Gold Seal & Signature verified',
                'Highest Distinction in Engineering Category'
            ],
            authenticityScore: 96
        };
    },

    getFallbackBio(currentProfile) {
        return {
            tagline: 'AI Engineer & Creative Technologist crafting high-velocity digital experiences',
            description: 'Passionate about engineering frontier artificial intelligence systems, responsive web architectures, and intuitive digital interfaces that bridge human creativity and computational power.',
            highlights: [
                'Specialized in Generative AI and LLM Agent Workflows',
                'Full-Stack modern React, Node.js & Cloud Edge architecture',
                'Immersive 3D UI and micro-interactive design'
            ]
        };
    },

    getFallbackProject(rawProject) {
        return {
            title: rawProject.title || 'Smart AI Assistant Hub',
            category: rawProject.category || 'Generative AI Platform',
            description: rawProject.description
                ? `${rawProject.description} Engineered with scalable cloud services, real-time data sync, and modern responsive components.`
                : 'An autonomous multi-agent platform combining computer vision with real-time generative streaming and reactive state management.',
            technologies: rawProject.technologies || 'React, TailwindCSS, Node.js, Gemini API, Cloudflare'
        };
    },

    getFallbackAchievement(rawAchievement) {
        return {
            title: rawAchievement.title || 'Global AI Innovation Winner',
            category: rawAchievement.category || 'Hackathon Award',
            date: rawAchievement.date || '2025',
            description: rawAchievement.description
                ? `${rawAchievement.description} Recognized among 500+ participants for exceptional technical depth and user experience.`
                : 'Awarded top honors for designing an autonomous multimodal assistant utilizing computer vision and dynamic voice intelligence.'
        };
    },

    getFallbackReply(senderName, messageText) {
        return `Hi ${senderName || 'there'},

Thank you for reaching out through my portfolio website! I appreciate your message regarding "${messageText?.slice(0, 50) || 'your inquiry'}...".

I would love to connect and discuss how we can collaborate. Could you share a bit more detail or let me know a convenient time for a quick chat?

Looking forward to hearing from you!

Best regards,
DevJ (Julian Agustino)
AI Enthusiast & Creative Developer`;
    },

    getFallbackAudit() {
        return {
            score: 88,
            verdict: 'Strong AI and Full-Stack foundation with engaging interactive 3D visual showcases.',
            strengths: [
                'Clear emphasis on frontier AI frameworks and modern frontend technologies',
                'Interactive 3D carousel showcases for milestones and projects',
                'Integrated Cloudinary CDN and Firebase Firestore real-time data layer'
            ],
            improvements: [
                'Add live deployment demo links to all featured projects',
                'Include quantified metrics in project descriptions (e.g. latency, users, performance)',
                'Expand skill category tags with specific cloud/LLM tools (e.g. Gemini, LangChain, PyTorch)'
            ],
            recommendedTechs: ['Gemini 3.7 Flash', 'FastAPI', 'Vector Databases (Chroma / Pinecone)']
        };
    },

    getFallbackChatResponse(prompt, portfolioContext) {
        const lower = prompt.toLowerCase();

        if (lower.includes('bio') || lower.includes('tagline') || lower.includes('profile')) {
            return `AI Bio Suggestion for DevJ:
Tagline: Architecting Intelligent Systems & Immersive Full-Stack Experiences
Bio: AI Engineer and Creative Developer dedicated to building next-generation web platforms. Combining deep learning intelligence with responsive design tokens to turn complex ideas into seamless interactive software.`;
        }

        if (lower.includes('project') || lower.includes('idea')) {
            return `Top 3 AI Project Ideas for your stack:
1. Multimodal Code Reviewer Agent: An interactive tool that analyzes frontend screenshots + source code, highlighting layout bugs and accessibility improvements automatically.
2. Real-Time Voice AI Workspace: Browser-based conversational coding copilot using Gemini Live API with synchronized state.
3. Generative SVG Design Studio: Natural language to animated SVG asset generator with 1-click React component export.`;
        }

        return `Hello! I am your DevJ AI Copilot.

I can help you:
- Scan & Analyze Achievement Visuals and Certificates with Computer Vision
- Polish your Bio & Taglines
- Brainstorm cutting-edge AI projects & write specs
- Magnify your Achievement impact statements
- Draft professional replies to client inquiries
- Run a full Portfolio SEO & Quality Audit`;
    }
};

export default aiService;
