import open, { openApp, apps } from 'open';

async function openBrowser(hostWithPort) {
    await open(`${hostWithPort}/index.html`);
}

export {
    openBrowser
}