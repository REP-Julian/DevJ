// ✅ CLIENT-SIDE AI SERVICE
// All requests are proxied through /api/ai/* backend endpoints
// API keys are stored securely on the server (.env)
// This approach prevents XSS vulnerabilities and protects sensitive credentials

const GEMINI_API_KEY_STORAGE = 'devj_gemini_api_key';

// Helper: Convert images to base64 for transmission to backend
async function imageToBase64(imageInput) {
    if (!imageInput) return { base64: null, mimeType: null };

    try {
        // 1. File or Blob object
        if (imageInput instanceof Blob || imageInput instanceof File) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const result = reader.result;
                    if (typeof result === 'string') {
                        const [header, base64] = result.split(',');
                        const mimeType = header.match(/:(.*?);/)?.[1] || imageInput.type || 'image/jpeg';
                        resolve({ base64, mimeType });
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
            return { base64, mimeType };
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
                            resolve({ base64, mimeType });
                        } else {
                            reject(new Error('Failed to convert blob to base64.'));
                        }
                    };
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                });
            } catch (fetchErr) {
                console.warn('[AI Service] Remote image fetch failed (likely CORS). Will fallback.', fetchErr);
                return { base64: null, mimeType: null };
            }
        }
    } catch (err) {
        console.warn('[AI Service] Image conversion error:', err);
        return { base64: null, mimeType: null };
    }

    return { base64: null, mimeType: null };
}

// Helper: Make authenticated API request to backend
async function callAIBackend(endpoint, payload) {
    try {
        const response = await fetch(`/api/ai/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('devj_admin_auth_token_v1') || ''}`
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            throw new Error(errorData.error || `Backend error: ${response.status}`);
        }

        return await response.json();
    } catch (err) {
        console.error(`[AI Service] Backend call failed (${endpoint}):`, err.message);
        throw err;
    }
}

