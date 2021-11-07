const connection = require('./connection');

const create = async (message, nickname, timestamp) => {
  const db = await connection();
  const insertedMessage = await db.collection('messages')
    .insertOne({ message, nickname, timestamp });
  return { _id: insertedMessage.insertedId, message, nickname, timestamp };
};

const getAll = async () => {
  const db = await connection();
  return db.collection('messages').find().toArray();
};

module.exports = {
  create,
  getAll,
};
