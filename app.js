'use strict';
const userCookie = process.argv[2] || 'PHPSESSID=xxxxxxxxxxxxxxxxxxxxxxxxxx;';
const serverPort = process.argv[3] || 8080;
const hostWithPort = `http://localhost:${serverPort}`;

import { openBrowser } from "./modules/open_browser.js"
import { makeScoreDir, pullScore } from "./modules/pull_score.js"
import { openServer } from "./modules/open_server.js"

async function main() {
    await makeScoreDir();
    await pullScore(userCookie);
    await openServer(serverPort);
    await openBrowser(hostWithPort);
}

main().catch(console.error);