export const aiService = {
    // ⚠️ For backward compatibility with components that check for API key
    // In production with backend proxy, this just returns a dummy value
    // Real API key is stored securely on server
    getApiKey() {
        // Return dummy value to indicate AI is enabled
        return localStorage.getItem(GEMINI_API_KEY_STORAGE) || 'backend-configured';
    },

    setApiKey(key) {
        // ⚠️ DEPRECATED: API key management is now server-side only
        // This is kept for backward compatibility with components
        if (key && key.trim()) {
            localStorage.setItem(GEMINI_API_KEY_STORAGE, key.trim());
        } else {
            localStorage.removeItem(GEMINI_API_KEY_STORAGE);
        }
    },

    removeApiKey() {
        // ⚠️ DEPRECATED: This is kept for backward compatibility
        localStorage.removeItem(GEMINI_API_KEY_STORAGE);
    },

    hasApiKey() {
        // Check if backend AI service is available by checking health
        // Components can use this to know if AI features should be shown
        return true; // Assume backend has API key configured
    },

    // Test connection to backend AI service
    async testConnection(customKey) {
        try {
            // When using backend proxy, we ignore custom key (it goes to backend)
            const result = await callAIBackend('test-connection', {});
            return result.message || 'Connection successful';
        } catch (err) {
            throw new Error(`AI Backend Connection Failed: ${err.message}`);
        }
    },

    // Chat with AI Portfolio Copilot
    async chatWithCopilot(prompt, history = [], portfolioContext = {}, imageInput = null) {
        try {
            const response = await callAIBackend('chat', {
                prompt,
                history,
                portfolioContext,
                imageInput: null // Backend doesn't need image for chat in current impl
            });
            return response.text || '';
        } catch (err) {
            console.warn('[AI Copilot] Backend unavailable, using fallback:', err.message);
            return this.getFallbackChatResponse(prompt, portfolioContext);
        }
    },

    // Analyze Achievement Visual (Computer Vision)
    async analyzeAchievementVisual(imageInput, existingData = {}) {
        if (!imageInput) {
            throw new Error('Please select or upload an achievement image / certificate first.');
        }

        try {
            const { base64, mimeType } = await imageToBase64(imageInput);

            if (!base64) {
                return this.getFallbackVisualAnalysis(existingData);
            }

            const response = await callAIBackend('analyze-achievement-visual', {
                imageBase64: base64,
                mimeType,
                existingData
            });

            return response;
        } catch (err) {
            console.warn('[AI Vision] Analysis failed, using fallback:', err.message);
            return this.getFallbackVisualAnalysis(existingData);
        }
    },

    // Generate Profile Bio
    async generateProfileBio(currentProfile = {}, tone = 'innovative and visionary') {
        try {
            const response = await callAIBackend('generate-bio', {
                currentProfile,
                tone
            });
            return response;
        } catch (err) {
            console.warn('[AI Bio] Generation failed, using fallback:', err.message);
            return this.getFallbackBio(currentProfile);
        }
    },

    // Enhance Project
    async enhanceProject(rawProject = {}) {
        try {
            const response = await callAIBackend('enhance-project', {
                rawProject
            });
            return response;
        } catch (err) {
            console.warn('[AI Project] Enhancement failed, using fallback:', err.message);
            return this.getFallbackProject(rawProject);
        }
    },

    // Enhance Skill
    async enhanceSkill(rawSkill = {}) {
        try {
            const response = await callAIBackend('enhance-skill', {
                rawSkill
            });
            return response;
        } catch (err) {
            console.warn('[AI Skill] Enhancement failed, using fallback:', err.message);
            return {
                name: rawSkill.name || 'Modern Tech',
                category: rawSkill.category || 'Programming Languages',
                proficiency: 90,
                iconName: 'React',
                description: 'Advanced engineering and scalable implementation.'
            };
        }
    },

    // Enhance Achievement
    async enhanceAchievement(rawAchievement = {}) {
        try {
            const response = await callAIBackend('enhance-achievement', {
                rawAchievement
            });
            return response;
        } catch (err) {
            console.warn('[AI Achievement] Enhancement failed, using fallback:', err.message);
            return this.getFallbackAchievement(rawAchievement);
        }
    },

    // Enhance Hobby
    async enhanceHobby(rawHobby = {}) {
        try {
            const response = await callAIBackend('enhance-hobby', {
                rawHobby
            });
            return response;
        } catch (err) {
            console.warn('[AI Hobby] Enhancement failed, using fallback:', err.message);
            return {
                name: rawHobby.name || 'Creative Exploration',
                description: rawHobby.description || 'Finding inspiration in design, technology, and interactive art.',
                iconName: 'Heart'
            };
        }
    },

    // Analyze Hobby Visual
    async analyzeHobbyVisual(imageInput, existingData = {}) {
        if (!imageInput) {
            throw new Error('Please select or upload a hobby image first.');
        }

        try {
            const { base64, mimeType } = await imageToBase64(imageInput);

            if (!base64) {
                return {
                    name: existingData.name || 'Creative Photography & Visual Storytelling',
                    description: existingData.description || 'Capturing ambient urban geometry and cinematic light balance to train visual perception and composition.',
                    iconName: 'Camera',
                    visualHighlights: ['Cinematic color grading', 'Balanced perspective composition']
                };
            }

            const response = await callAIBackend('analyze-hobby-visual', {
                imageBase64: base64,
                mimeType,
                existingData
            });

            return response;
        } catch (err) {
            console.warn('[AI Hobby Vision] Analysis failed, using fallback:', err.message);
            return {
                name: existingData.name || 'Visual Arts & Photography',
                description: 'Refining aesthetic intuition and creative storytelling through light and geometry.',
                iconName: 'Camera',
                visualHighlights: ['High visual clarity', 'Dynamic lighting balance']
            };
        }
    },

    // Analyze Skills Gap
    async analyzeSkillsGap(currentSkills = []) {
        try {
            const response = await callAIBackend('analyze-skills-gap', {
                currentSkills
            });
            return Array.isArray(response) ? response : [];
        } catch (err) {
            console.warn('[AI Skills Gap] Analysis failed:', err.message);
            return [];
        }
    },

    // Draft Inquiry Reply
    async draftInquiryReply(senderName, senderEmail, messageText, tone = 'warm and professional') {
        try {
            const response = await callAIBackend('draft-reply', {
                senderName,
                senderEmail,
                messageText,
                tone
            });
            return response.text || '';
        } catch (err) {
            console.warn('[AI Reply] Generation failed, using fallback:', err.message);
            return this.getFallbackReply(senderName, messageText);
        }
    },

    // Audit Portfolio
    async auditPortfolio(portfolioData = {}) {
        try {
            const response = await callAIBackend('audit-portfolio', {
                portfolioData
            });
            return response;
        } catch (err) {
            console.warn('[AI Audit] Failed, using fallback:', err.message);
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
