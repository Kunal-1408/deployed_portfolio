export async function fetchContent() {
    const response = await fetch('/api/content', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    if (!response.ok) {
      throw new Error('Failed to fetch content');
    }
  
    return response.json();
  }
  
  