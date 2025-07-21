import {
  CurrencyDollarIcon,
  BanknotesIcon,
  CreditCardIcon,
  CalendarDaysIcon,
  ShieldCheckIcon,
  ScaleIcon,
  ChartBarSquareIcon,
  ClockIcon,
  ArrowPathIcon,
  DocumentMagnifyingGlassIcon,
  NewspaperIcon,
  TagIcon,
  GlobeAltIcon, 
} from "@heroicons/react/24/outline";



// Initial form state for the prediction inputs
export const initialForm = {
  "credit.policy": null, 
  purpose: "",
  "int.rate": null,
  installment: null,
  "log.annual.inc": null,
  dti: null,
  fico: null,
  "days.with.cr.line": null,
  "revol.bal": null,
  "revol.util": null,
  "inq.last.6mths": null,
  "delinq.2yrs": null,
  "pub.rec": null,
};

// Map form field names to user-friendly labels
export const labelMap = {
  "credit.policy": "Credit Policy (Borrower meets underwriting criteria)",
  purpose: "Purpose of the Loan",
  "int.rate": "Interest Rate (%)",
  installment: "Installment",
  "log.annual.inc": "Log of Annual Income",
  dti: "Debt-to-Income Ratio",
  fico: "FICO Score",
  "days.with.cr.line": "Days with Credit Line",
  "revol.bal": "Revolving Balance",
  "revol.util": "Revolving Line Utilization Rate",
  "inq.last.6mths": "Inquiries in Last 6 Months",
  "delinq.2yrs": "Delinquencies in Last 2 Years",
  "pub.rec": "Public Record Bankruptcies",
};

// Options for the 'purpose' dropdown
export const purposeOptions = [
  "credit_card",
  "debt_consolidation",
  "educational",
  "home_improvement",
  "major_purchase",
  "small_business",
  "all_other",
];

// NEW: Options for the 'credit.policy' dropdown
export const creditPolicyOptions = [
  { label: "Meets the policy", value: 1 },
  { label: "Does not meet the policy", value: 0 },
];


// Function to get appropriate icon for each field
export const getIconForField = (fieldName) => {
  switch (fieldName) {
    case "credit.policy":
      return ShieldCheckIcon;
    case "int.rate":
      return TagIcon;
    case "installment":
      return BanknotesIcon;
    case "log.annual.inc":
      return CurrencyDollarIcon;
    case "dti":
      return ScaleIcon;
    case "fico":
      return CreditCardIcon;
    case "days.with.cr.line":
      return CalendarDaysIcon;
    case "revol.bal":
      return ChartBarSquareIcon;
    case "revol.util":
      return ArrowPathIcon;
    case "inq.last.6mths":
      return DocumentMagnifyingGlassIcon;
    case "delinq.2yrs":
      return ClockIcon;
    case "pub.rec":
      return NewspaperIcon;
    default:
      return GlobeAltIcon; // Default icon
  }
};