import React, { useState } from 'react';
import { reportService } from '../../services/reportService';
import { useToast } from '../../context/ToastContext';
import { 
  BarChart, Bar, AreaChart, Area, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { 
  BarChart3, 
  Download, 
  Printer, 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  Users, 
  HeartHandshake, 
  ShieldCheck,
  FileSpreadsheet
} from 'lucide-react';
import { MONTHLY_ANALYTICS_DATA, CATEGORY_DISTRIBUTION } from '../../data/mockData';

export const ReportsAnalytics = () => {
  const [timeframe, setTimeframe] = useState('year');
  const { showToast } = useToast();
  const summary = reportService.getReportSummary(timeframe);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const success = reportService.exportToCSV(MONTHLY_ANALYTICS_DATA, `Monthly_Humanitarian_Report_${new Date().toISOString().split('T')[0]}.csv`);
    if (success) {
      showToast('Report Exported', 'Monthly metrics exported to CSV.', 'success');
    }
  };

  const handleDownloadPDF = () => {
    showToast('Report Compiled', 'Executive PDF summary generated for board presentation.', 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }} className="no-print">
        <div>
          <h1 style={{ fontSize: '1.85rem', color: 'var(--navy)' }}>Audit Reports & Performance Analytics</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Comprehensive financial transparency, monthly trends, and volunteer impact intelligence.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="form-control"
            style={{ width: 'auto', padding: '0.55rem 0.85rem', fontSize: '0.85rem' }}
          >
            <option value="month">Last 30 Days</option>
            <option value="quarter">Last 6 Months</option>
            <option value="year">Fiscal Year 2026</option>
            <option value="all">All-Time Inception</option>
          </select>

          <button onClick={handleExportCSV} className="btn btn-sm btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <FileSpreadsheet size={15} /> Export CSV
          </button>
          <button onClick={handlePrint} className="btn btn-sm btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Printer size={15} /> Print Report
          </button>
        </div>
      </div>

      {/* Printable Report Header for Official Export */}
      <div style={{ display: 'none' }} className="printable-receipt">
        <h2>GiveHope Humanitarian Welfare Trust - Annual Audit Report</h2>
        <p>Govt Reg: PB/2021/9842 | Generated Date: {new Date().toLocaleDateString()}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Revenue Logged</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--primary)', marginTop: '0.2rem' }}>
            Rs. {summary.totalDonationsAmount.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>100% verified tax-exempt receipts</div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Program Efficiency</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#059669', marginTop: '0.2rem' }}>
            91.4%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Direct on-ground aid ratio</div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Volunteer Hours Logged</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--accent)', marginTop: '0.2rem' }}>
            {summary.totalVolunteerHours} Hours
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>By {summary.approvedVolunteers} active field volunteers</div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Campaign Target Rate</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--navy)', marginTop: '0.2rem' }}>
            {summary.fundraisingEfficiency}%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Of total allocated goal targets</div>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-2 gap-8">
        {/* Monthly Collections vs Target */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--navy)' }}>Monthly Inflow vs Budget Targets</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Financial progress per month (in PKR)</p>
            </div>
          </div>

          <div style={{ width: '100%', height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_ANALYTICS_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
                <YAxis stroke="#94A3B8" fontSize={12} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip
                  formatter={(value) => [`Rs. ${Number(value).toLocaleString()}`, 'Amount']}
                  contentStyle={{ backgroundColor: '#0F172A', color: '#FFF', borderRadius: '8px' }}
                />
                <Legend />
                <Bar dataKey="donations" name="Actual Raised" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="target" name="Monthly Target" fill="#CBD5E1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Volunteer & Donor Growth */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--navy)' }}>Community & Volunteer Growth</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Active network expansion month-over-month</p>
            </div>
          </div>

          <div style={{ width: '100%', height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MONTHLY_ANALYTICS_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
                <YAxis stroke="#94A3B8" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', color: '#FFF', borderRadius: '8px' }} />
                <Legend />
                <Line type="monotone" dataKey="donors" name="Active Donors" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="volunteers" name="Field Volunteers" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Audited Financial Statement Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--navy)' }}>Audited Financial Statements Summary</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Verified against bank merchant ledgers and procurement records</p>
          </div>
          <span className="badge badge-success">Audit Passed</span>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Reporting Period</th>
                <th>Donation Revenue (PKR)</th>
                <th>Target Goal (PKR)</th>
                <th>Variance</th>
                <th>New Donors</th>
                <th>Volunteer Recruits</th>
                <th>Verification Status</th>
              </tr>
            </thead>
            <tbody>
              {MONTHLY_ANALYTICS_DATA.map((row) => {
                const variance = row.donations - row.target;
                const isPositive = variance >= 0;
                return (
                  <tr key={row.month}>
                    <td><strong>{row.month} 2026</strong></td>
                    <td style={{ fontWeight: '700', color: 'var(--navy)' }}>Rs. {row.donations.toLocaleString()}</td>
                    <td>Rs. {row.target.toLocaleString()}</td>
                    <td style={{ fontWeight: '700', color: isPositive ? 'var(--status-success)' : 'var(--status-danger)' }}>
                      {isPositive ? '+' : ''}Rs. {variance.toLocaleString()}
                    </td>
                    <td>+{row.donors}</td>
                    <td>+{row.volunteers}</td>
                    <td><span className="badge badge-success">Audited & Reconciled</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
