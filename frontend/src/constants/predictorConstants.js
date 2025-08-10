import {
  CurrencyDollarIcon,
  ScaleIcon,
  ClockIcon,
  BanknotesIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  BuildingLibraryIcon,
  MagnifyingGlassIcon,
  ReceiptPercentIcon,
  ClipboardDocumentListIcon,
  ShieldCheckIcon,
  TagIcon,
  GlobeAltIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";

// Initial form state for the predictor
export const initialForm = {
  "credit.policy": 1,
  purpose: "credit_card",
  "int.rate": "",
  installment: "",
  "log.annual.inc": "",
  dti: "",
  credit_score_type: "fico",
  fico: "",
  "days.with.cr.line": "",
  "revol.bal": "",
  "revol.util": "",
  "inq.last.6mths": "",
  "delinq.2yrs": "",
  "pub.rec": "",
};

// Options for the loan purpose dropdown
export const purposeOptions = [
  "credit_card",
  "debt_consolidation",
  "educational",
  "home_improvement",
  "major_purchase",
  "small_business",
  "all_other",
];

// Options for credit policy approval (for the selector)
export const creditPolicyOptions = [
  { value: 1, label: "Meets Credit Policy" },
  { value: 0, label: "Does Not Meet Policy" },
];

// New options for credit score types
export const creditScoreOptions = [
  { value: "fico", label: "FICO" },
  { value: "cibil", label: "CIBIL" },
];

// Mapping of form field names to user-friendly labels
export const labelMap = {
  "credit.policy": "CREDIT POLICY APPROVAL",
  purpose: "LOAN PURPOSE",
  "int.rate": "INTEREST RATE (%)",
  installment: "MONTHLY INSTALLMENT (₹)",
  "log.annual.inc": "LOG OF ANNUAL INCOME",
  dti: "DEBT TO INCOME RATIO (%)",
  credit_score_type: "CREDIT SCORE TYPE",
  fico: "CREDIT SCORE", // Now a generic label
  "days.with.cr.line": "DAYS WITH CREDIT LINE",
  "revol.bal": "REVOLVING BALANCE (₹)",
  "revol.util": "REVOLVING CREDIT UTILIZATION (%)",
  "inq.last.6mths": "INQUIRIES IN LAST 6 MONTHS",
  "delinq.2yrs": "DELINQUENCIES IN LAST 2 YEARS",
  "pub.rec": "PUBLIC RECORDS",
};

// Function to get the appropriate Heroicon component for each input field
export const getIconForField = (fieldName) => {
  switch (fieldName) {
    case "credit.policy":
      return ShieldCheckIcon;
    case "purpose":
      return TagIcon;
    case "int.rate":
      return ReceiptPercentIcon;
    case "installment":
      return CurrencyDollarIcon;
    case "log.annual.inc":
      return BanknotesIcon;
    case "dti":
      return ScaleIcon;
    case "credit_score_type":
      return TrophyIcon;
    case "fico":
      return ChartBarIcon;
    case "days.with.cr.line":
      return CalendarDaysIcon;
    case "revol.bal":
      return GlobeAltIcon;
    case "revol.util":
      return ClockIcon;
    case "inq.last.6mths":
      return MagnifyingGlassIcon;
    case "delinq.2yrs":
      return ClipboardDocumentListIcon;
    case "pub.rec":
      return BuildingLibraryIcon
    default:
      return null;
  }
};
