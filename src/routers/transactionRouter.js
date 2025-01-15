import { Router } from "express";
import { validateSchema } from "../middlewares/validateSchema.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { transactionSchema } from "../schemas/transactionSchema.js";
import {
  addTransaction,
  getTransactions,
  editTransaction,
  deleteTransaction,
} from "../controllers/transactionController.js";

const transactionRouter = Router();

transactionRouter.use(authMiddleware);

transactionRouter.post("/transactions", validateSchema(transactionSchema), addTransaction);
transactionRouter.get("/transactions", getTransactions);
transactionRouter.put("/transactions/:id", validateSchema(transactionSchema), editTransaction);
transactionRouter.delete("/transactions/:id", deleteTransaction);

export default transactionRouter;
