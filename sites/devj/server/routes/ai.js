import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// ✅ Anymodel API Key Configuration
const ANYMODEL_API_KEY = process.env.ANYMODEL_API_KEY || process.env.VITE_ANYMODEL_API_KEY || '';

// Helper: Execute generate with Anymodel
async function executeGenerate(payload) {
    if (!ANYMODEL_API_KEY) throw new Error('Anymodel API key not configured.');
    let hasImage = false;
    const messages = [];

    if (payload.config?.systemInstruction) {
        messages.push({ role: 'system', content: payload.config.systemInstruction });
    }

    if (typeof payload.contents === 'string') {
        messages.push({ role: 'user', content: payload.contents });
    } else if (Array.isArray(payload.contents)) {
        let currentContent = [];
        payload.contents.forEach(item => {
            if (typeof item === 'string') {
                currentContent.push({ type: 'text', text: item });
            } else if (item.inlineData) {
                hasImage = true;
                currentContent.push({ type: 'image_url', image_url: { url: `data:${item.inlineData.mimeType || 'image/jpeg'};base64,${item.inlineData.data}` } });
            } else if (item.parts) {
                const text = item.parts.map(p => p.text || '').join(' ');
                if (item.role) {
                    messages.push({ role: item.role === 'model' ? 'assistant' : 'user', content: text });
                } else {
                    currentContent.push({ type: 'text', text });
                }
            }
        });
        if (currentContent.length > 0) {
            if (currentContent.length === 1 && currentContent[0].type === 'text') {
                messages.push({ role: 'user', content: currentContent[0].text });
            } else {
                messages.push({ role: 'user', content: currentContent });
            }
        }
    }

    const anymodelModels = hasImage ? [
        'ds/deepseek-v4-flash-vision',
        'qwen/qwen3.8-max'
    ] : [
        "ag/gemini-3.7-flash-high", 
        "ag/gemini-3.7-flash-medium", 
        "cx/gpt-5.6-luna", 
        "cx/gpt-5.6-sol", 
        "cx/gpt-5.6-terra", 
        "kmc/k3", 
        "glm/glm-5.3", 
        "cc/claude-opus-5", 
        "cc/claude-opus-4-6", 
        "cc/claude-opus-4-7", 
        "cc/claude-opus-4-8", 
        "xai/grok-4.7", 
        "ds/deepseek-v4-pro", 
        "ds/deepseek-v4-flash", 
        "qwen/qwen3.8-max",
        "ag/gemini-3.7-flash-low", 
        "ag/gemini-3.6-flash-low", 
        "ag/gemini-3.1-pro-low"
    ];

    let lastError = null;
    
    for (const model of anymodelModels) {
        try {
            const payloadData = {
                model: model,
                messages,
            };
            if (payload.config?.responseMimeType === 'application/json') {
                payloadData.response_format = { type: 'json_object' };
            }

            const res = await fetch('https://anymodel.org/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${ANYMODEL_API_KEY}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'https://devj.agustino-julian.workers.dev',
                    'X-Title': 'DevJ Portfolio'
                },
                body: JSON.stringify(payloadData)
            });

            if (!res.ok) {
                const errText = await res.text();
                lastError = new Error(`Anymodel error [${res.status}] on ${model}: ${errText}`);
                continue; // Try next model
            }
            
            const d = await res.json();
            if (d.error) {
                lastError = new Error(`Anymodel API Error on ${model}: ${d.error.message || d.error.type || 'Unknown'}`);
                continue; // Try next model
            }
            
            return { text: d.choices?.[0]?.message?.content || '', provider: `anymodel (${model})` };
        } catch (err) {
            lastError = err;
        }
    }
    
    throw lastError || new Error('All models in the Anymodel cascade failed.');
}

// Test API Key connection
router.post('/test-connection', authenticateToken, async (req, res) => {
    try {
        if (!ANYMODEL_API_KEY) {
            return res.status(400).json({ error: 'Anymodel API key not configured on server.' });
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

        if (!ANYMODEL_API_KEY) {
            return res.status(400).json({ error: 'Anymodel API key not configured.' });
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

        if (!ANYMODEL_API_KEY) {
            return res.status(400).json({ error: 'Anymodel API key not configured.' });
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

        if (!ANYMODEL_API_KEY) {
            return res.status(400).json({ error: 'Anymodel API key not configured.' });
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

        if (!ANYMODEL_API_KEY) {
            return res.status(400).json({ error: 'Anymodel API key not configured.' });
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

        if (!ANYMODEL_API_KEY) {
            return res.status(400).json({ error: 'Anymodel API key not configured.' });
        }

        const prompt = `Analyze this developer skill and return category, proficiency (0-100), icon, and description.
Skill Name: ${rawSkill.name || 'AI Framework'}
Current Category: ${rawSkill.category || ''}

Valid categories: "Specialized Frontier AI", "Programming Languages", "Frameworks & Libraries", "Cloud, DevOps & Databases", "Design & 3D Tools"

Icon names: Brand identifiers like Gemini, ChatGPT, React, Python, JavaScript, TypeScript, Node, Docker, Appwrite, Figma, etc.

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

        if (!ANYMODEL_API_KEY) {
            return res.status(400).json({ error: 'Anymodel API key not configured.' });
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

        if (!ANYMODEL_API_KEY) {
            return res.status(400).json({ error: 'Anymodel API key not configured.' });
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

        if (!ANYMODEL_API_KEY) {
            return res.status(400).json({ error: 'Anymodel API key not configured.' });
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

        if (!ANYMODEL_API_KEY) {
            return res.status(400).json({ error: 'Anymodel API key not configured.' });
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
        const { senderName, senderEmail, messageText, tone = 'warm and professional', developerName, developerEmail } = req.body;

        if (!ANYMODEL_API_KEY) {
            return res.status(400).json({ error: 'Anymodel API key not configured.' });
        }

        const devName = (developerName || '').trim() || 'Portfolio Author';
        const devEmail = (developerEmail || '').trim();

        const prompt = `Draft a ${tone} email reply to a portfolio collaborator inquiry.

Sender / Collaborator: ${senderName} (${senderEmail})
Inquiry: "${messageText}"
Developer / Sender: ${devName}${devEmail ? ` (${devEmail})` : ''}

Include: friendly greeting to ${senderName}, direct response to their inquiry, clear next steps, and sign-off as:
${devName}
${devEmail ? devEmail : ''}

Do NOT use markdown bold asterisks or symbols in the body. Keep it clean plain text.`;

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

        if (!ANYMODEL_API_KEY) {
            return res.status(400).json({ error: 'Anymodel API key not configured.' });
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
    const hasApiKey = !!ANYMODEL_API_KEY;
    res.json({
        status: 'healthy',
        aiConfigured: hasApiKey,
        message: hasApiKey ? 'Gemini API is configured' : 'Gemini API is NOT configured'
    });
});

export default router;
