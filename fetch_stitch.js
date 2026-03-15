const { Client } = require("@modelcontextprotocol/sdk/client/index.js");
const { SSEClientTransport } = require("@modelcontextprotocol/sdk/client/sse.js");
const EventSource = require("eventsource");
global.EventSource = EventSource;

async function run() {
    try {
        console.log("Connecting...");
        // Usually, the URL ends with /sse or /v1/mcp/sse, but let's try the one provided
        const transport = new SSEClientTransport(new URL("https://stitch.googleapis.com/mcp"), {
            requestInit: {
                headers: {
                    "X-Goog-Api-Key": "AQ.Ab8RN6JOXHTT1T15x_t2wHWdUNObdDdK-CYG4xzaT73sRG_8BA"
                }
            }
        });
        
        const client = new Client({
            name: "antigravity",
            version: "1.0.0"
        }, {
            capabilities: {}
        });

        await client.connect(transport);
        console.log("Connected. Fetching tools...");
        const response = await client.listTools();
        console.log(JSON.stringify(response, null, 2));
        process.exit(0);
    } catch (e) {
        console.error("Failed:", e);
        process.exit(1);
    }
}

run();
