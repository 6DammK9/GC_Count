
import express from 'express';

async function openServer(port) {
    const app = express()

    app.use(express.static('public'));

    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    })
}

export {
    openServer
}