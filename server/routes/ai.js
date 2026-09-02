import express from 'express';
import { GoogleGenAI } from '@google/genai';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// ✅ Initialize Gemini Client with server-side API key (NOT exposed to client)
const GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY;

// Candidate models for automatic failover (prioritizing stable high-availability models)
const CANDIDATE_MODELS = [
    'gemini-3.6-flash',
    'gemini-3.7-flash',
    'gemini-3.5-flash-lite',
    'gemini-3.1-pro-preview',
];

// Helper: Execute generate with automatic model failover
async function executeGenerate(payload) {
    if (!GEMINI_API_KEY) {
        throw new Error('Gemini API Key is not configured on the server.');
    }

    let lastError = null;
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    for (const model of CANDIDATE_MODELS) {
        try {
            const response = await ai.models.generateContent({
                ...payload,
                model,
            });
            return response;
        } catch (err) {
            lastError = err;
            const errStr = (err?.message || JSON.stringify(err)).toLowerCase();

            // Check for transient capacity/rate limit or retired model errors
            const isRecoverable =
                errStr.includes('503') ||
                errStr.includes('unavailable') ||
                errStr.includes('429') ||
                errStr.includes('resource_exhausted') ||
                errStr.includes('rate limit') ||
                errStr.includes('quota') ||
                errStr.includes('404') ||
                errStr.includes('not found') ||
                errStr.includes('no longer available');

            if (isRecoverable) {
                console.warn(`[Gemini] ${model} temporarily unavailable or retired, trying next model...`);
                await new Promise((res) => setTimeout(res, 200));
                continue;
            }

            // Non-recoverable error, throw immediately
            throw err;
        }
    }

    throw lastError || new Error('All Gemini models are at capacity. Please try again later.');
}

// Test API Key connection
router.post('/test-connection', authenticateToken, async (req, res) => {
    try {
        if (!GEMINI_API_KEY) {
            return res.status(400).json({ error: 'Gemini API key not configured on server.' });
        }

        const response = await executeGenerate({
            contents: 'Respond with simply "OK" if this connection is successful.',
        });

        res.json({ success: true, message: response.text?.trim() || 'OK' });
    } catch (error) {
        res.status(500).json({ error: error.message || 'Connection test failed' });
    }
});

// Chat with AI Copilot
router.post('/chat', authenticateToken, async (req, res) => {
    try {
        const { prompt, history = [], portfolioContext = {}, imageInput = null } = req.body;

        if (!GEMINI_API_KEY) {
            return res.status(400).json({ error: 'Gemini API key not configured.' });
        }

        const systemInstruction = `You are "DevJ AI Copilot", an elite AI assistant and creative strategist built into the portfolio CMS.

Complete live portfolio context:
1. Profile: ${portfolioContext.profile?.name || 'DevJ'} - ${portfolioContext.profile?.tagline || ''}
2. Skills (${portfolioContext.skills?.length || 0}): ${(portfolioContext.skills || []).map(s => `${s.name} (${s.proficiency}%)`).join(', ')}
3. Projects (${portfolioContext.projects?.length || 0}): ${(portfolioContext.projects || []).map(p => p.title).join(', ')}
4. Achievements (${portfolioContext.achievements?.length || 0}): ${(portfolioContext.achievements || []).map(a => a.title).join(', ')}
5. Hobbies (${portfolioContext.hobbies?.length || 0}): ${(portfolioContext.hobbies || []).map(h => h.name).join(', ')}

CRITICAL: Acknowledge any newly added or updated portfolio items by name and explain how they enhance the profile.

Formatting: Use clean, modern typography with natural paragraphs. Avoid excessive markdown symbols.`;

        // Format conversation history
        const contents = [];
        for (const msg of history.slice(-6)) {
            contents.push({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }]
            });
        }

        // Current turn
        contents.push({
            role: 'user',
            parts: [{ text: prompt }]
        });

        const response = await executeGenerate({
            contents,
            config: {
                systemInstruction,
                temperature: 0.7,
            },
        });

        res.json({ text: response.text });
    } catch (error) {
        console.error('[AI Service] Chat error:', error);
        res.status(500).json({ error: error.message || 'Chat generation failed' });
    }
});

