import { join } from 'path';
import { existsSync } from 'fs';

export default function handler(req, res) {
  if (req.method === 'GET') {
    const { logo, images } = req.query;
    
    let logoPath = null;
    let imagePaths = [];

    if (logo) {
      logoPath = getImageUrl(logo);
    }

    if (images) {
      try {
        const parsedImages = JSON.parse(images);
        imagePaths = parsedImages.map(getImageUrl).filter(Boolean);
      } catch (error) {
        console.error('Error parsing images:', error);
      }
    }

    res.status(200).json({ logo: logoPath, images: imagePaths });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

function getImageUrl(filename) {
  if (!filename) return null;
  
  // Remove any leading slash and 'uploads/' if present
  const cleanFilename = filename.replace(/^\/?(uploads\/)?/, '');
  const fullPath = join(process.cwd(), 'public', 'uploads', cleanFilename);
  
  // Check if the file exists
  if (existsSync(fullPath)) {
    // Return the URL path, not the file system path
    return `/uploads/${cleanFilename}`;
  } else {
    console.warn(`File not found: ${fullPath}`);
    return null;
  }
}

