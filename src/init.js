import './db.js';
import './models/Video.js';
import './models/User.js';
import app from './server.js';;

const PORT = 4000;

const handleListening = () => console.log(`👍 Server listenin on http://localhost:${PORT}`);

app.listen(PORT, handleListening);
