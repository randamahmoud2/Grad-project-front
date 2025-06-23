import './Appointment.css';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Patientoption } from '../patientData/patientoption';
import Sidebar from '../ReciptionaistSidebar/Sidebar';

const SelectAppoint = () => {
     const [selectedDay, setSelectedDay] = useState(null);
     const [selectedTime, setSelectedTime] = useState(null);
     const [isLoading, setIsLoading] = useState(false);
     const [error, setError] = useState(null);
     const [availableSlots, setAvailableSlots] = useState([]);
     const [doctor, setDoctor] = useState(null);
     const [availableDays, setAvailableDays] = useState([]);
     const navigate = useNavigate();
     const { docId,id } = useParams();

     // Fetch doctor data when component mounts
       useEffect(() => {
           const fetchDoctor = async () => {
               try {
                   setIsLoading(true);
                   const response = await fetch(`http://localhost:5068/api/Doctors/${docId}`);
                   if (!response.ok) {
                       throw new Error('Failed to fetch doctor data');
                   }
                   const data = await response.json();
                   setDoctor(data);
               } catch (err) {
                   setError(err.message);
               } finally {
                   setIsLoading(false);
               }
           };
   
           const fetchAvailableSlots = async () => {
               try {
                   setIsLoading(true);
                   const response = await fetch(`http://localhost:5068/api/schedule/available/${docId}`);
                   if (!response.ok) {
                       throw new Error('Failed to fetch available slots');
                   }
                   const data = await response.json();
                   setAvailableSlots(data);
                   console.log('Available Slots:', data);
                   // Extract unique days from available slots
                   const uniqueDays = [...new Set(data.map(slot => slot.dayOfWeek))]
                       .map(day => {
                           // Convert dayOfWeek (0-6) to actual date
                           const date = new Date();
                           const daysUntilNext = (day - date.getDay() + 7) % 7;
                           date.setDate(date.getDate() + daysUntilNext);
                           
                           return {
                               day: date.toLocaleDateString('en-US', { weekday: 'short' }),
                               date: date.toISOString().split('T')[0],
                               dayOfWeek: day
                           };
                       })
                       .sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date
                   
                   setAvailableDays(uniqueDays);
               } catch (err) {
                   setError(err.message);
               } finally {
                   setIsLoading(false);
               }
           };
   
           fetchDoctor();
           fetchAvailableSlots();
       }, [docId]);
   
       // Filter time slots based on available slots for selected day
       const getAvailableTimeSlots = () => {
           if (!selectedDay) return [];
           
           // Find the dayOfWeek for the selected date
           const selectedDayObj = availableDays.find(day => day.date === selectedDay);
           if (!selectedDayObj) return [];
           
           return availableSlots
               .filter(slot => 
                   slot.dayOfWeek === selectedDayObj.dayOfWeek && 
                   slot.isAvailable
               )
               .map(slot => slot.timeSlot)
               .sort((a, b) => {
                   // Simple time comparison for sorting
                   const timeToMinutes = (time) => {
                       const [timePart, period] = time.split(' ');
                       const [hours, minutes] = timePart.split(':').map(Number);
                       let total = hours % 12 * 60 + minutes;
                       if (period === 'PM' && hours !== 12) total += 12 * 60;
                       return total;
                   };
                   return timeToMinutes(a) - timeToMinutes(b);
               });
       };
   
       const handleBookAppointment = async () => {
           if (!selectedDay || !selectedTime || !doctor) return;
   
           setIsLoading(true);
           setError(null);
   
           try {
               const patientId = id;
               console.log('Patient ID:', patientId);
               console.log('Doctor ID:', docId);
               console.log('Selected Day:', selectedDay);
                console.log('Selected Time:', selectedTime);
                console.log('Doctor Details:', doctor);
               console.log('Available Days:', availableDays);
               console.log('Available Slots:', availableSlots);
               console.log('Available Time Slots:', getAvailableTimeSlots());
               console.log(selectedDay);
               console.log('Selected Time Slot:', selectedTime);
               if (!patientId) {
                   throw new Error('Patient ID not found. Please login again.');
               }

            //    alert(`Booking appointment for patient ID: ${patientId}, doctor ID: ${docId}, date: ${selectedDay}, time: ${selectedTime}`);
               // Prepare appointment data according to backend DTO
               const appointmentData = {
                   patientId: parseInt(patientId),
                   doctorId: parseInt(docId),
                   appointmentDate: selectedDay,
                   timeSlot: selectedTime
               };
   
               const response = await fetch(`http://localhost:5068/api/appointments`, {
                   method: 'POST',
                   headers: {
                       'Content-Type': 'application/json',
                   },
                   body: JSON.stringify(appointmentData)
               });
   
               if (!response.ok) {
                   const errorData = await response.json();
                   throw new Error(errorData.message || 'Failed to book appointment');
               }
   
               const appointmentResponse = await response.json();
                console.log('Appointment booked successfully:', appointmentResponse);
               // Navigate to show appointment with the response data
            navigate(`/Receptionist/Patient/${id}`,{
                state: { appointment: appointmentResponse }
            });
           } catch (err) {
               setError(err.message);
               console.error('Booking error:', err);
               
               // Redirect to login if patient ID is missing
               if (err.message.includes('Patient ID not found')) {
                   navigate('/login');
               }
           } finally {
               setIsLoading(false);
           }
       };
   
       return (
        <div>
            <div className='side-menu1'style={{marginTop:"-80px"}} >
                <Sidebar/>
                </div>
            <div>
                               <Patientoption />
                               </div>
           <div className="appointment-container" style={{marginTop:"50px"}} >
               <div className="appointment-header">
                   <h1>Book an Appointment</h1>
                   <div className="header-divider"></div>
               </div>
               
               {doctor ? (
                   <div className="doctor-booking-container">
                       <div className="doctor-profile-section">
                           <div className="doctor-image-container">
                               <img 
                                   src={doctor.imageUrl || 'default-doctor-image.jpg'} 
                                   alt={doctor.name} 
                                   className="doctor-image"
                               />
                           </div>
                           <div className="doctor-info">
                               <h2 className="doctor-name">{doctor.name}</h2>
                               <p className="doctor-specialty">{doctor.specialty}</p>
                               
                               <div className="doctor-bio-section">
                                   <h3 className="section-title">About</h3>
                                   <p className="doctor-bio">{doctor.bio || 'No bio available'}</p>
                               </div>
                               
                               <div className="doctor-details">
                                   <div className="detail-item">
                                       <span className="detail-label">Location:</span>
                                       <span className="detail-value">{doctor.location}</span>
                                   </div>
                                   <div className="detail-item fee">
                                       <span className="detail-label">Appointment Fee:</span>
                                       <span className="detail-value">${doctor.fee}</span>
                                   </div>
                               </div>
                           </div>
                       </div>
                       
                       <div className="booking-section">
                           <h2 className="booking-title">Select Available Time Slot</h2>
                           
                           <div className="date-selection">
                               <h3 className="date-section-title">Available Dates</h3>
                               <div className="date-buttons">
                                   {availableDays.map((day, index) => (
                                       <button
                                           key={index}
                                           className={`date-button ${selectedDay === day.date ? "selected" : ""}`}
                                           onClick={() => {
                                               setSelectedDay(day.date);
                                               setSelectedTime(null);
                                           }}
                                       >
                                           <span className="day-name">{day.day}</span>
                                           <span className="day-date">{day.date.split('-')[2]}</span>
                                       </button>
                                   ))}
                               </div>
                           </div>
                           
                           <div className="time-selection">
                               <h3 className="time-section-title">Available Times</h3>
                               {getAvailableTimeSlots().length > 0 ? (
                                   <div className="time-buttons">
                                       {getAvailableTimeSlots().map((time, index) => (
                                           <button
                                               key={index}
                                               className={`time-button ${selectedTime === time ? "selected" : ""}`}
                                               onClick={() => setSelectedTime(time)}
                                           >
                                               {time}
                                           </button>
                                       ))}
                                   </div>
                               ) : (
                                   <div className="no-slots-message">
                                       {selectedDay ? 'No available slots for this day' : 'Please select a date first'}
                                   </div>
                               )}
                           </div>
                           
                           {error && <div className="error-message">{error}</div>}
                           
                           <button
                               className={`book-button ${(!selectedDay || !selectedTime || isLoading) ? "disabled" : ""}`}
                               disabled={!selectedDay || !selectedTime || isLoading}
                               onClick={handleBookAppointment}
                           >
                               {isLoading ? (
                                   <>
                                       <span className="spinner"></span>
                                       Booking...
                                   </>
                               ) : (
                                   'Confirm Appointment'
                               )}
                           </button>
                       </div>
                   </div>
               ) : (
                   <div className="loading-section">
                       {isLoading ? (
                           <div className="loading-spinner"></div>
                       ) : error ? (
                           <div className="error-message">{error}</div>
                       ) : (
                           <div>Loading doctor information...</div>
                       )}
                   </div>
               )}
           </div>
       
       </div>
       
       );
};

