import React, { useState, useEffect } from 'react';
import './DoctorList.css';
import { useNavigate } from 'react-router-dom';

const DoctorList = () => {
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);
    const [error, setError] = useState(null);

    // جلب بيانات الأطباء من الـ API
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await fetch('http://localhost:5068/api/Doctors', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch doctors');
                }

                const data = await response.json();
                setDoctors(data);
            } catch (error) {
                console.error('Error fetching doctors:', error);
                setError('Could not load doctors. Please try again later.');
            }
        };
        fetchDoctors();
    }, []);

    return (
        <div className='doctorList'>
            <div className='data2'>
                <div className='title2'>
                    <p>Our Expert Doctors</p>
                </div>
                <p className="subtitle">Find and book appointments with our qualified dental specialists</p>
            </div>
            <hr id="split" />

            <div className="doctors-grid">
                {error ? (
                    <p style={{ color: 'red' }}>{error}</p>
                ) : (
                    doctors.map(doctor => (
                        <div 
                            className="doctor-card" 
                            key={doctor.id} 
                            onClick={() => navigate(`/Patient/Doctors/${doctor.id}`)}
                        >
                            <div className="doctor-image">
                                <img 
                                    src={doctor.imageUrl || 'https://via.placeholder.com/150'} 
                                    alt={doctor.name} 
                                />
                                <div className="rating">
                                    <span>★</span> {doctor.rating || 'N/A'}
                                </div>
                            </div>
                            <div className="doctor-info">
                                <h3>Dr.{doctor.name}</h3>
                                <p className="specialty">{doctor.specialty}</p>
                                <p className="experience">Experience: {doctor.experience || 'Not specified'}</p>
                                <p className="education">{doctor.bio || 'Not specified'}</p>
                                <p className="address">{doctor.location}</p>
                            </div>
                            <button 
                                className="book-btn" 
                                onClick={(e) => {
                                    e.stopPropagation(); // منع التنقل عند النقر على الزر
                                    navigate(`/Patient/appointment/${doctor.id}`);
                                }}
                            >
                                Book Appointment
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default DoctorList;