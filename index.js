const express = require('express');
const app = express();
const redis = require('redis');
const axios = require('axios').default;

app.use(express.json());

const client = redis.createClient();
(async () => {
  await client.connect();
})();

app.get('/:id', async (req, res) => {
  const { id } = req.params;
  const keyValue = `post-${id}`;
  const checkRedisData = await client.get(keyValue);
  if (checkRedisData) {
    return res.json({
      message: 'hello world',
      data: JSON.parse(checkRedisData),
    });
  }
  const { data } = await axios.get(
    `https://jsonplaceholder.typicode.com/posts/${id}`
  );

  await client.set(keyValue, JSON.stringify(data));
  return res.status(200).json({ message: 'hello world', data });
});

app.listen(9001, () => console.log(`app is listening on port 9001`));
