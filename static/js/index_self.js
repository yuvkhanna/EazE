document.getElementById("search-button").addEventListener("click", async () => {
    const query = document.getElementById("search-input").value;

    if (query) {
        // OpenAI API Call
        fetchOpenAIResponse(query);

        // YouTube API Call
        fetchYouTubeVideos(query);
    } else {
        alert("Please enter a query.");
    }
});

// Function to fetch Hugging Face API response through Flask backend
async function fetchOpenAIResponse(query) {
    const aiOutputElement = document.getElementById("ai-output");
    aiOutputElement.textContent = 'Loading...';  // Loading message

    try {
        const response = await fetch('/api/search', {  // Your backend API endpoint
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: query })
        });

        const data = await response.json();

        // Log the full response to check structure
        console.log('Hugging Face API Response:', data);

        // Check if the response contains the generated text
        if (data && data.length > 0) {
            aiOutputElement.textContent = data[0].generated_text || 'No response generated.';  // Adjust based on response format
        } else {
            aiOutputElement.textContent = 'Unexpected API response format. Check the console for details.';
        }

    } catch (error) {
        aiOutputElement.textContent = 'Error fetching data.';
        console.error('Error:', error);
    }
}



// Function to fetch YouTube videos using YouTube Data API
async function fetchYouTubeVideos(query) {
    const videosListElement = document.getElementById("videos-list");
    videosListElement.innerHTML = 'Loading...';  // Loading message

    const apiKey = 'your_youtube_api_key';  // Replace with your YouTube API key
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=5&key=${apiKey}`;

    try {
        const response = await fetch(searchUrl);
        const data = await response.json();

        // Clear loading message
        videosListElement.innerHTML = '';

        // Display YouTube videos as iframes
        data.items.forEach(item => {
            const videoId = item.id.videoId;
            const iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube.com/embed/${videoId}`;
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            iframe.allowFullscreen = true;
            videosListElement.appendChild(iframe);
        });

    } catch (error) {
        videosListElement.textContent = 'Error loading videos.';
        console.error('Error:', error);
    }
}
