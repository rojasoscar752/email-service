# Email Service

Microservicio encargado de procesar eventos de Kafka y enviar notificaciones por correo electrónico.

## Características

- Consume eventos del topic `report-visited` desde Kafka
- Envía emails automáticamente basado en reportes de visita
- Integración con sistema de quejas Boyacá
- Escalable y basado en Node.js

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
cp .env.example .env
```

3. Editar `.env` con tus credenciales:
```env
PORT=3002
KAFKA_BROKER=localhost:9092
EMAIL_HOST=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=your_email@gmail.com
EMAIL_ADMIN=admin@example.com
NODE_ENV=development
```

## Uso

### Desarrollo
```bash
npm start
```

El servicio:
- Se conecta a Kafka en `localhost:9092`
- Se suscribe al topic `report-visited`
- Escucha eventos y envía emails de reporte

### Health Check
```bash
curl http://localhost:3002/health
```

## Estructura del Evento

El servicio espera eventos con la siguiente estructura en el topic `report-visited`:

```json
{
  "timestamp": "2025-11-19T10:30:00.000Z",
  "ipAddress": "192.168.1.1",
  "method": "GET",
  "path": "/api/complaints"
}
```

## Flujo de Funcionamiento

1. Kafka Producer (Quejas-Entidades-BOY) emite evento en `report-visited`
2. Email Service consume el evento
3. Se genera contenido HTML del email
4. Se envía email al administrador

## Configuración de Email

### Gmail
Para usar Gmail:
1. Habilitar autenticación de 2 factores
2. Generar contraseña de aplicación
3. Usar esa contraseña en `EMAIL_PASS`

### Otros Servicios
Modificar `EMAIL_HOST` en `.env` según el proveedor (outlook, yahoo, etc.)

## Variables de Entorno Requeridas

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `PORT` | Puerto del servidor | `3002` |
| `KAFKA_BROKER` | Broker de Kafka | `localhost:9092` |
| `EMAIL_HOST` | Proveedor de email | `gmail` |
| `EMAIL_USER` | Email del remitente | `service@example.com` |
| `EMAIL_PASS` | Contraseña/token de app | `xxxx xxxx xxxx xxxx` |
| `EMAIL_FROM` | Email visible al destinatario | `service@example.com` |
| `EMAIL_ADMIN` | Email del administrador | `admin@example.com` |

## Dependencias

- **express**: Framework web
- **kafkajs**: Cliente de Kafka
- **nodemailer**: Envío de emails
- **dotenv**: Gestión de variables de entorno

## Logs

El servicio genera logs con información de:
- Conexión a Kafka
- Eventos recibidos
- Emails enviados
- Errores de procesamiento

## Manejo de Shutdown

El servicio respeta señales SIGTERM y SIGINT para desconexión graceful de Kafka.
