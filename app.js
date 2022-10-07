import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import wordsRouter from './routes/words.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8080;

app.use(express.static("public"));
app.use(bodyParser.json());
app.use("/api", wordsRouter);

app.get("/", (req, res) => {
    res.sendFile('index.html');
});

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
