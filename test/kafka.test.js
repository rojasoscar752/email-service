
const kafka = require('../src/config/kafka');

async function testKafkaConnection() {
  console.log('Testing Kafka connection...');
  
  const admin = kafka.admin();
  
  try {
    await admin.connect();
    console.log('✓ Conectado a Kafka');
    
    const topics = await admin.listTopics();
    console.log('✓ Topics disponibles:', topics);
    
    if (topics.includes('report-visited')) {
      console.log('Topic report-visited existe');
    } else {
      console.log('Topic report-visited no existe. Asegúrate de que Quejas-Entidades-BOY lo haya creado.');
    }
    
    await admin.disconnect();
  } catch (error) {
    console.error(' Error conectando a Kafka:', error.message);
    process.exit(1);
  }
}

testKafkaConnection();
