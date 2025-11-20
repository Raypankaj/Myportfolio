import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import './AIAnswerComponent.css'; 

// 🛑 FIX 1: Initialize AI client inside a memoized hook or function,
// but for simplicity, we'll initialize it once and handle the key check inside the component.
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
const apiKey = import.meta.env.VITE_GEMINI_API_KEY; 
const MODEL_NAME = 'gemini-2.5-flash';
const MAX_RETRIES = 3; 

const AIAnswerComponent = () => {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('Ask the AI model about anything.');
    const [loading, setLoading] = useState(false);

    // 🛑 FIX 2: Check for API Key validity here to provide a clean UI error message.
    if (!apiKey) {
        return (
            <div className="ai-container error-state">
                <h1>Configuration Error</h1>
                <p>The **Generative AI API Key (VITE_GEMINI_API_KEY)** is not set up correctly in your environment variables. Please check the **.env** file and restart your server.</p>
            </div>
        );
    }

    // Function to call the Generative AI Model with Retry Logic
    const getAiAnswer = async () => {
        if (!prompt.trim() || loading) return; // Prevent double-clicks

        setLoading(true);
        setResponse('Thinking...');

        // 🛑 FIX 3: Implementing the retry mechanism for 503 errors (Service Unavailable)
        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
                const stream = await ai.models.generateContentStream({
                    model: MODEL_NAME, 
                    contents: [{ role: 'user', parts: [{ text: prompt }] }],
                });

                let fullResponse = '';
                for await (const chunk of stream) {
                    fullResponse += chunk.text;
                    setResponse(fullResponse);
                }
                
                setLoading(false);
                return; // Success, exit function
            } catch (error) {
                console.error(`AI API Error (Attempt ${attempt}):`, error);
                
                // Check if the error is the specific 503 "Overloaded" error
                const isServiceUnavailable = error.message.includes(`"code": 503`);

                if (isServiceUnavailable && attempt < MAX_RETRIES) {
                    const delay = Math.pow(2, attempt) * 1000; // Exponential backoff (2s, 4s, 8s)
                    setResponse(`Service temporarily overloaded. Retrying in ${delay / 1000}s...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                } else {
                    // Final failure or unrecoverable error (e.g., 400, 403, etc.)
                    const finalErrorMsg = isServiceUnavailable 
                        ? 'Failed after multiple retries. Try again later.'
                        : 'An unrecoverable API error occurred. Check the console.';
                    
                    setResponse(finalErrorMsg);
                    setLoading(false);
                    return;
                }
            }
        }
        setLoading(false);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && !loading) {
            getAiAnswer();
        }
    };

    return (
        <div className="ai-container">
            <h1>🧠 Generative AI Question Answering</h1>
            <div className="input-area">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="E.g., What is the difference between React and Vue?"
                    disabled={loading}
                    aria-label="Enter your question for the AI model" // Accessibility improvement
                />
                <button
                    onClick={getAiAnswer}
                    disabled={loading}
                    className="ai-button"
                >
                    {loading ? 'Asking...' : 'Ask AI'}
                </button>
            </div>

            <div className={`response-box ${loading ? 'loading' : ''}`}>
                <p className="response-text">{response}</p>
            </div>

            <p className="note">Note: This feature uses a fast, specialized language model ({MODEL_NAME}).</p>
        </div>
    );
};

export default AIAnswerComponent;