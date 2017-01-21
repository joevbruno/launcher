/* eslint-disable no-console */
import mongoose from 'mongoose';

const db = mongoose.connection;
mongoose.connect(process.env.DB_HOST, {
  config: { autoIndex: false },
});
// autoIndex
export default {
  connect: () => {
    db.on('error', () => {
      console.error.bind(console, 'Connection Error. DB Running?');
    });
    db.once('open', () => {
      console.log('Connected to mongo...');
    });
  }
};
