import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaGoogleDrive, FaArrowLeft } from 'react-icons/fa';

const DriveLetters = () => {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDriveLetters();
  }, []);

  const fetchDriveLetters = async () => {
    try {
      // First check if user is authenticated
      const authResponse = await axios.get('http://localhost:5000/api/auth/current-user');
      if (!authResponse.data) {
        navigate('/');
        return;
      }

      const response = await axios.get('http://localhost:5000/api/letters/drive/letters', {
        withCredentials: true
      });
      setLetters(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching Drive letters:', error);
      if (error.response?.status === 401) {
        // If unauthorized, redirect to login
        navigate('/');
      } else {
        setError('Failed to fetch letters from Google Drive. Please try again.');
      }
      setLoading(false);
    }
  };

  const handleLetterClick = (letter) => {
    navigate(`/editor/${letter.id}`, { state: { letter, isDriveLetter: true } });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="mr-4 text-gray-600 hover:text-gray-800"
        >
          <FaArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold flex items-center">
          <FaGoogleDrive className="mr-2 text-blue-500" />
          Google Drive Letters
        </h1>
      </div>

      {letters.length === 0 ? (
        <div className="text-center text-gray-500">
          No letters found in Google Drive
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {letters.map((letter) => (
            <div
              key={letter.id}
              onClick={() => handleLetterClick(letter)}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            >
              <h2 className="text-lg font-semibold mb-2">{letter.title}</h2>
              <p className="text-gray-600 text-sm mb-2">
                Last modified: {new Date(letter.lastModified).toLocaleDateString()}
              </p>
              <p className="text-gray-700 line-clamp-3">
                {letter.content.substring(0, 150)}...
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DriveLetters; 
