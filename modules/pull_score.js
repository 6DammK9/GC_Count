
import { access, readFile, writeFile, constants } from 'node:fs/promises';
import fetch from "node-fetch";
import { mkdirp } from 'mkdirp';

const scoreDir = './public/scores';
const apiEndpoint = "https://mypage.groovecoaster.jp/sp/json";

async function makeScoreDir() {
    await mkdirp(scoreDir);
}

async function isFileExist(file) {
    try {
        await access(file, constants.F_OK);
        return true;
    } catch (e) {
        return false;
    }
}

//https://mypage.groovecoaster.jp/sp/music/music_image.php?music_id=821

async function pullViaREST(cookie, apiName, qs, resultFile) {

    console.log(`Checking: ${resultFile}`);

    const fileAlreadyExist = await isFileExist(resultFile)

    if (!fileAlreadyExist) {
        const url = `${apiEndpoint}/${apiName}.php${qs}`;

        console.log(`HTTP GET ${url}`);

        const opts = { headers: { cookie } };

        const resultPkg = await fetch(url, opts);

        const result = await resultPkg.json();

        const fileContent = JSON.stringify(result, null, 4);

        console.log(`Writing ${resultFile} with ${fileContent.length} bytes...`);

        await writeFile(resultFile, fileContent, "utf-8");
    }

}

async function readMusicList() {
    const musicListFile = `${scoreDir}/music_list.json`;
    const fileContent = await readFile(musicListFile, "utf-8");
    const filePkg = await JSON.parse(fileContent);
    const { music_list } = filePkg;
    console.log(`music_list=${music_list.length}`);
    return music_list;
}

async function pullScore(cookie) {
    const apiPlayerData = 'player_data';
    const apiMusicList = 'music_list';
    const apiMusicDetail = 'music_detail';

    console.log(`Cookie: "${cookie}"`);
    const playerDataFile = `${scoreDir}/${apiPlayerData}.json`;
    await pullViaREST(cookie, apiPlayerData, '', playerDataFile);
    const musicListFile = `${scoreDir}/${apiMusicList}.json`;
    await pullViaREST(cookie, apiMusicList, '', musicListFile);
    const music_list = await readMusicList();
    for (const music_item of music_list) {
        const { music_id } = music_item;
        const qs = `?music_id=${music_id}`; //use URLSearchParams if complicated.
        const resultItemFile = `${scoreDir}/${apiMusicDetail}-${music_id}.json`;
        await pullViaREST(cookie, apiMusicDetail, qs, resultItemFile);
    }
}

export {
    makeScoreDir,
    pullScore
}