const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'app_remedios',
  password: 'senha',
  port: 5432, 
});

const atualizar = async () => {
  try {
    console.log("Conectando ao banco...");

    await pool.query("ALTER TABLE medicamentos ADD COLUMN IF NOT EXISTS horario VARCHAR(10);");
    
    console.log("SUCESSO! Coluna 'horario' criada.");
  } catch (err) {
    console.log("ERRO: " + err.message);
  } finally {
    await pool.end();
  }
};

atualizar();