export default SelectAppoint;

// import './Appointment.css';
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Patientoption } from '../patientData/patientoption';

// const Selectappointment = () => {
//     const [selectedDay, setSelectedDay] = useState(null);
//     const [selectedTime, setSelectedTime] = useState(null);
//     const [doctor, setDoctor] = useState(null);
//     const [patient, setPatient] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const navigate = useNavigate();

//     const bookingDays = [
//         { day: "Wed", date: "19 Apr 2025" },
//         { day: "Thu", date: "20 Apr 2025" },
//         { day: "Fri", date: "21 Apr 2025" },
//         { day: "Sat", date: "22 Apr 2025" },
//         { day: "Sun", date: "23 Apr 2025" },
//         { day: "Mon", date: "24 Apr 2025" },
//         { day: "Tue", date: "25 Apr 2025" },
//     ];

//     const timeSlots = ["01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM"];

//     const { docId } = useParams();
//     const { id } = useParams();

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 // Fetch doctor data
//                 const doctorResponse = await fetch(`http://localhost:5068/api/Doctors/${docId}`);
//                 if (!doctorResponse.ok) {
//                     throw new Error(`Failed to fetch doctor data: ${doctorResponse.status}`);
//                 }
//                 const doctorData = await doctorResponse.json();
//                 setDoctor(doctorData);

