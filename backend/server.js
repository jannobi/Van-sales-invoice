const app = require('./src/app');
const http = require('http');
const socketIO = require('socket.io');
const { initCronJobs } = require('./src/utils/cronJobs');

const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Socket.io for live tracking
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('join-company', (companyId) => {
    socket.join(`company-${companyId}`);
  });

  socket.on('salesman-update', (data) => {
    io.to(`company-${data.companyId}`).emit('salesman-update', data);
  });

  socket.on('inventory-update', (data) => {
    io.to(`company-${data.companyId}`).emit('inventory-update', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Initialize cron jobs for monthly resets
initCronJobs();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { server, io };