// Analyze Achievement Visual (Computer Vision)
router.post('/analyze-achievement-visual', authenticateToken, async (req, res) => {
    try {
        const { imageBase64, mimeType, existingData = {} } = req.body;

        if (!GEMINI_API_KEY) {
            return res.status(400).json({ error: 'Gemini API key not configured.' });
        }

        if (!imageBase64) {
            return res.status(400).json({ error: 'Image data required.' });
        }

        const prompt = `You are a world-class Computer Vision Analyst examining an achievement credential (certificate, award, trophy, milestone).

Tasks:
1. OCR: Transcribe all visible text
2. Title: Create prestigious portfolio title (e.g. "1st Place - Global AI Hackathon 2025")
3. Category: Classify as "Hackathon Award", "Competition Prize", "Professional Certification", "Academic Honor", "Innovation Grant", or "Key Milestone"
4. Date: Extract exact year or date
5. Organization: Identify issuer
6. Description: Write 2-sentence impact narrative
7. Visual Evidence: Provide 2 key highlights

Current Title (if any): ${existingData.title || 'None'}

Return valid JSON (no markdown):
{
  "title": "Prestigious award title",
  "category": "Hackathon Award",
  "date": "2025",
  "issuer": "Organization name",
  "description": "2-sentence impact statement",
  "extractedText": "All readable text summary",
  "visualHighlights": ["Detail 1", "Detail 2"],
  "authenticityScore": 98
}`;

        const response = await executeGenerate({
            contents: [
                {
                    inlineData: {
                        data: imageBase64,
                        mimeType: mimeType || 'image/jpeg',
                    },
                },
                prompt
            ],
            config: {
                responseMimeType: 'application/json',
            },
        });

        const result = JSON.parse(response.text);
        res.json(result);
    } catch (error) {
        console.error('[AI Service] Vision analysis error:', error);
        res.status(500).json({ error: error.message || 'Vision analysis failed' });
    }
});

// Generate Profile Bio
router.post('/generate-bio', authenticateToken, async (req, res) => {
    try {
        const { currentProfile = {}, tone = 'innovative and visionary' } = req.body;

        if (!GEMINI_API_KEY) {
            return res.status(400).json({ error: 'Gemini API key not configured.' });
        }

        const prompt = `Rewrite this developer bio to sound ${tone}.
Name: ${currentProfile.name || 'DevJ'}
Tagline: ${currentProfile.tagline || ''}
Bio: ${currentProfile.description || ''}

Return valid JSON (no markdown):
{
  "tagline": "Punchy 1-line tagline under 100 chars",
  "description": "Compelling 2-3 sentence elevator pitch (150-250 chars)",
  "highlights": ["Strength 1", "Strength 2", "Strength 3"]
}`;

        const response = await executeGenerate({
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
            },
        });

        const result = JSON.parse(response.text);
        res.json(result);
    } catch (error) {
        console.error('[AI Service] Bio generation error:', error);
        res.status(500).json({ error: error.message || 'Bio generation failed' });
    }
});

// Enhance Project
router.post('/enhance-project', authenticateToken, async (req, res) => {
    try {
        const { rawProject = {} } = req.body;

        if (!GEMINI_API_KEY) {
            return res.status(400).json({ error: 'Gemini API key not configured.' });
        }

        const prompt = `Generate a high-converting project summary for a portfolio.
Title: ${rawProject.title || 'AI Application'}
Category: ${rawProject.category || 'Generative AI'}
Description: ${rawProject.description || ''}
Technologies: ${rawProject.technologies || ''}

Return valid JSON (no markdown):
{
  "title": "${rawProject.title || 'Project Title'}",
  "category": "Category name",
  "description": "2-3 sentence professional description emphasizing real-world problem solving and impact",
  "technologies": "4-6 technologies comma-separated"
}`;

        const response = await executeGenerate({
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
            },
        });

        const result = JSON.parse(response.text);
        res.json(result);
    } catch (error) {
        console.error('[AI Service] Project enhancement error:', error);
        res.status(500).json({ error: error.message || 'Project enhancement failed' });
    }
});

