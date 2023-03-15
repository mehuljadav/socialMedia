const mongoose = require('mongoose');
const app = require('./app');

//
//
// Uncaught Exception
//
process.on('uncaughtException', () => {
  console.log('Uncaught Exception...');
  console.log('Shutting Down Server...');
  process.exit(1);
});

//
//
// First Connecting DB then Starting server
//
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(`Database connected successfully`);
  })
  .then(() => {
    const PORT = process.env.PORT;
    app.listen(PORT, () => {
      console.log(`server is runing on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

//
//
// Unhandled Rejection Error
//
process.on('unhandledRejection', () => {
  console.log('Unhandled Rejection Error...');
  console.log('Shutting Down Server...');
  process.exit(1);
});
