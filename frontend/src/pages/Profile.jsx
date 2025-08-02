import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
const backendUrl = import.meta.env.VITE_BACKEND_URL;

  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/auth/profile`, {
          withCredentials: true, // Send cookie
        });
        setProfile(res.data);
       
        setFormData({
          name: res.data.name || '',
          phoneNumber: res.data.phoneNumber || '',
          password: '',
        });
      } catch (err) {
        console.error('Profile fetch failed:', err);
        navigate('/auth/login');
      }
    };
    fetchProfile();
  }, [navigate]);

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${backendUrl}/api/auth/profile`, formData, {
        withCredentials: true,
      });
      alert('Profile updated!');
      setEditMode(false);
      window.location.reload(); // Re-fetch profile
    } catch (err) {
      console.error('Update failed:', err);
      alert('Update failed');
    }
  };

 
  const handleLogout = async () => {
   window.location.href = `${backendUrl}/api/auth/logout`;

  };

  if (!profile) return <div className="text-center mt-10">Loading...</div>;

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
