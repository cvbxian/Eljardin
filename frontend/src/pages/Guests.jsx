import React, { useEffect, useState } from 'react';

export default function Guests() {
    const [data, setData] = useState([]);

    useEffect(() => {
        // Fetch users (guests) data from backend
        fetch('http://localhost:5000/api/users')
            .then(res => res.json())
            .then(res => setData(res))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">Guests Page</h1>
            {data.length > 0 ? (
                <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(data, null, 2)}</pre>
            ) : (
                <p>No guests found.</p>
            )}
        </div>
    );
}
