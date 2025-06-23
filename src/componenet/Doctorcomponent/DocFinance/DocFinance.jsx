import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaMoneyBillWave, FaFileInvoiceDollar, FaChartLine, FaSearch, FaFileCsv, FaFilter, FaSpinner } from 'react-icons/fa';
import './DocFinance.css';

const DocFinance = () => {
    // UI States
    const [activeTab, setActiveTab] = useState('overview');
    const [filterPeriod, setFilterPeriod] = useState('month');
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterAmount, setFilterAmount] = useState('all');
    
    // API Data States
    const [isLoading, setIsLoading] = useState({
        summary: true,
        payments: true,
        analytics: true
    });
    const [error, setError] = useState({
        summary: null,
        payments: null,
        analytics: null
    });
    
    // Data States
    const [summaryData, setSummaryData] = useState({
        totalEarnings: 0,
        pendingPayments: 0,
        completedPayments: 0,
        totalPatients: 0,
        averagePerPatient: 0
    });
    const [paymentsData, setPaymentsData] = useState([]);
    const [serviceBreakdownData, setServiceBreakdownData] = useState([]);
    const [monthlyEarningsData, setMonthlyEarningsData] = useState([]);
    
    // Fetch summary data
    useEffect(() => {
        setIsLoading(prev => ({ ...prev, summary: true }));
        
        const fetchSummaryData = async () => {
            try {
                setTimeout(() => {
                    setSummaryData({
                        totalEarnings: 0,
                        pendingPayments: 0,
                        completedPayments: 0,
                        totalPatients: 0,
                        averagePerPatient: 0
                    });
                    setIsLoading(prev => ({ ...prev, summary: false }));
                }, 1000);
                
            } catch (err) {
                setError(prev => ({ ...prev, summary: 'Error loading summary data' }));
                setIsLoading(prev => ({ ...prev, summary: false }));
            }
        };
        
        fetchSummaryData();
    }, [filterPeriod]);
    
    // Fetch payments data
    useEffect(() => {
        setIsLoading(prev => ({ ...prev, payments: true }));
        
        const fetchPaymentsData = async () => {
            try {
                setTimeout(() => {
                    setPaymentsData([]);
                    setIsLoading(prev => ({ ...prev, payments: false }));
                }, 1000);
                
            } catch (err) {
                setError(prev => ({ ...prev, payments: 'Error loading payment data' }));
                setIsLoading(prev => ({ ...prev, payments: false }));
            }
        };
        
        fetchPaymentsData();
    }, []);
    
    useEffect(() => {
        setIsLoading(prev => ({ ...prev, analytics: true }));
        
        const fetchAnalyticsData = async () => {
            try {
                setTimeout(() => {
                    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    setMonthlyEarningsData(
                        months.map(month => ({ month, amount: 0 }))
                    );
                    setServiceBreakdownData([]);
                    setIsLoading(prev => ({ ...prev, analytics: false }));
                }, 1000);
                
            } catch (err) {
                setError(prev => ({ ...prev, analytics: 'Error loading analytics data' }));
                setIsLoading(prev => ({ ...prev, analytics: false }));
            }
        };
        
        fetchAnalyticsData();
    }, [filterPeriod]);
    
    const filteredPayments = paymentsData.filter(payment => {
        if (isLoading.payments || !payment) return false;
        
        const matchesSearch = !searchQuery || 
                             payment.patientName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             payment.service?.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
        
        let matchesAmount = true;
        if (filterAmount === 'less1000') {
            matchesAmount = payment.amount < 1000;
        } else if (filterAmount === '1000to2000') {
            matchesAmount = payment.amount >= 1000 && payment.amount <= 2000;
        } else if (filterAmount === 'above2000') {
            matchesAmount = payment.amount > 2000;
        }
        
        return matchesSearch && matchesStatus && matchesAmount;
    });

    const exportCSV = () => {
        alert('This functionality will be connected to the backend');
    };

    return (
        <div className="finance-container">
            <div className="data2">
                <div className='title2' style={{paddingTop: "0"}}><p>Financial Overview</p></div>
                <hr id="split" />
            </div>
            
            <div className="finance-header">
                <div className="header-actions">
                    <div className="period-selector">
                        <FaCalendarAlt className="selector-icon" />
                        <select
                            value={filterPeriod}
                            onChange={(e) => setFilterPeriod(e.target.value)}
                            className="period-select"
                        >
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                            <option value="quarter">This Quarter</option>
                            <option value="year">This Year</option>
                            <option value="all">All Time</option>
                        </select>
                    </div>
                    <button className="export-btn" onClick={exportCSV}>
                        <FaFileCsv /> Export
                    </button>
                </div>
            </div>

            <div className="finance-tabs">
                <button 
                    className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                >
                    Overview
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'payments' ? 'active' : ''}`}
                    onClick={() => setActiveTab('payments')}
                >
                    Payment History
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
                    onClick={() => setActiveTab('analytics')}
                >
                    Analytics
                </button>
            </div>

            {activeTab === 'overview' && (
                <div className="finance-overview">
                    <div className="summary-cards">
                        <div className="summary-card total-earnings">
                            <div className="card-icon">
                                <FaMoneyBillWave />
                            </div>
                            <div className="card-content">
                                <h3>Total Earnings</h3>
                                {isLoading.summary ? (
                                    <div className="loading-indicator"><FaSpinner className="spinner" /></div>
                                ) : (
                                    <>
                                        <p className="amount">{summaryData.totalEarnings.toLocaleString()} EGP</p>
                                        <p className="period">{filterPeriod === 'month' ? 'This Month' : filterPeriod === 'year' ? 'This Year' : 'Selected Period'}</p>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="summary-card pending">
                            <div className="card-icon">
                                <FaFileInvoiceDollar />
                            </div>
                            <div className="card-content">
                                <h3>Pending Payments</h3>
                                {isLoading.summary ? (
                                    <div className="loading-indicator"><FaSpinner className="spinner" /></div>
                                ) : (
                                    <>
                                        <p className="amount">{summaryData.pendingPayments.toLocaleString()} EGP</p>
                                        <p className="count">Pending Invoices</p>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="summary-card completed">
                            <div className="card-icon">
                                <FaFileInvoiceDollar />
                            </div>
                            <div className="card-content">
                                <h3>Completed Payments</h3>
                                {isLoading.summary ? (
                                    <div className="loading-indicator"><FaSpinner className="spinner" /></div>
                                ) : (
                                    <>
                                        <p className="amount">{summaryData.completedPayments.toLocaleString()} EGP</p>
                                        <p className="count">Completed Transactions</p>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="summary-card average">
                            <div className="card-icon">
                                <FaChartLine />
                            </div>
                            <div className="card-content">
                                <h3>Average Per Patient</h3>
                                {isLoading.summary ? (
                                    <div className="loading-indicator"><FaSpinner className="spinner" /></div>
                                ) : (
                                    <>
                                        <p className="amount">{summaryData.averagePerPatient.toLocaleString()} EGP</p>
                                        <p className="count">{summaryData.totalPatients} Patients Total</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="recent-payments">
                        <div className="section-header">
                            <h2>Recent Payments</h2>
                            <button 
                                className="view-all-btn"
                                onClick={() => setActiveTab('payments')}
                            >
                                View All
                            </button>
                        </div>
                        <div className="table-container">
                            {isLoading.payments ? (
                                <div className="loading-table">
                                    <FaSpinner className="spinner" />
                                    <p>Loading payment data...</p>
                                </div>
                            ) : error.payments ? (
                                <div className="error-message">{error.payments}</div>
                            ) : (
                                <table className="payments-table">
                                    <thead>
                                        <tr>
                                            <th>Patient</th>
                                            <th>Service</th>
                                            <th>Date</th>
                                            <th>Amount</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paymentsData.length > 0 ? (
                                            paymentsData.slice(0, 5).map((payment, index) => (
                                                <tr key={payment.id || index}>
                                                    <td>{payment.patientName}</td>
                                                    <td>{payment.service}</td>
                                                    <td>{payment.date ? new Date(payment.date).toLocaleDateString() : 'N/A'}</td>
                                                    <td>{payment.amount ? payment.amount.toLocaleString() : 0} EGP</td>
                                                    <td>
                                                        <span className={`status-badge ${payment.status}`}>
                                                            {payment.status === 'completed' ? 'Paid' : 'Pending'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="no-results">No payment records available.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'payments' && (
                <div className="payments-history">
                    <div className="filter-section">
                        <div className="search-box">
                            <FaSearch className="search-icon" />
                            <input 
                                type="text" 
                                placeholder="Search by patient or service..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button 
                            className={`filter-btn ${showFilters ? 'active' : ''}`}
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <FaFilter /> Filters
                        </button>
                    </div>

                    {showFilters && (
                        <div className="advanced-filters">
                            <div className="filter-group">
                                <label>Payment Status:</label>
                                <select 
                                    value={filterStatus} 
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                >
                                    <option value="all">All</option>
                                    <option value="completed">Completed</option>
                                    <option value="pending">Pending</option>
                                </select>
                            </div>
                            <div className="filter-group">
                                <label>Amount Range:</label>
                                <select 
                                    value={filterAmount} 
                                    onChange={(e) => setFilterAmount(e.target.value)}
                                >
                                    <option value="all">All</option>
                                    <option value="less1000">Less than 1000 EGP</option>
                                    <option value="1000to2000">1000 - 2000 EGP</option>
                                    <option value="above2000">Above 2000 EGP</option>
                                </select>
                            </div>
                        </div>
                    )}

                    <div className="table-container">
                        {isLoading.payments ? (
                            <div className="loading-table">
                                <FaSpinner className="spinner" />
                                <p>Loading payment data...</p>
                            </div>
                        ) : error.payments ? (
                            <div className="error-message">{error.payments}</div>
                        ) : (
                            <table className="payments-table full">
                                <thead>
                                    <tr>
                                        <th>Patient</th>
                                        <th>Service</th>
                                        <th>Date</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPayments.length > 0 ? (
                                        filteredPayments.map((payment, index) => (
                                            <tr key={payment.id || index}>
                                                <td>{payment.patientName}</td>
                                                <td>{payment.service}</td>
                                                <td>{payment.date ? new Date(payment.date).toLocaleDateString() : 'N/A'}</td>
                                                <td>{payment.amount ? payment.amount.toLocaleString() : 0} EGP</td>
                                                <td>
                                                    <span className={`status-badge ${payment.status}`}>
                                                        {payment.status === 'completed' ? 'Paid' : 'Pending'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="no-results">No payments matching your filters</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'analytics' && (
                <div className="finance-analytics">
                    <div className="analytics-section">
                        <h2>Monthly Earnings</h2>
                        {isLoading.analytics ? (
                            <div className="loading-chart">
                                <FaSpinner className="spinner" />
                                <p>Loading chart data...</p>
                            </div>
                        ) : error.analytics ? (
                            <div className="error-message">{error.analytics}</div>
                        ) : (
                            <div className="chart-container">
                                <div className="bar-chart">
                                    {monthlyEarningsData.map((month, index) => (
                                        <div className="chart-column" key={index}>
                                            <div 
                                                className="bar" 
                                                style={{ 
                                                    height: month.amount ? `${(month.amount / 12000) * 100}%` : '0%' 
                                                }}
                                            >
                                                {month.amount > 0 && (
                                                    <div className="bar-tooltip">
                                                        {month.amount.toLocaleString()} EGP
                                                    </div>
                                                )}
                                            </div>
                                            <div className="month-label">{month.month}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="service-breakdown">
                        <h2>Revenue by Service</h2>
                        {isLoading.analytics ? (
                            <div className="loading-table">
                                <FaSpinner className="spinner" />
                                <p>Loading service data...</p>
                            </div>
                        ) : error.analytics ? (
                            <div className="error-message">{error.analytics}</div>
                        ) : (
                            <div className="table-container">
                                {serviceBreakdownData.length > 0 ? (
                                    <table className="service-table">
                                        <thead>
                                            <tr>
                                                <th>Service</th>
                                                <th>Patients</th>
                                                <th>Revenue</th>
                                                <th>Distribution</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {serviceBreakdownData.map((service, index) => (
                                                <tr key={index}>
                                                    <td>{service.service}</td>
                                                    <td>{service.count}</td>
                                                    <td>{service.revenue ? service.revenue.toLocaleString() : 0} EGP</td>
                                                    <td>
                                                        <div className="progress-container">
                                                            <div 
                                                                className="progress-bar" 
                                                                style={{ width: `${service.percentage || 0}%` }}
                                                            ></div>
                                                            <span className="percentage">{service.percentage || 0}%</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="no-results">No service breakdown data available</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DocFinance;