const dgram = require('dgram');

// Parametrat e konfigurimit
const host = 'ip addres'; // IP addres
const port = 8080; // Port
const message = Buffer.from('Hello, server!'); // Message
const numPackets = 1000000; // nambers of pakets for sent 
const concurrency = 100; // Numri i dërguesve të paketave në të njëjtën kohë
const interval = 10; // Intervali në ms mes dërgesave

// Funksioni për të dërguar një kërkesë UDP
const makeRequest = () => {
  return new Promise((resolve, reject) => {
    const client = dgram.createSocket('udp4');
    client.send(message, port, host, (error) => {
      if (error) {
        console.error('Error:', error);
        client.close();
        return reject(error);
      }
      client.close();
      resolve();
    });
  });
};

// Funksioni për të dërguar kërkesa në mënyrë të paralelizuar
const runTest = async () => {
  let sentPackets = 0;

  const workers = Array.from({ length: concurrency }, () => {
    return async function worker() {
      while (sentPackets < numPackets) {
        try {
          await makeRequest();
          sentPackets++;
          console.log(`Packet ${sentPackets} sent successfully`);
        } catch (error) {
          console.error('Failed to send packet:', error);
        }

        // Krijo një interval për të kontrolluar ngarkesën e serverit dhe për të parandaluar mbingarkesën
        await new Promise(resolve => setTimeout(resolve, interval));
      }
    };
  });

  // Ekzekuto punëtorët në mënyrë të paralelizuar
  await Promise.all(workers.map(worker => worker()));
  console.log('All packets sent');
};

// Filloni testin
runTest();