// Enhance Skill
router.post('/enhance-skill', authenticateToken, async (req, res) => {
    try {
        const { rawSkill = {} } = req.body;

        if (!GEMINI_API_KEY) {
            return res.status(400).json({ error: 'Gemini API key not configured.' });
        }

        const prompt = `Analyze this developer skill and return category, proficiency (0-100), icon, and description.
Skill Name: ${rawSkill.name || 'AI Framework'}
Current Category: ${rawSkill.category || ''}

Valid categories: "Specialized Frontier AI", "Programming Languages", "Frameworks & Libraries", "Cloud, DevOps & Databases", "Design & 3D Tools"

Icon names: Brand identifiers like Gemini, ChatGPT, React, Python, JavaScript, TypeScript, Node, Docker, Firebase, Figma, etc.

Return valid JSON (no markdown):
{
  "name": "${rawSkill.name || 'Skill'}",
  "category": "Specialized Frontier AI",
  "proficiency": 95,
  "iconName": "Gemini",
  "description": "1-sentence technical summary"
}`;

        const response = await executeGenerate({
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
            },
        });

        const result = JSON.parse(response.text);
        res.json(result);
    } catch (error) {
        console.error('[AI Service] Skill enhancement error:', error);
        res.status(500).json({ error: error.message || 'Skill enhancement failed' });
    }
});

// Enhance Achievement
router.post('/enhance-achievement', authenticateToken, async (req, res) => {
    try {
        const { rawAchievement = {} } = req.body;

        if (!GEMINI_API_KEY) {
            return res.status(400).json({ error: 'Gemini API key not configured.' });
        }

        const prompt = `Polish this achievement for a portfolio.
Title: ${rawAchievement.title || 'Hackathon Winner'}
Category: ${rawAchievement.category || 'Hackathon Award'}
Description: ${rawAchievement.description || ''}
Date: ${rawAchievement.date || '2025'}

Valid categories: "Hackathon Award", "Design Recognition", "Certification", "Innovation Prize", "Academic Honor", "Competition Winner"

Return valid JSON (no markdown):
{
  "title": "High impact title",
  "category": "Category",
  "date": "${rawAchievement.date || '2025'}",
  "description": "1-2 sentence narrative with challenge, tech, and honor"
}`;

        const response = await executeGenerate({
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
            },
        });

        const result = JSON.parse(response.text);
        res.json(result);
    } catch (error) {
        console.error('[AI Service] Achievement enhancement error:', error);
        res.status(500).json({ error: error.message || 'Achievement enhancement failed' });
    }
});

// Enhance Hobby
router.post('/enhance-hobby', authenticateToken, async (req, res) => {
    try {
        const { rawHobby = {} } = req.body;

        if (!GEMINI_API_KEY) {
            return res.status(400).json({ error: 'Gemini API key not configured.' });
        }

        const prompt = `Create an engaging description for this developer's hobby.
Name: ${rawHobby.name || 'Creative Hobby'}
Description: ${rawHobby.description || ''}

Return valid JSON (no markdown):
{
  "name": "${rawHobby.name || 'Hobby'}",
  "description": "Vibrant 1-2 sentence statement showing passion and creative balance",
  "iconName": "Heart"
}`;

        const response = await executeGenerate({
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
            },
        });

        const result = JSON.parse(response.text);
        res.json(result);
    } catch (error) {
        console.error('[AI Service] Hobby enhancement error:', error);
        res.status(500).json({ error: error.message || 'Hobby enhancement failed' });
    }
});

// Analyze Hobby Visual
router.post('/analyze-hobby-visual', authenticateToken, async (req, res) => {
    try {
        const { imageBase64, mimeType, existingData = {} } = req.body;

        if (!GEMINI_API_KEY) {
            return res.status(400).json({ error: 'Gemini API key not configured.' });
        }

        if (!imageBase64) {
            return res.status(400).json({ error: 'Image data required.' });
        }

        const prompt = `Analyze this hobby/interest visual. Identify the creative theme, suggest a name, write a vivid description, and recommend an icon.

Tasks:
1. Identify core creative theme
2. Formulate inspiring hobby name
3. Write vivid 1-2 sentence portfolio description
4. Suggest icon: Heart, Camera, Music, Code, Palette, Gamepad, Sparkles, or Coffee

Return valid JSON (no markdown):
{
  "name": "Creative name",
  "description": "Inspiring 1-2 sentence narrative connecting passion with focus",
  "iconName": "Camera",
  "visualHighlights": ["Visual element 1", "Visual element 2"]
}`;

        const response = await executeGenerate({
            contents: [
                {
                    inlineData: {
                        data: imageBase64,
                        mimeType: mimeType || 'image/jpeg',
                    },
                },
                prompt
            ],
            config: {
                responseMimeType: 'application/json',
            },
        });

        const result = JSON.parse(response.text);
        res.json(result);
    } catch (error) {
        console.error('[AI Service] Hobby visual analysis error:', error);
        res.status(500).json({ error: error.message || 'Hobby visual analysis failed' });
    }
});

