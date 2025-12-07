const express = require('express');
const { Pool } = require('pg');
const app = express();
app.use(express.json());
const port = 3000;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'app_remedios',
  password: 'senha',
  port: 5432, 
});

app.get('/medicamentos', async (req, res) => {
  try {
    const todosMedicamentos = await pool.query(
      "SELECT * FROM medicamentos ORDER BY nome ASC"
    );
    res.status(200).json(todosMedicamentos.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro no servidor");
  }
});

app.get('/medicamentos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await pool.query("SELECT * FROM medicamentos WHERE id = $1", [id]);
    if (resultado.rows.length === 0) return res.status(404).send("Não encontrado");
    res.status(200).json(resultado.rows[0]);
  } catch (err) {
    res.status(500).send("Erro");
  }
});

app.post('/medicamentos', async (req, res) => {
  try {
    const { nome, dose, horario } = req.body; 
    const novo = await pool.query(
      "INSERT INTO medicamentos (nome, dose, horario) VALUES ($1, $2, $3) RETURNING *",
      [nome, dose, horario]
    );
    res.status(201).json(novo.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro ao cadastrar");
  }
});

app.put('/medicamentos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, dose, horario } = req.body;
    const update = await pool.query(
      "UPDATE medicamentos SET nome = $1, dose = $2, horario = $3 WHERE id = $4 RETURNING *",
      [nome, dose, horario, id]
    );
    if (update.rows.length === 0) return res.status(404).send("Não encontrado");
    res.status(200).json(update.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro ao atualizar");
  }
});

app.delete('/medicamentos/:id', async (req, res) => {
  try {
    const { id } = req.params; 
    await pool.query("DELETE FROM medicamentos WHERE id = $1", [id]);
    res.status(200).send({ message: "Excluído" }); 
  } catch (err) {
    res.status(500).send("Erro");
  }
});

app.post('/registros_doses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(
      "INSERT INTO registros_doses (medicamento_id, data_hora_tomada) VALUES ($1, NOW())",
      [id]
    );
    res.status(201).send({ message: "Dose registrada" });
  } catch (err) {
    res.status(500).send("Erro");
  }
});

app.get('/historico', async (req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT r.id, r.data_hora_tomada, m.nome, m.dose 
      FROM registros_doses r
      JOIN medicamentos m ON r.medicamento_id = m.id
      ORDER BY r.data_hora_tomada DESC
    `);
    res.status(200).json(resultado.rows);
  } catch (err) {
    res.status(500).send("Erro");
  }
});

app.listen(port, () => {
  console.log(`Backend rodando em http://localhost:${port}`);
});