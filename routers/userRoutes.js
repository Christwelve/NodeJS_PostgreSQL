import express from 'express';
import { pool } from '../elephant.js'

const userRoutes = express.Router();



userRoutes.get("/", async (req, res) => {
    try {
        const {rows} = await pool.query('SELECT * FROM users');
        res.json(rows)

    } catch(err){
        res.status(500).json(err)
    }
})

userRoutes.get("/:id", async (req, res) => {
    const {id} = req.params;
    try {
        const {rows} = await pool.query('SELECT * FROM users WHERE id=$1;', [id]);
        res.json(rows[0])

    } catch(err){
        res.status(500).json(err)
    }
})

const validateUser = [
    body('first_name').notEmpty().withMessage('First name is required'),
    body('last_name').notEmpty().withMessage('Last name is required'),
    body('age').notEmpty().withMessage('Age is required'),
];
  
userRoutes.post("/", validateUser, async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) 
        return res.status(400).json({ errors: errors.array() });

    const { first_name, last_name, age } = req.body;
    try {
        const {rows} = await pool.query('INSERT INTO users(first_name, last_name, age) VALUES($1, $2, $3) RETURNING *;', [first_name, last_name, age]);
        res.json(rows[0])
    } catch(err){
        // res.status(500).json(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

const validateUserPut = [
    body('first_name').notEmpty().optional().withMessage('First name is required'),
    body('last_name').notEmpty().optional().withMessage('Last name is required'),
    body('age').notEmpty().optional().withMessage('Age is required'),
];

userRoutes.put("/:id", validateUserPut, async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) 
        return res.status(400).json({ errors: errors.array() });
        
    const { first_name, last_name, age } = req.body;
    const {id} = req.params;

    let setClauses = [];
    let values = [];
    
    if (first_name !== undefined) {
        setClauses.push(`first_name = $${values.length + 1}`);
        values.push(first_name);
    }
    if (last_name !== undefined) {
        setClauses.push(`last_name = $${values.length + 1}`);
        values.push(last_name);
    }
    if (!setClauses.length) {
        return res.status(400).json({ message: "No fields provided to update" });
    }

    values.push(id);

    const query = `UPDATE users SET ${setClauses.join(", ")} WHERE id = $${values.length} RETURNING *`;
    console.log(query, 'query');
    try {

        const doesUserExist = await pool.query('SELECT * FROM users WHERE id=$1', [id]);
        if (doesUserExist.rows.length === 0) {
            return res.status(404).json({ error: 'User does not exist' });
        }

        const {rows} = await pool.query(query, values);
        // if (!rows.length) {
        //     return res.status(404).json({ message: "User not found" });
        // }
        res.json(rows[0]);
    } catch(err) {
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
})

userRoutes.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {

        const doesUserExist = await pool.query('SELECT * FROM users WHERE id=$1', [id]);
        if (doesUserExist.rows.length === 0) {
            return res.status(404).json({ error: 'User does not exist' });
        }

        const { rows } = await pool.query('DELETE FROM users WHERE id=$1 RETURNING *;', [id]);
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json(err);
    }
});

export default userRoutes;