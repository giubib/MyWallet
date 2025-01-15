import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).send("Token não enviado");
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).send("Token inválido");
  }
}
