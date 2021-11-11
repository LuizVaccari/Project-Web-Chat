const createNickname = () => {
  const random1 = Math.random().toString(36).substr(2, 8);
  const random2 = Math.random().toString(36).substr(2, 8);
  const createdNickname = `${random1}${random2}`;
  return createdNickname;
  };

  module.exports = {
    createNickname,
  };