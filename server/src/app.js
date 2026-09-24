const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('node:path');
const fs = require('node:fs');

const authRoutes = require('./routes/authRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const requestRoutes = require('./routes/requestRoutes');
const borrowingRoutes = require('./routes/borrowingRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const profileRoutes = require('./routes/profileRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// relaxed cors for local dev with credentials
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'campus-resource-sharing-api', timestamp: new Date().toISOString() });
});

// mount rest api routes
app.use('/api/auth', authRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/borrowings', borrowingRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/profile', profileRoutes);

// serve frontend build in production if available
const clientDistPath = path.resolve(__dirname, '../../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// 404 for unhandled api routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// central error handler
app.use(errorHandler);

module.exports = app;
