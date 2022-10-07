import { Router } from 'express';
import { client } from '../database.js';

const router = Router();

router.get("/words", async(req, res) => {
    let words = [];
    await client.connect();
    var db = client.db("database");
    var wordsCollection = db.collection("words");
    var response = await wordsCollection.find().toArray();
    for (let i = 0; i < response.length; i++) {
        words.push(response[i].word.toLocaleUpperCase('TR'));
    }
    res.send(words);
});


export default router;
