import express from 'express';
import 'dotenv/config';
import { createTables } from './elephant.js';
import routers from './routers.js'



const app = express();
const port = 8000 || process.env.PORT;

app.use(express.json());
app.use('/api/users', routers);

createTables();

// pool.query('SELECT NOW()')
// 	.then(data => console.log('data recieved', data)); 
	

app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
})