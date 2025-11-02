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

app.get('/medicamentos', async (req, res) => {
  try {
    const todosMedicamentos = await pool.query(
      "SELECT * FROM medicamentos ORDER BY nome ASC"
    );
    res.status(200).json(todosMedicamentos.rows);
  } catch (err) {
    console.error('Erro no servidor ao buscar medicamentos:', err.message);
    res.status(500).send("Erro no servidor");
  }
});

app.delete('/medicamentos/:id', async (req, res) => {
  try {
    const { id } = req.params; 
    await pool.query("DELETE FROM medicamentos WHERE id = $1", [id]);
    console.log(`Medicamento ID ${id} excluído.`);
    res.status(200).send({ message: "Medicamento excluído com sucesso" }); 
  } catch (err) {
    console.error('Erro no servidor ao excluir medicamento:', err.message);
    res.status(500).send("Erro no servidor");
  }
});

app.get('/medicamentos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await pool.query("SELECT * FROM medicamentos WHERE id = $1", [id]);
    
    if (resultado.rows.length === 0) {
      return res.status(404).send("Medicamento não encontrado");
    }
    res.status(200).json(resultado.rows[0]);
  } catch (err) {
    console.error('Erro ao buscar medicamento:', err.message);
    res.status(500).send("Erro no servidor");
  }
});

app.put('/medicamentos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, dose } = req.body;

    const resultado = await pool.query(
      "UPDATE medicamentos SET nome = $1, dose = $2 WHERE id = $3 RETURNING *",
      [nome, dose, id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).send("Medicamento não encontrado para atualizar");
    }
    console.log('Medicamento atualizado:', resultado.rows[0]);
    res.status(200).json(resultado.rows[0]);
  } catch (err) {
    console.error('Erro ao editar medicamento:', err.message);
    res.status(500).send("Erro no servidor");
  }
});

app.post('/registros_doses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(
      "INSERT INTO registros_doses (medicamento_id, data_hora_tomada) VALUES ($1, NOW())",
      [id]
    );
    res.status(201).send({ message: "Dose registrada com sucesso" });
  } catch (err) {
    console.error('Erro ao registrar dose:', err.message);
    res.status(500).send("Erro no servidor");
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
    console.error('Erro ao buscar histórico:', err.message);
    res.status(500).send("Erro no servidor");
  }
});

app.listen(port, () => {
  console.log(`Servidor backend rodando em http://localhost:${port}`);
});