// Analyze Skills Gap
router.post('/analyze-skills-gap', authenticateToken, async (req, res) => {
    try {
        const { currentSkills = [] } = req.body;

        if (!GEMINI_API_KEY) {
            return res.status(400).json({ error: 'Gemini API key not configured.' });
        }

        const prompt = `Given these developer skills:
${currentSkills.map(s => `${s.name} (${s.category})`).join(', ')}

Identify top 4 missing trending 2026 technologies that maximize hiring appeal for an AI & Full-Stack developer.

Return valid JSON array (no markdown):
[
  {
    "name": "Tool Name",
    "category": "Specialized Frontier AI",
    "proficiency": 92,
    "iconName": "IconName",
    "reason": "Why this elevates the portfolio",
    "description": "Technical capability summary"
  }
]`;

        const response = await executeGenerate({
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
            },
        });

        const result = JSON.parse(response.text);
        res.json(result);
    } catch (error) {
        console.error('[AI Service] Skills gap analysis error:', error);
        res.status(500).json({ error: error.message || 'Skills gap analysis failed' });
    }
});

// Draft Inquiry Reply
router.post('/draft-reply', authenticateToken, async (req, res) => {
    try {
        const { senderName, senderEmail, messageText, tone = 'warm and professional' } = req.body;

        if (!GEMINI_API_KEY) {
            return res.status(400).json({ error: 'Gemini API key not configured.' });
        }

        const prompt = `Draft a ${tone} email reply to a portfolio visitor.

Sender: ${senderName} (${senderEmail})
Message: "${messageText}"

Include: friendly greeting, direct response to their inquiry, clear next steps, professional sign-off. Keep it 2-3 short paragraphs.`;

        const response = await executeGenerate({
            contents: prompt,
        });

        res.json({ text: response.text });
    } catch (error) {
        console.error('[AI Service] Reply generation error:', error);
        res.status(500).json({ error: error.message || 'Reply generation failed' });
    }
});

// Audit Portfolio
router.post('/audit-portfolio', authenticateToken, async (req, res) => {
    try {
        const { portfolioData = {} } = req.body;

        if (!GEMINI_API_KEY) {
            return res.status(400).json({ error: 'Gemini API key not configured.' });
        }

        const prompt = `Audit this developer portfolio and provide: overall score (0-100), 3 key strengths, 3 actionable improvements, and 3 recommended trending techs.

Profile: ${portfolioData.profile?.name || 'DevJ'} - ${portfolioData.profile?.tagline || ''}
Skills (${portfolioData.skills?.length || 0}): ${(portfolioData.skills || []).map(s => s.name).join(', ')}
Projects (${portfolioData.projects?.length || 0}): ${(portfolioData.projects || []).map(p => p.title).join(', ')}
Achievements (${portfolioData.achievements?.length || 0}): ${(portfolioData.achievements || []).map(a => a.title).join(', ')}

Return valid JSON (no markdown):
{
  "score": 92,
  "verdict": "1-sentence portfolio quality assessment",
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "improvements": ["Improvement 1", "Improvement 2", "Improvement 3"],
  "recommendedTechs": ["Tech 1", "Tech 2", "Tech 3"]
}`;

        const response = await executeGenerate({
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
            },
        });

        const result = JSON.parse(response.text);
        res.json(result);
    } catch (error) {
        console.error('[AI Service] Portfolio audit error:', error);
        res.status(500).json({ error: error.message || 'Portfolio audit failed' });
    }
});

// Health check - useful to verify server is running
router.get('/health', (req, res) => {
    const hasApiKey = !!GEMINI_API_KEY;
    res.json({
        status: 'healthy',
        aiConfigured: hasApiKey,
        message: hasApiKey ? 'Gemini API is configured' : 'Gemini API is NOT configured'
    });
});

export default router;
