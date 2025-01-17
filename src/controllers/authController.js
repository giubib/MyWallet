import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"



dotenv.config()

export async function signUp(req, res) {
  const { name, email, password } = req.body;
  const db = req.db;

  try {
    const userExists = await db.collection("users").findOne({ email });
    if (userExists) return res.status(409).send("E-mail já cadastrado.");

    const hashedPassword = bcrypt.hashSync(password, 10);
    await db.collection("users").insertOne({ name, email, password: hashedPassword });
    res.status(201).send("Usuário cadastrado com sucesso.");
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function signIn(req, res) {
  const { email, password } = req.body;
  const db = req.db;

  try {
    const user = await db.collection("users").findOne({ email });
    if (!user) return res.status(404).send("Usuário não encontrado.");

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) return res.status(401).send("Senha incorreta.");

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.send({ token });
  } catch (err) {
    res.status(500).send(err.message);
  }
}
