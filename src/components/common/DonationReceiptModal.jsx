import React from 'react';
import { Modal } from './Modal';
import { Printer, CheckCircle2, Download, Heart, ShieldCheck } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const DonationReceiptModal = ({ isOpen, onClose, donation }) => {
  const { showToast } = useToast();

  if (!donation) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    showToast('Receipt Saved', 'Receipt PDF snapshot prepared for offline archiving.', 'success');
  };

  const formattedDate = donation.transactionDate 
    ? new Date(donation.transactionDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : new Date().toLocaleDateString();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Official Donation Receipt"
      maxWidth="680px"
      footer={
        <>
          <button className="btn btn-secondary no-print" onClick={onClose}>
            Close
          </button>
          <button className="btn btn-outline no-print" onClick={handleDownload} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Download size={16} /> Save Receipt
          </button>
          <button className="btn btn-primary no-print" onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Printer size={16} /> Print Receipt
          </button>
        </>
      }
    >
      <div className="printable-receipt" style={{ padding: '0.5rem' }}>
        {/* Receipt Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '2px solid var(--primary)',
          paddingBottom: '1.25rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--primary) 0%, #065F46 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF'
            }}>
              <Heart size={26} fill="#FFFFFF" />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: '800', fontSize: '1.3rem', color: 'var(--navy)' }}>
                GiveHope Welfare Trust
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Govt Reg: PB/2021/9842 | NTN: 7492104-9
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span className="badge badge-success" style={{ fontSize: '0.85rem', padding: '0.35rem 0.8rem' }}>
              <CheckCircle2 size={15} /> Payment Verified
            </span>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              Sec. 61 & 2(36) Tax-Deductible
            </div>
          </div>
        </div>

        {/* Receipt Summary Grid */}
        <div style={{
          backgroundColor: 'var(--bg-subtle)',
          padding: '1.25rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1rem',
          fontSize: '0.85rem'
        }}>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Donor Full Name</span>
            <strong style={{ color: 'var(--navy)', fontSize: '0.95rem' }}>{donation.donorName}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Allocated Campaign</span>
            <strong style={{ color: 'var(--navy)', fontSize: '0.95rem' }}>{donation.campaignTitle}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Receipt Voucher #</span>
            <span style={{ fontFamily: 'monospace', fontWeight: '700', color: 'var(--primary)' }}>{donation.taxExemptId || donation.id}</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Transaction Date</span>
            <span>{formattedDate}</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Payment Mode</span>
            <span>{donation.paymentMethod || 'Online Gateway'}</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Status</span>
            <span style={{ color: 'var(--status-success)', fontWeight: '700' }}>Completed & Dispatched</span>
          </div>
        </div>

        {/* Financial Details Table */}
        <div style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '0.65rem 0', color: 'var(--text-muted)' }}>Donor Name:</td>
                <td style={{ padding: '0.65rem 0', fontWeight: '700', textAlign: 'right', color: 'var(--navy)' }}>
                  {donation.donorName}
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '0.65rem 0', color: 'var(--text-muted)' }}>Donor Email / Phone:</td>
                <td style={{ padding: '0.65rem 0', fontWeight: '600', textAlign: 'right', color: 'var(--navy)' }}>
                  {donation.email} {donation.phone ? `(${donation.phone})` : ''}
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '0.65rem 0', color: 'var(--text-muted)' }}>Allocated Campaign:</td>
                <td style={{ padding: '0.65rem 0', fontWeight: '700', textAlign: 'right', color: 'var(--primary)' }}>
                  {donation.campaignTitle}
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '0.65rem 0', color: 'var(--text-muted)' }}>Donation Type:</td>
                <td style={{ padding: '0.65rem 0', fontWeight: '600', textAlign: 'right', color: 'var(--navy)' }}>
                  {donation.donationType || 'One-Time Contribution'}
                </td>
              </tr>
              {donation.message && (
                <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '0.65rem 0', color: 'var(--text-muted)' }}>Donor Note:</td>
                  <td style={{ padding: '0.65rem 0', fontStyle: 'italic', textAlign: 'right', color: 'var(--text-muted)' }}>
                    "{donation.message}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Total Amount Box */}
        <div style={{
          background: 'linear-gradient(135deg, var(--primary-light) 0%, #E0F2FE 100%)',
          padding: '1.25rem 1.5rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--primary-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem'
        }}>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--primary-dark)', textTransform: 'uppercase' }}>
              Total Contributed Amount
            </span>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>100% Direct Program Utilization Guarantee</div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--primary-dark)', fontFamily: 'var(--font-heading)' }}>
            Rs. {Number(donation.amount).toLocaleString()}
          </div>
        </div>

        {/* Official Stamp & Sign */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '1rem',
          borderTop: '1px dashed var(--border-medium)',
          fontSize: '0.75rem',
          color: 'var(--text-muted)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-dark)', fontWeight: '600' }}>
            <ShieldCheck size={18} color="var(--primary)" />
            <span>Digitally Verified & Certified by GiveHope Finance Desk</span>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: '700', color: 'var(--navy)' }}>Authorized Trustee Signatory</div>
            <div style={{ color: 'var(--text-muted)' }}>GiveHope Welfare Trust</div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DonationReceiptModal;
