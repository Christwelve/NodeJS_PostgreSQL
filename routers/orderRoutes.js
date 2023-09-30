import express from 'express';
import { pool } from '../elephant.js'

const orderRoutes = express.Router();

// pool.query('SELECT NOW()')
// 	.then(data => console.log('data recieved', data));

orderRoutes.get("/", async (req, res) => {
    try {
        const {rows} = await pool.query('SELECT * FROM orders');
        res.json(rows)

    } catch(err){
        res.status(500).json(err)
    }
})

orderRoutes.get("/:id", async (req, res) => {
    const {id} = req.params;
    try {
        const {rows} = await pool.query('SELECT * FROM orders WHERE id=$1;', [id]);
        res.json(rows[0])

    } catch(err){
        res.status(500).json(err)
    }
})

orderRoutes.post("/", async (req, res) => {
    const { price, date, user_id } = req.body;
    try {
        const {rows} = await pool.query('INSERT INTO orders(price, date, user_id) VALUES($1, $2, $3) RETURNING *;', [price, date, user_id]);
        res.json(rows[0])

    } catch(err){
        res.status(500).json(err)
    }
})

orderRoutes.put("/:id", async (req, res) => {
    const { price, date, user_id } = req.body;
    const {id} = req.params;
    try {
        const {rows} = await pool.query('UPDATE orders SET price=$1, date=$2, user_id=$3 WHERE id=$4 RETURNING *;', [price, date, user_id, id]);
        res.json(rows[0])

    } catch(err){
        res.status(500).json(err)
    }
})


// orderRoutes.delete("/:id", async (req, res) => {
//     const { id } = req.params;
//     try {
//         const { rows } = await pool.query('DELETE FROM orders WHERE id=$1 RETURNING *;', [id]);
//         res.json(rows[0]);
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });
// })

export default orderRoutes;