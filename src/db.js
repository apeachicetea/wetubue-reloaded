import mongoose from 'mongoose';

mongoose.connect("mongodb://127.0.0.1:27017/wetube");

const db = mongoose.connection;

db.on("error", (err) => console.log("DB Error", err));
db.once