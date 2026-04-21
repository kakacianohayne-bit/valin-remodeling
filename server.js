const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Serve all static files from the current directory
app.use(express.static(__dirname));

// Set up a fallback route to serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Valin Remodeling server is running on port ${PORT}`);
});
