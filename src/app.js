import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import authRouter from "./routers/authRouter.js";
import transactionRouter from "./routers/transactionRouter.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(json());

const mongoClient = new MongoClient(process.env.DATABASE_URL);
let db;

mongoClient
  .connect()
  .then(() => {
    db = mongoClient.db();
    console.log("Banco de dados conectado com sucesso!");
  })
  .catch((err) => console.error("Erro ao conectar ao banco de dados:", err.message));

app.use((req, res, next) => {
  req.db = db;
  next();
});

app.use(authRouter);
app.use(transactionRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
