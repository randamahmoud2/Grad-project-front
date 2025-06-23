import React, { useEffect, useState } from "react";
import "./Dashboard.css";

import money from "../../../image/money.png";
import profile from "../../../image/user.png";
import cancel from "../../../image/cancel.png";
import correct from "../../../image/checked.png";
import patient from "../../../image/patient.png";
import appointment from "../../../image/appointment.png";
import list from "../../../image/to-do-list.png";

export const DashBoardInfo = () => {
    const [bookings, setBookings] = useState([]);
    const [totalFees, setTotalFees] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const doctorId = localStorage.getItem('doctorId');
    const [earnings, setEarnings] = useState([]);
    
    useEffect(() => {
        const fetchBookings = async () => {
           try {
    const response = await fetch("http://localhost:5068/api/Bookings");
    if (!response.ok) {
        throw new Error('Failed to fetch bookings');
    }
    const data = await response.json();
    
    setBookings(data);
    const earnings = data
        .filter(b => b.status === "Paid")
        .reduce((acc, cur) => acc + (cur.doctor?.fee || 0), 0);
    setTotalFees(earnings);
    
} catch (err) {
    setError(err.message);
    console.error("Error fetching bookings:", err);
} finally {
    setLoading(false);
}
        };

        fetchBookings();
    }, []);

    const handleStatusChange = async (id, status) => {
        try {
            const response = await fetch(`http://localhost:5068/api/Bookings/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status })
            });

            if (!response.ok) {
                throw new Error('Failed to update booking status');
            }

            setBookings(prev =>
                prev.map(b =>
                    b.id === id ? { ...b, status } : b
                )
            );

            if (status === "paid") {
                const fee = bookings.find(b => b.id === id)?.fee || 0;
                
                setTotalFees(prev => prev + fee);
            }
        } catch (err) {
            setError(err.message);
            console.error("Error updating booking status:", err);
        }
    };







  useEffect(() => {
    const fetchEarnings = async () => {
      if (!doctorId) {
        console.error('No doctorId found in localStorage');
                setLoading(true);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5068/api/Dashboard/GetAdminEarning/`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
                const data = await response.json();
                console.log(data)
                
        // Get the first object
        const firstItem = data[0];

        // Extract totalEarningsFees
        const totalEarnings = firstItem.totalEarningsFees;

        console.log(totalEarnings); // Output: 50
        if (totalEarnings) {
          setEarnings(totalEarnings);
        } else {
          console.warn('No earnings found for this doctor.');
          setEarnings(0);
        }
       
      } catch (error) {
        console.error('Error fetching earnings:', error);
      } finally {
                setLoading(false);
      }
    };

    fetchEarnings();
  }, []);














    


    







    if (loading) return <div className="loading">Loading dashboard data...</div>;
    if (error) return <div className="error">{error}</div>;



    return (
        <div className="dashboard1">
            <div className="data2">
                <div className="title2"><p>Dashboard</p></div>
                <hr id="split" />
            </div>

            <div className="details">
                <div className="up1">
                    <div className="docInfo">
                        <div className="Info1">
                            <img src={money} alt="" style={{ width: "40px" }} />
                            <div>
                                <p>$ {earnings}</p>
                                <p style={{ color: "rgba(3, 3, 76, 0.416)" }}>Earnings</p>
                            </div>
                        </div>
                        <div className="Info1">
                            <img src={appointment} alt="" style={{ width: "40px" }} />
                            <div>
                                <p>{bookings.length}</p>
                                <p style={{ color: "rgba(3, 3, 76, 0.416)" }}>Appointments</p>
                            </div>
                        </div>
                        <div className="Info1">
                            <img src={patient} alt="" style={{ width: "40px" }} />
                            <div>
                                <p>{[...new Set(bookings.map(b => b.patientId || b.patient))].length}</p>
                                <p style={{ color: "rgba(3, 3, 76, 0.416)" }}>Patients</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="down1">
                    <div className="title1" style={{ width: "100%" }}>
                        <div>
                            <img src={list} alt="" style={{ width: "30px" }} />
                            <p>Latest Appointments</p>
                        </div>
                        <hr />
                    </div>

                    {bookings.length === 0 ? (
                        <p style={{ textAlign: 'center', fontSize: '16px', fontWeight: '600', color: 'gray', marginTop: '20px' }}>
                            There Are No Appointments
                        </p>
                    ) : (
                        bookings.slice(0, 5).map((booking) => (
                            <div className="appointment" key={booking.id}>
                                <div className="description">
                                    <img src={profile} alt="" style={{ width: "50px", height: "50px" }} />
                                    <div>
                                        <p style={{ fontWeight: "600", marginBottom: "2px" }}>
                                           Dr.{booking.doctorName || "Doctor"} | {booking.patientName|| "Patient"} 
                                        </p>
                                      {console.log(bookings)}
                                        <p>Appointment on {new Date(booking.bookingDate).toLocaleDateString()}</p>

                                        <p>Fees: ${booking.amount?.toFixed(2) || "0.00"}</p>
                                    </div>
                                </div>
                                <div className="complete">
                                    {(!booking.status || booking.status === "pending") && (
                                        <>
                                            <button onClick={() => handleStatusChange(booking.id, "cancelled")}>
                                                <img src={cancel} alt="Cancel" style={{ width: "40px" }} />
                                            </button>
                                            <button onClick={() => handleStatusChange(booking.id, "paid")}>
                                                <img src={correct} alt="Complete" style={{ width: "35px" }} />
                                            </button>
                                        </>
                                    )}
                                    {booking.status === "paid" && (
                                        <p style={{ color: "green", fontWeight: "600", fontSize: "18px" }}>Paid</p>
                                    )}
                                    {booking.status === "cancelled" && (
                                        <p style={{ color: "red", fontWeight: "600", fontSize: "18px" }}>Cancelled</p>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashBoardInfo;