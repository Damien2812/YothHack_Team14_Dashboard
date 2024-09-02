// src/preload.js
const { contextBridge } = require('electron');
const { db } = require('./firebaseConfig');

contextBridge.exposeInMainWorld('firebase', {
  db
});
