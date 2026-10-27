import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const jsonPath = path.join(process.cwd(), 'js', 'data', 'content.json');
    if (fs.existsSync(jsonPath)) {
      const content = fs.readFileSync(jsonPath, 'utf8');
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300');
      return res.status(200).send(content);
    }
    return res.status(404).json({ error: 'Published content not found.' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to read published content: ' + err.message });
  }
}
