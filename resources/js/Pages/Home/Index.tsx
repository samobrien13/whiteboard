import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

export default function Home() {
    const [boardContent, setBoardContent] = useState('');
    const socket = useRef<WebSocket | null>(null);

    useEffect(() => {
        // Create a new WebSocket connection.
        const ws = new WebSocket(`ws://${window.location.host}/ws`);

        ws.onopen = () => {
            console.log('WebSocket connection established');
        };

        ws.onmessage = (event) => {
            setBoardContent(event.data);
        };

        ws.onclose = () => {
            console.log('WebSocket connection closed');
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        socket.current = ws;

        // Clean up the connection when the component unmounts.
        return () => {
            ws.close();
        };
    }, []);

    const handleContentChange = (
        event: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        const newContent = event.target.value;
        setBoardContent(newContent);
        if (socket.current && socket.current.readyState === WebSocket.OPEN) {
            socket.current.send(newContent);
        }
    };

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <textarea
                value={boardContent}
                onChange={handleContentChange}
                style={{ width: '50%', height: '100%', padding: '10px' }}
                placeholder="Start typing your markdown here..."
            />
            <div
                style={{
                    width: '50%',
                    height: '100%',
                    padding: '10px',
                    borderLeft: '1px solid #ccc',
                    overflowY: 'auto',
                }}
            >
                <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                    {boardContent}
                </ReactMarkdown>
            </div>
        </div>
    );
}
