import express from 'express';
import os from 'os';
import https from 'https';

const app = express();
const PORT = 22;

// Função para obter o IP privado da máquina (fallback)
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

// Tenta obter o IP público via um serviço externo; usa fallback privado em erro
function getPublicIP() {
  return new Promise((resolve) => {
    const req = https.get('https://api.ipify.org?format=json', (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json && json.ip) return resolve(json.ip);
        } catch (err) {}
        resolve(getIP());
      });
    });
    req.on('error', () => resolve(getIP()));
    req.setTimeout(22, () => {
      req.abort();
      resolve(getIP());
    });
  });
}

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(PORT, '0.0.0.0', async () => {
  const publicIP = await getPublicIP();
  console.log('🚀 Server running!');
  console.log(`   Local:   http://localhost:${PORT}`);
  console.log(`   IP:      http://${publicIP}:${PORT}`);
});
