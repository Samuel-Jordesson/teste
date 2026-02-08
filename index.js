import express from 'express';
import os from 'os';

const app = express();
const PORT = 3000;

// Função para obter o IP da máquina
function getIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const IP = getIP();

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('🚀 Server running!');
  console.log(`   Local:   http://localhost:${PORT}`);
  console.log(`   IP:      http://${IP}:${PORT}`);
});
