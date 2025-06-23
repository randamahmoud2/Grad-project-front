import React from 'react'
import './perio.css'
import Layout from "../../../Layout"
import Patients from '../../../PatientData.json';
import { useParams, useNavigate } from 'react-router-dom';

const PeriodentalChart = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const patient = Patients.find((p) => String(p.id) === id);
    return (
        <div className='perio'>
            <div className="data2">
                <div className='title2'>
                    <p>Periodontal Chart</p>
                    <p id="name">{patient.name} / {patient.id}</p>
                </div>
            </div>
            <hr id="split" />
            <Layout />
        </div>
    )
}

export default PeriodentalChart;