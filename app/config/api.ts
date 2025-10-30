// API Configuration
// This file manages the debug mode and API base URL

const DEBUG = process.env.DEBUG === 'true';
const SERVER_ADDRESS = process.env.SERVER_ADDRESS || 'http://localhost:8000';

export const API_CONFIG = {
  DEBUG,
  SERVER_ADDRESS,
  isDebugMode: () => DEBUG,
  getServerAddress: () => SERVER_ADDRESS,
};

export default API_CONFIG;
