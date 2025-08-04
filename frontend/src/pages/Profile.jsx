import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false); // for profile fetch and submit
  const [error, setError] = useState(null); // store fetch error (e.g. not logged in)
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${backendUrl}/api/auth/profile`, {
          withCredentials: true,
        });
        setProfile(res.data);
        setFormData({
          name: res.data.name || '',
          phoneNumber: res.data.phoneNumber || '',
          password: '',
        });
        setError(null);
      } catch (err) {
        console.error('Profile fetch failed:', err);
        setError('You must be logged in to view your profile.');
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [backendUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`${backendUrl}/api/auth/profile`, formData, {
        withCredentials: true,
      });
      alert('Profile updated!');
      setEditMode(false);
      window.location.reload();
    } catch (err) {
      console.error('Update failed:', err);
      alert('Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${backendUrl}/api/auth/logout`, {}, { withCredentials: true });
      navigate('/auth/login');
    } catch (err) {
      console.error('Logout failed:', err);
      alert('Logout failed, please try again.');
    }
  };

  // Show loader while fetching or submitting
  if (loading) {
    return (
      <div className="text-center mt-10">
        <div className="loader border-4 border-blue-500 border-t-transparent border-solid rounded-full w-12 h-12 animate-spin mx-auto"></div>
        <p className="mt-2 text-gray-700">Loading...</p>
      </div>
    );
  }

  // If error (e.g. not logged in), show login prompt and button
  if (error) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-md rounded text-center">
        <p className="mb-4 text-red-600 font-semibold">{error}</p>
        <button
          onClick={() => navigate('/auth/login')}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (!profile) {
    // Profile is null but no error? Just show loading text as fallback
    return <div className="text-center mt-10">Loading profile...</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">My Profile</h2>

      {!editMode ? (
        <div>
          <p><strong>Name:</strong> {profile.name || 'N/A'}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Phone:</strong> {profile.phoneNumber || 'N/A'}</p>
          <p><strong>Provider:</strong> {profile.provider}</p>

          <div className="mt-6 flex justify-between">
            <button onClick={() => setEditMode(true)} className="bg-blue-500 text-white px-4 py-2 rounded">
              Edit Profile
            </button>
            <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
              Logout
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Name</label>
            <input name="name" value={formData.name} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Phone Number</label>
            <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
          </div>

          <div className="mb-4">
            <label className="block mb-1">New Password (optional)</label>
            <input name="password" type="password" value={formData.password} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
          </div>

          <div className="flex justify-between">
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Save</button>
            <button type="button" onClick={() => setEditMode(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProfilePage;
