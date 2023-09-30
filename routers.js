import express from 'express';
import { pool } from './elephant.js'

const routers = express.Router();

// pool.query('SELECT NOW()')
// 	.then(data => console.log('data recieved', data));

routers.get("/", async (req, res) => {
    try {
        const {rows} = await pool.query('SELECT * FROM users');
        res.json(rows)

    } catch(err){
        res.status(500).json(err)
    }
})

routers.get("/:id", async (req, res) => {
    const {id} = req.params;
    try {
        const {rows} = await pool.query('SELECT * FROM users WHERE id=$1;', [id]);
        res.json(rows[0])

    } catch(err){
        res.status(500).json(err)
    }
})

// routers.post("/", async (req, res) => {
//     const {name, year, genre} = req.body;
//     try {
//         const {rows} = await pool.query('INSERT INTO users(first_name, last_name, age) VALUES($1, $2, $3) RETURNING *;', [first_name, last_name, age]);
//         res.json(rows[0])

//     } catch(err){
//         res.status(500).json(err)
//     }
// })

// routers.put("/:id", async (req, res) => {
//     const {name} = req.body;
//     const {id} = req.params;
//     try {
//         const {rows} = await pool.query('UPDATE users SET name=$1 WHERE id=$2 RETURNING *;', [name, id]);
//         res.json(rows[0])

//     } catch(err){
//         res.status(500).json(err)
//     }
// })


// routers.delete("/:id", async (req, res) => {
//     const {id} = req.params;
//     try {
//         const {rows} = await pool.query('DELETE FROM users WHERE id=$1 RETURNING *;', [id]);
//         res.json(rows[0])

//     } catch(err){
//         res.status(500).json(err)
//     }
// })

export default routers;