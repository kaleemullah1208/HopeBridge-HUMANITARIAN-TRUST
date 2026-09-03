import { donationService } from './donationService';
import { volunteerService } from './volunteerService';
import { campaignService } from './campaignService';
import { donorService } from './donorService';
import { MONTHLY_ANALYTICS_DATA, CATEGORY_DISTRIBUTION } from '../data/mockData';

export const reportService = {
  // Get aggregated report metrics
  getReportSummary: (timeframe = 'all') => {
    const donationStats = donationService.getDonationStats();
    const volunteerStats = volunteerService.getVolunteerStats();
    const campaigns = campaignService.getCampaigns();
    const donors = donorService.getDonors();

    const activeCampaigns = campaigns.filter((c) => c.status === 'Active').length;
    const completedCampaigns = campaigns.filter((c) => c.status === 'Completed').length;
    const totalGoal = campaigns.reduce((acc, c) => acc + (c.goalAmount || 0), 0);
    const totalCampaignsRaised = campaigns.reduce((acc, c) => acc + (c.raisedAmount || 0), 0);

    return {
      totalDonationsAmount: donationStats.totalRaised,
      totalDonationsCount: donationStats.totalCount,
      averageDonation: donationStats.averageDonation,
      totalVolunteers: volunteerStats.total,
      approvedVolunteers: volunteerStats.approved,
      pendingVolunteers: volunteerStats.pending,
      totalVolunteerHours: volunteerStats.totalHours,
      totalDonorsCount: donors.length,
      activeCampaigns,
      completedCampaigns,
      totalGoal,
      totalCampaignsRaised,
      fundraisingEfficiency: totalGoal > 0 ? Math.round((totalCampaignsRaised / totalGoal) * 100) : 0,
      monthlyTrends: MONTHLY_ANALYTICS_DATA,
      categoryDistribution: CATEGORY_DISTRIBUTION
    };
  },

  // Export array of data to CSV file download
  exportToCSV: (data, filename = 'report.csv') => {
    if (!data || !data.length) return false;

    const headers = Object.keys(data[0]);
    const csvRows = [];
    csvRows.push(headers.join(','));

    for (const row of data) {
      const values = headers.map((header) => {
        const val = row[header];
        if (val === null || val === undefined) return '""';
        const escaped = ('' + val).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  }
};
