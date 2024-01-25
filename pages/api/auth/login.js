export default function handler(req, res) {
  if (req.method === "POST") {
    const { password } = req.body;
    if (password === process.env.ADMIN_SECRET) {
      res.status(200).json({ message: "Authentication successful" });
    } else {
      res.status(401).json({ message: "Authentication failed" });
    }
  } else {
    res.status(405).end();
  }
}
