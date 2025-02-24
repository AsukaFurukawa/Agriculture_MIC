async function testEndpoints() {
  try {
    // Test health
    const healthResponse = await fetch('http://localhost:3000/health');
    console.log('Health check:', await healthResponse.json());

    // Test language detection
    const detectResponse = await fetch('http://localhost:3000/api/language/detect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: 'नमस्ते' }),
    });
    console.log('Language detection:', await detectResponse.json());

    // Test supported languages
    const languagesResponse = await fetch('http://localhost:3000/api/language/supported');
    console.log('Supported languages:', await languagesResponse.json());
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testEndpoints(); 