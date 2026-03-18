const axios = require('axios');
const fs = require('fs');

async function check() {
    try {
        const payload = {
            jsonrpc: "2.0",
            id: 1,
            method: "tools/call",
            params: {
                name: "list_screens",
                arguments: {
                    projectId: "9126368649439170252"
                }
            }
        };
        const res = await axios.post('https://stitch.googleapis.com/mcp', payload, {
            headers: { 'X-Goog-Api-Key': 'AQ.Ab8RN6JOXHTT1T15x_t2wHWdUNObdDdK-CYG4xzaT73sRG_8BA', 'Content-Type': 'application/json' },
            timeout: 5000
        });
        
        const rawText = res.data.result.content[0].text;
        const screensData = JSON.parse(rawText);
        const screensList = screensData.screens || screensData;
        
        for (let s of screensList) {
            if (s.htmlCode && s.htmlCode.downloadUrl) {
                const htmlRes = await axios.get(s.htmlCode.downloadUrl);
                const title = s.title.replace(/[^a-zA-Z0-9_-]/g, '_');
                fs.writeFileSync(`${title}.html`, htmlRes.data);
                console.log(`Downloaded ${title}.html`);
            }
        }
    } catch (err) {
        console.error("Error:", err.response ? err.response.data : err.message);
    }
}
check();