//                 // Fetch patient data
//                 const patientResponse = await fetch(`http://localhost:5068/api/Patients/${id}`);
//                 if (!patientResponse.ok) {
//                     throw new Error(`Failed to fetch patient data: ${patientResponse.status}`);
//                 }
//                 const patientData = await patientResponse.json();
//                 setPatient(patientData);

//             } catch (err) {
//                 setError('Failed to load data. Please try again later.');
//                 console.error('Error fetching data:', err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, [docId, id]);

//     const handleBooking = async () => {
//         try {
//             if (!selectedDay || !selectedTime || !doctor || !patient) {
//                 setError('Please select a day and time, and ensure doctor and patient data are loaded.');
//                 return;
//             }

//             // Convert date and time to ISO format
//             const [day, month, year] = selectedDay.split(' ');
//             const monthMap = {
//                 'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
//                 'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
//                 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
//             };
//             const formattedDate = `${year}-${monthMap[month]}-${day.padStart(2, '0')}T${convertTo24Hour(selectedTime)}:00`;

//             // Send booking data to the backend
//             const response = await fetch('http://localhost:5068/api/Bookings', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     patientId: patient.id,
//                     doctorId: doctor.id,
//                     bookingDate: formattedDate
//                 })
//             });

//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.message || `Failed to book appointment: ${response.status}`);
//             }

//             const responseData = await response.json();

//             // Create appointment object for navigation
//             const appointment = {
//                 ID: responseData.bookingId,
//                 doctor,
//                 patient,
//                 day: selectedDay,
//                 time: selectedTime
//             };

//             navigate('/Receptionist/ShowAppointment', {
//                 state: appointment
//             });

//         } catch (err) {
//             setError('Failed to book appointment. Please try again.');
//             console.error('Booking error:', err);
//         }
//     };

//     // Function to convert 12-hour time to 24-hour format
//     const convertTo24Hour = (time12h) => {
//         const [time, modifier] = time12h.split(' ');
//         let [hours, minutes] = time.split(':');

//         if (hours === '12') {
//             hours = '00';
//         }

//         if (modifier === 'PM') {
//             hours = parseInt(hours, 10) + 12;
//         }

//         return `${hours}:${minutes}`;
//     };

//     if (loading) return <div className="loading">Loading...</div>;
//     if (error) return <div className="error">{error}</div>;
//     if (!doctor || !patient) return <div className="error">Doctor or patient not found</div>;

//     return (
//         <div className='Appointment1'>
//             <Patientoption />
//             <div className='data2'>
//                 <div className='title2'>
//                     <p>Doctor Slots</p>
//                 </div>
//             </div>
//             <hr id="split" />
//             <div>
//                 <div className='body'>
//                     <div className='DocPhoto'>
//                         <img src={doctor.imageUrl || doctor.image} alt={doctor.name} />
//                     </div>
//                     <div className='bookSlots'>
//                         <div className='DocInfo'>
//                             <div className='info'>
//                                 <p className='docname'>{doctor.name}</p>
//                                 <div>
//                                     <p className='doc-about'>About</p>
//                                     <p className='doc-about-p'>{doctor.about || 'No description available'}</p>
//                                 </div>
//                                 <p className='doc-price'>Appointment fee: {doctor.fee || doctor.price}</p>
//                             </div>
//                         </div>

//                         <h3 className="section-title">Booking slots</h3>
//                         <div className="slots">
//                             <div className='dateTime'>
//                                 {bookingDays.map((day, index) =>
//                                     <button
//                                         key={index}
//                                         className={selectedDay === day.date ? "selected" : ""}
//                                         onClick={() => setSelectedDay(day.date)}
//                                     >
//                                         <p>{day.day}</p>
//                                         <p>{day.date.slice(0, 2)}</p>
//                                     </button>
//                                 )}
//                             </div>
//                             <div className='time1'>
//                                 {timeSlots.map((time, index) =>
//                                     <button
//                                         key={index}
//                                         className={selectedTime === time ? "button selected" : "button"}
//                                         onClick={() => setSelectedTime(time)}
//                                     >
//                                         {time}
//                                     </button>
//                                 )}
//                             </div>
//                         </div>
//                         <button
//                             className='book'
//                             disabled={!selectedDay || !selectedTime}
//                             onClick={handleBooking}
//                         >
//                             Book An Appointment
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Selectappointment;