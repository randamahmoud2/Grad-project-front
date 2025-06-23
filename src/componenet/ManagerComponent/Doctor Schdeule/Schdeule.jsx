import React, { useState, useEffect } from "react";
import "./Scdeule.css";

const DoctorSchedule = () => {
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState({});
    const [startDay, setStartDay] = useState(0);
    const [daysInMonth, setDaysInMonth] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    const daysNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

    useEffect(() => {
        const doctors = [
            { name: 'Dr. Sarah Johnson',  Role: "Doctor", Specality: 'Orthodontist', Status: "No Record", CheckIn: "-", CheckOut: "-" },
            { name: 'Dr. Michael Chen',   Role: "Doctor", Specality: 'Periodontist', Status: "No Record", CheckIn: "-", CheckOut: "-" },
            { name: 'Dr. Emily Williams', Role: "Receptionist", Specality: 'Senior Receptionist', Status: "No Record", CheckIn: "-", CheckOut: "-" },
            { name: 'Dr. James Wilson',   Role: "Receptionist", Specality: 'Dental Assistant', Status: "No Record", CheckIn: "-", CheckOut: "-" },
        ];

        const exampleAppointments = {
            "Dr. Sarah Johnson": [
                { date: "2025-05-13", time: "10:00 AM", patient: "Ali", procedure: "Braces Checkup" },
                { date: "2025-05-13", time: "12:00 PM", patient: "Sara", procedure: "Retainer Fitting" }
            ],
            "Dr. Michael Chen": [
                { date: "2025-05-14", time: "9:30 AM", patient: "Huda", procedure: "Cleaning" },
                { date: "2025-05-31", time: "9:30 AM", patient: "John", procedure: "Cleaning" }
            ],
            "Dr. Emily Williams": [
                { date: "2025-05-14", time: "10:30 AM", patient: "Huda", procedure: "Cleaning" }
            ]
        };

        setDoctors(doctors);
        setAppointments(exampleAppointments);
        if (doctors.length > 0) {
            setSelectedDoctor(doctors[0]);
        }

        const days = [];
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();
        const date = new Date(year, month, 1);

        while (date.getMonth() === month) {
            days.push(new Date(date.getTime()));
            date.setDate(date.getDate() + 1);
        }

        setDaysInMonth(days);
        setStartDay(new Date(year, month, 1).getDay());
    }, [currentDate]);

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleDateClick = (date) => {
        setSelectedDate(date);
    };

    const handleDoctorChange = (e) => {
        const doctor = doctors.find(doc => doc.name === e.target.value);
        if (doctor) setSelectedDoctor(doctor);
    };

    const getDayWithSuffix = (day) => {
        if (day >= 11 && day <= 13) return `${day}th`;
        const lastDigit = day % 10;
        if (lastDigit === 1) return `${day}st`;
        if (lastDigit === 2) return `${day}nd`;
        if (lastDigit === 3) return `${day}rd`;
        return `${day}th`;
    };

    const filteredAppointments = (appointments[selectedDoctor?.name] || []).filter((appt) => {
        const apptDate = new Date(appt.date);
        return selectedDate && apptDate.toDateString() === selectedDate.toDateString();
    });

    return (
        <div className="schedule">
            <div className="data2">
                <div className="title2">
                    <p>View Doctors Schedule</p>
                </div>
                <hr id="split" />
            </div>

            <div className="body1">
                <div className="smLeft">
                    <strong>Select Date</strong>
                    <p style={{ color: "rgb(5, 5, 107)", opacity: "0.7", fontSize: "12px", marginTop: "-5px" }}>Choose a date to view schedules</p>
                    <div className="calendar">
                        <div className="calendar-header">
                            <button onClick={prevMonth}>&lt;</button>
                            <span>{currentDate.toLocaleString("default", { month: "long" })} {currentDate.getFullYear()}</span>
                            <button onClick={nextMonth}>&gt;</button>
                        </div>

                        <div className="days-name">
                            {daysNames.map((day) => (
                                <div key={day} className="day-name">{day}</div>
                            ))}
                        </div>

                        <div className="days">
                            {Array.from({ length: startDay }).map((_, index) => (
                                <div key={index} className="empty-day"></div>
                            ))}
                            {daysInMonth.map((day) => {
                                const today = new Date();
                                const isToday = day.toDateString() === today.toDateString();
                                const isSelected = selectedDate && day.toDateString() === selectedDate.toDateString();

                                return (
                                    <div
                                        key={day}
                                        className={`day ${isToday ? "today" : ""} ${isSelected ? "selected" : ""}`}
                                        onClick={() => handleDateClick(day)}
                                    > {day.getDate()}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="lrRight">
                    <h2 className="subtitle">
                        Schedules for: {selectedDate.toLocaleString("default", { month: "long" })} {getDayWithSuffix(selectedDate.getDate())}, {selectedDate.getFullYear()}
                    </h2>
                    <p style={{ color: "rgb(5, 5, 107)", opacity: "0.7", fontSize: "12px", marginTop: "-5px" }}>Doctor appointments and procedures</p>

                    <div>
                        <select value={selectedDoctor?.name} onChange={handleDoctorChange} className="docattend">
                            {doctors.map((doc) => (
                                <option key={doc.name} value={doc.name}>
                                    {doc.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="tabs">
                        <div className="card1">
                            <h3 className="subtitle" style={{ color: "#2f6fc8", marginLeft: "10px" }}>{selectedDoctor?.name}</h3>
                            <p style={{ color: "rgb(5, 5, 107)", opacity: "0.7", marginTop: "-5px" }}>{selectedDoctor?.specialty}</p>
                            <hr style={{ border: "1px solid rgba(7, 7, 143, 0.21)", margin: "10px 0 20px 10px" }} />
                            <table className="staff-table" >
                                <thead>
                                    <tr>
                                        <th>Time</th>
                                        <th>Patient</th>
                                        <th>Procedure</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        filteredAppointments.map((appt, index) => (
                                            <tr key={index} className="row">
                                                <td>{appt.time}</td>
                                                <td>{appt.patient}</td>
                                                <td>{appt.procedure}</td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorSchedule;
