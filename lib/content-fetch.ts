export async function fetchContent() {
  // Use an absolute URL for API calls
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const fullUrl = `${apiUrl}/api/content`;

  try {
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch content: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching content:', error);
    throw error;
  }
}

