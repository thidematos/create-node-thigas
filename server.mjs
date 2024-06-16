process.on('uncaughtException', (err) => {
  console.log('Exception!');
  console.log(err.name, err.message);
  process.exit(1);
});

import app from './app.mjs';
import dotenv from 'dotenv';
//const connectionDB = require('./utils/connectDB');

dotenv.config({ path: `./config.env` });

const server = app.listen(process.env.PORT || 3000, async () => {
  console.log('Server started!');
  //await connectionDB();
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
