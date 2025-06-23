import React, { useState, useEffect } from 'react';
import './Finance.css';

const Finance = () => {
  const [financeData, setFinanceData] = useState([]);  // البيانات تبدأ فاضية

  // مثال: تحميل البيانات من API أو من أي مصدر بيانات
  useEffect(() => {
    // هنا مكان الكود اللي هيجيب البيانات من السيرفر أو الداتابيس
    // مثلاً:
    // fetch('/api/finance')
    //   .then(res => res.json())
    //   .then(data => setFinanceData(data))
    //   .catch(err => console.error(err));

    // حاليا بنخليها فاضية عشان تكون جاهزة لاستقبال البيانات
  }, []);

  // حساب المجاميع مع شرط تأكد من وجود بيانات
  const totalPaid = financeData
    .filter(item => item.status === 'Paid')
    .reduce((acc, item) => acc + item.amount, 0);

  const totalPending = financeData
    .filter(item => item.status === 'Pending')
    .reduce((acc, item) => acc + item.amount, 0);

  const total = financeData.reduce((acc, item) => acc + item.amount, 0);

  return (
    <div className="finance-container">
      <div className="data2">
        <div className='title2'>
            <p>Payment History</p>
        </div>
        <hr id='split'/>
      </div>
      <div className="finance-summary">
        <div className="summary-card paid">Paid: <span>{totalPaid} EGP</span></div>
        <div className="summary-card pending">Pending: <span>{totalPending} EGP</span></div>
        <div className="summary-card total">Total: <span>{total} EGP</span></div>
      </div>
      <div className="finance-table-responsive">
        <table className="finance-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Procedure</th>
              <th>Doctor</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {financeData.map(item => (
                <tr key={item.id}>
                  <td>{item.date}</td>
                  <td>{item.procedure}</td>
                  <td>{item.doctor}</td>
                  <td>{item.amount} EGP</td>
                  <td>
                    <span className={`status-badge ${item.status.toLowerCase()}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Finance;
