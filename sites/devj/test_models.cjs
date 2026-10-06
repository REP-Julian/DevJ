const fs = require('fs');

async function testModels() {
    try {
        const envContent = fs.readFileSync('.env', 'utf8');
        const keyMatch = envContent.match(/ANYMODEL_API_KEY="([^"]+)"/);
        const apiKey = keyMatch ? keyMatch[1] : null;

        if (!apiKey) {
            console.error("No ANYMODEL_API_KEY found in .env");
            return;
        }

        const models = [
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
            "ds/deepseek-v4-flash-vision", 
            "qwen/qwen3.8-max",
            "ag/gemini-3.7-flash-low", 
            "ag/gemini-3.6-flash-low", 
            "ag/gemini-3.1-pro-low"
        ];

        console.log("Starting model tests...");
        const results = [];

        for (const model of models) {
            console.log(`Testing ${model}...`);
            const payload = {
                model: model,
                messages: [{ role: "user", content: "Reply with simply: OK" }]
            };

            try {
                const res = await fetch('https://anymodel.org/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data.error) {
                        results.push({ model, status: 'Error', message: data.error.message || JSON.stringify(data.error) });
                    } else {
                        results.push({ model, status: 'Success', message: data.choices?.[0]?.message?.content?.trim() || 'Empty response' });
                    }
                } else {
                    const text = await res.text();
                    results.push({ model, status: 'HTTP Error', message: `Status ${res.status}: ${text}` });
                }
            } catch (err) {
                results.push({ model, status: 'Network Error', message: err.message });
            }
        }

        console.log("\n=== Test Results ===");
        results.forEach(r => {
            console.log(`[${r.status === 'Success' ? 'PASS' : 'FAIL'}] ${r.model}: ${r.message.replace(/\n/g, ' ')}`);
        });

    } catch (e) {
        console.error("Test script failed:", e.message);
    }
}

testModels();
