const express = require('express');
const { Pool } = require('pg');
const app = express();
app.use(express.json());
const port = 3000;
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'app_remedios',
  password: process.env.DB_PASSWORD,
  port: 5432,
});
app.post('/medicamentos', async (req, res) => {
  try {
    const { nome, dose } = req.body;
  
    const novoMedicamento = await pool.query(
      "INSERT INTO medicamentos (nome, dose) VALUES ($1, $2) RETURNING *",
      [nome, dose]
    );
  
    console.log('Medicamento cadastrado:', novoMedicamento.rows[0]);
    res.status(201).json(novoMedicamento.rows[0]);
  } catch (err) {
    console.error('Erro no servidor:', err.message);
    res.status(500).send("Erro no servidor");
  }
});
app.listen(port, () => {
  console.log(`Servidor backend rodando em http://localhost:${port}`);
});