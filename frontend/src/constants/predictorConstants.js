import {
  CurrencyDollarIcon,
  GlobeAltIcon,
  TagIcon,
  ScaleIcon,
  SparklesIcon,
  ClockIcon,
  QueueListIcon,
} from "@heroicons/react/24/outline";

export const initialForm = {
  "credit.policy": 1,
  purpose: "credit_card",
  "int.rate": "",
  installment: "",
  "log.annual.inc": "",
  dti: "",
  fico: "",
  "days.with.cr.line": "",
  "revol.bal": "",
  "revol.util": "",
  "inq.last.6mths": "",
  "delinq.2yrs": "",
  "pub.rec": "",
};

export const purposeOptions = [
  "credit_card",
  "debt_consolidation",
  "educational",
  "home_improvement",
  "major_purchase",
  "small_business",
  "all_other",
];

export const labelMap = {
  "credit.policy": "Credit Policy Approval",
  purpose: "Loan Purpose",
  "int.rate": "Interest Rate (%)",
  installment: "Monthly Installment (₹)",
  "log.annual.inc": "Log of Annual Income",
  dti: "Debt to Income Ratio (%)",
  fico: "FICO Score",
  "days.with.cr.line": "Days With Credit Line",
  "revol.bal": "Revolving Balance (₹)",
  "revol.util": "Revolving Credit Utilization (%)",
  "inq.last.6mths": "Inquiries in Last 6 Months",
  "delinq.2yrs": "Delinquencies in Last 2 Years",
  "pub.rec": "Public Records",
};

export const getIconForField = (fieldName) => {
  switch (fieldName) {
    case "int.rate":
      return TagIcon;
    case "installment":
    case "revol.bal":
      return CurrencyDollarIcon;
    case "log.annual.inc":
    case "dti":
    case "revol.util":
      return ScaleIcon;
    case "fico":
      return SparklesIcon;
    case "days.with.cr.line":
      return ClockIcon;
    case "inq.last.6mths":
    case "delinq.2yrs":
    case "pub.rec":
      return QueueListIcon;
    default:
      return GlobeAltIcon; 
  }
};
