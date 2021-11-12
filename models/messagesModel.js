const connection = require('./connection');

const create = async ({ chatMessage, nickname, date }) => {
  const db = await connection();
  const insertedMessage = await db.collection('messages')
    .insertOne({ chatMessage, nickname, date });
  return insertedMessage;
};

const getAll = async () => {
  const db = await connection();
  return db.collection('messages').find().toArray();
};

module.exports = {
  create,
  getAll,
};
