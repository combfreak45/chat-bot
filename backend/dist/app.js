import express from 'express';
import { config } from 'dotenv';
import morgan from 'morgan';
import appRouter from './routes/index.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
config();
const app = express();
app.use(cors({ origin: "https://chat-bot-frontend.vercel.app", credentials: true }));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(morgan('dev'));
app.get('/', (req, res) => {
    res.send(200).send("Ready");
});
app.use('/api/v1', appRouter);
export default app;
//# sourceMappingURL=app.js.map