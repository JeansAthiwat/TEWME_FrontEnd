import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CSS/CompleteProfile.css'; // ✅ Import CSS

const CompleteProfile = ({ setAccountState, setProfilePicture }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        phone: '',
        birthdate: '',
        role: 'learner',
    });

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (token) {
            console.log("✅ Token extracted from URL:", token);
            localStorage.setItem('token', token);
        } else {
            console.error("❌ No token found in URL, redirecting to login...");
            navigate('/login');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        console.log("🚀 Sending Profile Data:", formData);
        console.log("Json Data:", JSON.stringify(formData));

        try {
            const response = await fetch('http://localhost:39189/api/profile/complete-profile', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.msg || 'Profile update failed');

            console.log("✅ Profile completed successfully:", data);

            localStorage.setItem('token', data.token);
            setAccountState(data.user.role);
            setProfilePicture(data.user.profilePicture || '');
            
            navigate('/');
        } catch (error) {
            console.error("❌ Error updating profile:", error);
        }
    };

    return (
        <div className="complete-profile-container">
            <h2>Complete Your Profile</h2>
            <form className="complete-profile-form" onSubmit={handleSubmit}>
                <input type="text" placeholder="First Name" value={formData.firstname}
                    onChange={(e) => setFormData({ ...formData, firstname: e.target.value })} required />
                <input type="text" placeholder="Last Name" value={formData.lastname}
                    onChange={(e) => setFormData({ ...formData, lastname: e.target.value })} required />
                <input type="text" placeholder="Phone Number" value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
                <input type="date" max={new Date().toISOString().split("T")[0]} value={formData.birthdate}
                    onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })} required />

                <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                    <option value="learner">Learner</option>
                    <option value="tutor">Tutor</option>
                </select>

                <button type="submit">Complete Profile</button>
            </form>
        </div>
    );
};

export default CompleteProfile;
