import pg from 'pg';

const { Pool } = pg;
const pool = new Pool();

const createTables = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        age INT,
        active BOOLEAN NOT NULL DEFAULT true
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        price FLOAT,
        date TIMESTAMP,
        user_id INT,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `);

    await pool.query(`
      INSERT INTO users (first_name, last_name, age) VALUES
        ('John', 'Doe', 18),
        ('Bob', 'Dylan', 30),
        ('Jane', 'Doe', 25);
    `);

    await pool.query(`
      INSERT INTO orders (price, date, user_id) VALUES
        (18, '2021-01-01 00:00:00', 1),
        (18, '2021-01-02 04:00:00', 1),
        (18, '2021-01-03 05:00:00', 2),
        (18, '2021-01-04 06:00:00', 2);
    `);

    console.log('Tables created and data inserted successfully.');
  } catch (error) {
    console.error('Error creating tables:', error);
  }
};

export { pool, createTables };
