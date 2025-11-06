/**
 * Calculate start date based on period string
 */
export function getPeriodStartDate(period: string): Date | undefined {
  const now = new Date();
  
  switch (period) {
    case 'this_month': {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      return start;
    }
    case 'last_month': {
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return lastMonth;
    }
    case 'last_3_months':
      return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    case 'last_6_months':
      return new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
    case 'last_12_months':
      return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    case 'week':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case 'month':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    case 'quarter':
      return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    case 'all':
    default:
      return undefined;
  }
}

export function getPeriodLabel(period: string): string {
  switch (period) {
    case 'this_month':
      return 'This Month';
    case 'last_month':
      return 'Last Month';
    case 'last_3_months':
      return 'Last 3 Months';
    case 'last_6_months':
      return 'Last 6 Months';
    case 'last_12_months':
      return 'Last 12 Months';
    case 'week':
      return 'Last Week';
    case 'month':
      return 'Last Month';
    case 'quarter':
      return 'Last Quarter';
    case 'all':
      return 'All Time';
    default:
      return 'All Time';
  }
}




