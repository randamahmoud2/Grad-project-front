import './PatientDashboard.css';
import profile from '../../image/user.png';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const PatientDashboard = () => {
    const [dashboardData, setDashboardData] = useState({
        patient: null,
        upcomingAppointments: [],
        recentActivities: []
    });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const patientId = localStorage.getItem('patientId'); // Changed to match your example data
                const response = await fetch(`http://localhost:5068/api/Patients/${patientId}/dashboard`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || errorData.message || 'Failed to fetch dashboard data');
                }

                const data = await response.json();
                setDashboardData({
                    patient: data.patient || null,
                    upcomingAppointments: data.upcomingAppointments || [],
                    recentActivities: data.recentActivities || []
                });
            } catch (err) {
                setError(err.message);
                console.error('Error fetching dashboard:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (isLoading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error-message">Error: {error}</div>;
    }

    const { patient, upcomingAppointments, recentActivities } = dashboardData;

    return (
        <div className="patient-dashboard-portal">
            <div className="patient-header">
                <img src={profile} alt="Patient" className="patient-avatar" />
                <div className="patient-info">
                    <div className="patient-main">
                        <h2>{patient?.name || 'Unknown Patient'}</h2>
                        <span className="patient-id">ID: {patient?.patientId || 'N/A'}</span>
                        <span className="patient-dob">DOB: {patient?.dob ? new Date(patient.dob).toLocaleDateString() : 'N/A'}</span>
                        <span className="patient-status">Active</span>
                    </div>
                    <div className="patient-details">
                        <div>
                            <span className="label">Email</span>
                            <span>{patient?.email || 'N/A'}</span>
                        </div>
                        <div>
                            <span className="label">Phone</span>
                            <span>{patient?.phoneNumber || 'N/A'}</span>
                        </div>
                        <div>
                            <span className="label">Last Visit</span>
                            <span>{patient?.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : 'N/A'}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="patient-tabs">
                <div className="tab active">Dashboard</div>
                <Link to="/Patient/ShowAppointment" className="tab">Appointments</Link>
                <div className="tab">Medical History</div>
                <div className="tab">Payments</div>
            </div>

            <div className="dashboard-content">
                <div className="appointments-section">
                    <div className="appointments-header">
                        <h3>Upcoming Appointments</h3>
                        <Link to="/Patient/Doctors" className="new-appointment-btn">
                            Book New Appointment
                        </Link>
                    </div>
                    <div className="appointments-list">
                        {upcomingAppointments.length > 0 ? (
                            upcomingAppointments.map(appointment => (
                                <div key={appointment.id} className="appointment-card">
                                    <div>
                                        <div className="doctor-name">{appointment.doctorName || 'No doctor assigned'}</div>
                                        <div className="specialty">{appointment.specialty || 'No specialty specified'}</div>
                                    </div>
                                    <div className="appointment-meta">
                                        <div>
                                            {appointment.date ? new Date(appointment.date).toLocaleDateString() : 'No date set'}
                                        </div>
                                        <div className="status-badge">{appointment.status || 'No status'}</div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No upcoming appointments</p>
                        )}
                    </div>
                </div>

                <div className="activity-section">
                    <h3>Recent Activity</h3>
                    <div className="activity-list">
                        {recentActivities.length > 0 ? (
                            recentActivities.map(activity => (
                                <div key={activity.id} className="activity-item">
                                    <div className="activity-dot"></div>
                                    <div className="activity-content">
                                        <div className="activity-title">
                                            {activity.title || 'Activity'}
                                            <span className="activity-type">{activity.type || 'General'}</span>
                                        </div>
                                        <div className="activity-status">{activity.status || 'Completed'}</div>
                                        <div className="activity-date">
                                            {activity.date ? new Date(activity.date).toLocaleDateString() : 'No date'}
                                        </div>
                                        <div className="activity-desc">
                                            {activity.description || 'No description available'}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No recent activities</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;

// import './PatientDashboard.css';
// import profile from '../../image/user.png';
// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';

// export const PatientDashboard = () => {
//     const [patient, setPatient] = useState(null);
//     const [appointments, setAppointments] = useState([]);
//     const [activities, setActivities] = useState([]);
//     const [error, setError] = useState(null);
//     const [isLoading, setIsLoading] = useState(true);

//     useEffect(() => {
//         const fetchDashboardData = async () => {
//             try {
//                 const patientId = 1;
//                 const response = await fetch(`http://localhost:5068/api/Patients/${patientId}/dashboard`, {
//                     method: 'GET',
//                     headers: {
//                         'Content-Type': 'application/json',
//                         'Accept': 'application/json',
//                     },
//                 });

//                 if (!response.ok) {
//                     const errorData = await response.json();
//                     throw new Error(errorData.error || errorData.message || 'Failed to fetch dashboard data');
//                 }

//                 const data = await response.json();
//                 setPatient(data.patient || {});
//                 setAppointments(data.upcomingAppointments || []);
//                 // Transform activities to match expected format if needed
//                 const formattedActivities = data.recentActivities ? data.recentActivities.map(activity => ({
//                     id: activity.id,
//                     type: activity.type,
//                     title: activity.title,
//                     status: activity.status,
//                     date: activity.date,
//                     description: activity.description
//                 })) : [];
//                 setActivities(formattedActivities);
//             } catch (err) {
//                 setError(err.message);
//                 console.error('Error fetching dashboard:', err);
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         fetchDashboardData();
//     }, []);

//     if (isLoading) {
//         return <div className="loading">Loading...</div>;
//     }

//     if (error) {
//         return <div className="error-message">Error: {error}</div>;
//     }

//     return (
//         <div className="patient-dashboard-portal">
//             <div className="patient-header">
//                 <img src={profile} alt="Patient" className="patient-avatar" />
//                 <div className="patient-info">
//                     <div className="patient-main">
//                         <h2>{patient?.name || 'Unknown Patient'}</h2>
//                         <span className="patient-id">ID: {patient?.patientId || 'N/A'}</span>
//                         <span className="patient-dob">DOB: {patient?.dob ? new Date(patient.dob).toLocaleDateString() : 'N/A'}</span>
//                         <span className="patient-status">Active</span>
//                     </div>
//                     <div className="patient-details">
//                         <div>
//                             <span className="label">Email</span>
//                             <span>{patient?.email || 'N/A'}</span>
//                         </div>
//                         <div>
//                             <span className="label">Phone</span>
//                             <span>{patient?.phoneNumber || 'N/A'}</span>
//                         </div>
//                         <div>
//                             <span className="label">Last Visit</span>
//                             <span>{patient?.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : 'N/A'}</span>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <div className="patient-tabs">
//                 <div className="tab active">Dashboard</div>
//                 <Link to="/Patient/ShowAppointment" className="tab">Appointments</Link>
//                 <div className="tab">Medical History</div>
//                 <div className="tab">Payments</div>
//             </div>

//             <div className="dashboard-content">
//                 <div className="appointments-section">
//                     <div className="appointments-header">
//                         <h3>Upcoming Appointments</h3>
//                         <Link to="/Patient/Doctors" className="new-appointment-btn">
//                             Book New Appointment
//                         </Link>
//                     </div>
//                     <div className="appointments-list">
//                         {appointments.length === 0 ? (
//                             <p>No upcoming appointments</p>
//                         ) : (
//                             appointments.map(appointment => (
//                                 <div key={appointment.id} className="appointment-card">
//                                     <div>
//                                         <div className="doctor-name">{appointment.doctorName || 'Doctor Name Not Available'}</div>
//                                         <div className="specialty">{appointment.specialty || 'Specialty Not Available'}</div>
//                                     </div>
//                                     <div className="appointment-meta">
//                                         <div>{appointment.time ? `${appointment.time} - ` : ''}{appointment.date ? new Date(appointment.date).toLocaleDateString() : 'Date Not Available'}</div>
//                                         <div className="status-badge">{appointment.status || 'Status Not Available'}</div>
//                                         <div>{appointment.price || 'Price Not Available'}</div>
//                                     </div>
//                                 </div>
//                             ))
//                         )}
//                     </div>
//                 </div>

//                 <div className="activity-section">
//                     <h3>Recent Activity</h3>
//                     <div className="activity-list">
//                         {activities.length === 0 ? (
//                             <p>No recent activities</p>
//                         ) : (
//                             activities.map(activity => (
//                                 <div key={activity.id} className="activity-item">
//                                     <div className="activity-dot"></div>
//                                     <div className="activity-content">
//                                         <div className="activity-title">
//                                             {activity.title}
//                                             <span className="activity-type">{activity.type}</span>
//                                         </div>
//                                         <div className="activity-status">{activity.status}</div>
//                                         <div className="activity-date">{new Date(activity.date).toLocaleDateString()}</div>
//                                         <div className="activity-desc">{activity.description}</div>
//                                     </div>
//                                 </div>
//                             ))
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default PatientDashboard;













// import './PatientDashboard.css';
// import profile from '../../image/user.png';
// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';

// export const PatientDashboard = () => {
//     const [patient, setPatient] = useState(null);
//     const [appointments, setAppointments] = useState([]);
//     const [activities, setActivities] = useState([]);
//     const [error, setError] = useState(null);
//     const [isLoading, setIsLoading] = useState(true);

//     useEffect(() => {
//         const fetchDashboardData = async () => {
//             try {
//                 // Get patientId from authentication (temporary fallback to 5)
//                 const patientId = 1;
//                 const response = await fetch(`http://localhost:5068/api/Patients/${patientId}/dashboard`, {
//                     method: 'GET',
//                     headers: {
//                         'Content-Type': 'application/json',
//                         'Accept': 'application/json',
//                         // Add Authorization header if authentication is implemented
//                         // 'Authorization': `Bearer ${localStorage.getItem('token')}`
//                     },
//                 });

//                 if (!response.ok) {
//                     const errorData = await response.json();
//                     throw new Error(errorData.error || errorData.message || 'Failed to fetch dashboard data');
//                 }

//                 const data = await response.json();
//                 setPatient(data.patient || {});
//                 setAppointments(data.upcomingAppointments || []);
//                 setActivities(data.recentActivities || []);
//             } catch (err) {
//                 setError(err.message);
//                 console.error('Error fetching dashboard:', err);
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         fetchDashboardData();
//     }, []);

//     if (isLoading) {
//         return <div className="loading">Loading...</div>;
//     }

//     if (error) {
//         return <div className="error-message">Error: {error}</div>;
//     }

//     return (
//         <div className="patient-dashboard-portal">
//             <div className="patient-header">
//                 <img src={profile} alt="Patient" className="patient-avatar" />
//                 <div className="patient-info">
//                     <div className="patient-main">
//                         <h2>{patient?.name || 'Unknown Patient'}</h2>
//                         <span className="patient-id">ID: {patient?.patientId || 'N/A'}</span>
//                         <span className="patient-dob">DOB: {patient?.dob ? new Date(patient.dob).toLocaleDateString() : 'N/A'}</span>
//                         <span className="patient-status">Active</span>
//                     </div>
//                     <div className="patient-details">
//                         <div>
//                             <span className="label">Email</span>
//                             <span>{patient?.email || 'N/A'}</span>
//                         </div>
//                         <div>
//                             <span className="label">Phone</span>
//                             <span>{patient?.phoneNumber || 'N/A'}</span>
//                         </div>
//                         <div>
//                             <span className="label">Last Visit</span>
//                             <span>{patient?.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : 'N/A'}</span>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <div className="patient-tabs">
//                 <div className="tab active">Dashboard</div>
//                 <Link to="/Patient/ShowAppointment" className="tab">Appointments</Link>
//                 <div className="tab">Medical History</div>
//                 <div className="tab">Payments</div>
//             </div>

//             <div className="dashboard-content">
//                 <div className="appointments-section">
//                     <div className="appointments-header">
//                         <h3>Upcoming Appointments</h3>
//                         <Link to="/Patient/Doctors" className="new-appointment-btn">
//                             Book New Appointment
//                         </Link>
//                     </div>
//                     <div className="appointments-list">
//                         {appointments.length === 0 ? (
//                             <p>No upcoming appointments</p>
//                         ) : (
//                             appointments.map(appointment => (
//                                 <div key={appointment.id} className="appointment-card">
//                                     <div>
//                                         <div className="doctor-name">{appointment.doctorName}</div>
//                                         <div className="specialty">{appointment.specialty}</div>
//                                     </div>
//                                     <div className="appointment-meta">
//                                         <div>{appointment.time} - {new Date(appointment.date).toLocaleDateString()}</div>
//                                         <div className="status-badge">{appointment.status}</div>
//                                         <div>{appointment.price}</div>
//                                     </div>
//                                 </div>
//                             ))
//                         )}
//                     </div>
//                 </div>

//                 <div className="activity-section">
//                     <h3>Recent Activity</h3>
//                     <div className="activity-list">
//                         {activities.length === 0 ? (
//                             <p>No recent activities</p>
//                         ) : (
//                             activities.map(activity => (
//                                 <div key={activity.id} className="activity-item">
//                                     <div className="activity-dot"></div>
//                                     <div className="activity-content">
//                                         <div className="activity-title">
//                                             {activity.title}
//                                             <span className="activity-type">{activity.type}</span>
//                                         </div>
//                                         <div className="activity-status">{activity.status}</div>
//                                         <div className="activity-date">{new Date(activity.date).toLocaleDateString()}</div>
//                                         <div className="activity-desc">{activity.description}</div>
//                                     </div>
//                                 </div>
//                             ))
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default PatientDashboard;