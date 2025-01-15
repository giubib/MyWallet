import { ObjectId } from "mongodb";

export async function addTransaction(req, res) {
  const { value, description, type } = req.body;
  const { user } = req;

  try {
    const transaction = {
      userId: user._id,
      value,
      description,
      type,
      date: new Date(),
    };

    await req.db.collection("transactions").insertOne(transaction);
    res.status(201).send("Transação adicionada com sucesso");
  } catch (err) {
    res.status(500).send("Erro ao adicionar transação");
  }
}

export async function getTransactions(req, res) {
  const { user } = req;
  const { page = 1 } = req.query;

  const limit = 10;
  const skip = (page - 1) * limit;

  if (page < 1) {
    return res.status(400).send("Página inválida");
  }

  try {
    const transactions = await req.db
      .collection("transactions")
      .find({ userId: user._id })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).send("Erro ao listar transações");
  }
}

export async function editTransaction(req, res) {
  const { id } = req.params;
  const { value, description, type } = req.body;
  const { user } = req;

  try {
    const transaction = await req.db.collection("transactions").findOne({ _id: new ObjectId(id), userId: user._id });

    if (!transaction) {
      return res.status(401).send("Transação não encontrada ou não autorizada");
    }

    await req.db.collection("transactions").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          value,
          description,
          type,
          date: new Date(),
        },
      }
    );

    res.status(204).send();
  } catch (err) {
    res.status(500).send("Erro ao editar transação");
  }
}

export async function deleteTransaction(req, res) {
  const { id } = req.params;
  const { user } = req;

  try {
    const transaction = await req.db.collection("transactions").findOne({ _id: new ObjectId(id), userId: user._id });

    if (!transaction) {
      return res.status(401).send("Transação não encontrada ou não autorizada");
    }

    await req.db.collection("transactions").deleteOne({ _id: new ObjectId(id) });

    res.status(204).send();
  } catch (err) {
    res.status(500).send("Erro ao deletar transação");
  }
}
