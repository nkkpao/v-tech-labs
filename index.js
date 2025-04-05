const http = require('http');

const hostname = '0.0.0.0';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  
  // Генерируем случайное число
  const randomNumber = Math.floor(Math.random() * 100);
  
  // Отправляем ответ
  res.end(`Привет из Docker-контейнера!\nСлучайное число: ${randomNumber}\n`);
});

server.listen(port, hostname, () => {
  console.log(`Сервер запущен на http://${hostname}:${port}/`);
});