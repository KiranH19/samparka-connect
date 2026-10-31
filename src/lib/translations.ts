export type Language = 'en' | 'kn';

export interface TranslationDict {
  brandName: string;
  tagline: string;
  introHeading: string;
  mainHeadline: string;
  mainSubheadline: string;
  heroSupport: string;
  findJobsNearMe: string;
  postAJob: string;
  startingIn: string;
  locationFocus: string;
  nav: {
    home: string;
    jobs: string;
    employers: string;
    students: string;
    howItWorks: string;
    login: string;
    signup: string;
    dashboard: string;
    admin: string;
    logout: string;
  };
  filters: {
    searchPlaceholder: string;
    allCities: string;
    allLocalities: string;
    allCategories: string;
    allTypes: string;
    minSalary: string;
    maxSalary: string;
    remoteOnly: string;
    clearFilters: string;
    resultsCount: string;
    sortBy: string;
    newest: string;
    highestSalary: string;
  };
  jobTypes: {
    full_time: string;
    part_time: string;
    internship: string;
    contract: string;
    daily_wage: string;
  };
  categories: {
    retail: string;
    restaurant: string;
    manufacturing: string;
    office: string;
    logistics: string;
    healthcare: string;
    education: string;
    customer_service: string;
  };
  experienceLevels: {
    no_experience: string;
    entry: string;
    intermediate: string;
    experienced: string;
  };
  statuses: {
    applied: string;
    under_review: string;
    shortlisted: string;
    rejected: string;
    hired: string;
    verified: string;
    pending: string;
  };
  actions: {
    applyNow: string;
    saveJob: string;
    saved: string;
    share: string;
    report: string;
    viewDetails: string;
    cancel: string;
    submit: string;
    edit: string;
    delete: string;
    pause: string;
    publish: string;
    close: string;
  };
  hubliLocalities: string[];
  dharwadLocalities: string[];
}

export const translations: Record<Language, TranslationDict> = {
  en: {
    brandName: "samparka",
    tagline: "Opportunities Around You.",
    introHeading: "Introducing Samparka",
    mainHeadline: "Ready to find your next opportunity?",
    mainSubheadline: "ನಿಮ್ಮ ಮುಂದಿನ ಅವಕಾಶವನ್ನು ಹುಡುಕಲು ಸಿದ್ಧರಿದ್ದೀರಾ?",
    heroSupport: "We are building Samparka to help people discover nearby job opportunities easily.",
    findJobsNearMe: "Find Jobs Near Me",
    postAJob: "Post a Job",
    startingIn: "Starting in Hubli–Dharwad",
    locationFocus: "Hubli–Dharwad, Karnataka",
    nav: {
      home: "Home",
      jobs: "Browse Jobs",
      employers: "For Employers",
      students: "Student Jobs",
      howItWorks: "How It Works",
      login: "Sign In",
      signup: "Register",
      dashboard: "Dashboard",
      admin: "Admin",
      logout: "Log Out",
    },
    filters: {
      searchPlaceholder: "Job title, keywords, or skills...",
      allCities: "All Cities",
      allLocalities: "All Localities",
      allCategories: "All Categories",
      allTypes: "All Employment Types",
      minSalary: "Min Salary (₹)",
      maxSalary: "Max Salary (₹)",
      remoteOnly: "Remote / WFH Only",
      clearFilters: "Clear Filters",
      resultsCount: "jobs found",
      sortBy: "Sort by",
      newest: "Newest First",
      highestSalary: "Highest Salary",
    },
    jobTypes: {
      full_time: "Full-Time",
      part_time: "Part-Time",
      internship: "Internship",
      contract: "Contract",
      daily_wage: "Daily Wage",
    },
    categories: {
      retail: "Retail & Shops",
      restaurant: "Restaurants & Cafes",
      manufacturing: "Manufacturing & Industrial",
      office: "IT & Office",
      logistics: "Logistics & Delivery",
      healthcare: "Healthcare & Clinic",
      education: "Teaching & Tutoring",
      customer_service: "Customer Support & Front Desk",
    },
    experienceLevels: {
      no_experience: "No Experience Needed",
      entry: "Entry Level (0-1 yrs)",
      intermediate: "Intermediate (1-3 yrs)",
      experienced: "Experienced (3+ yrs)",
    },
    statuses: {
      applied: "Applied",
      under_review: "Under Review",
      shortlisted: "Shortlisted",
      rejected: "Not Selected",
      hired: "Hired",
      verified: "Verified Business",
      pending: "Verification Pending",
    },
    actions: {
      applyNow: "Apply Now",
      saveJob: "Save Job",
      saved: "Saved",
      share: "Share",
      report: "Report Listing",
      viewDetails: "View Details",
      cancel: "Cancel",
      submit: "Submit",
      edit: "Edit",
      delete: "Delete",
      pause: "Pause",
      publish: "Publish",
      close: "Close Position",
    },
    hubliLocalities: [
      "Chennamma Circle",
      "Vidyanagar",
      "Gokul Road",
      "Keshwapur",
      "Navanagar",
      "Old Hubli",
      "Deshpande Nagar",
      "Shirur Park",
      "Tarihal Industrial Area",
      "Unkal Lake Area",
      "Kusugal Road",
    ],
    dharwadLocalities: [
      "Line Bazar",
      "Sadhankeri",
      "Toll Naka",
      "Saptapur",
      "Kelageri",
      "Karnataka College (KCD) Area",
      "Dharwad University Campus",
      "Belgaum Road",
    ],
  },
  kn: {
    brandName: "ಸಂಪರ್ಕ",
    tagline: "ನಿಮ್ಮ ಸುತ್ತಮುತ್ತಲಿನ ಅವಕಾಶಗಳು.",
    introHeading: "ಸಂಪರ್ಕವನ್ನು ಪರಿಚಯಿಸುತ್ತಿದ್ದೇವೆ",
    mainHeadline: "ನಿಮ್ಮ ಮುಂದಿನ ಅವಕಾಶವನ್ನು ಹುಡುಕಲು ಸಿದ್ಧರಿದ್ದೀರಾ?",
    mainSubheadline: "Ready to find your next opportunity?",
    heroSupport: "ನಾವು Samparkaವನ್ನು ನಿರ್ಮಿಸುತ್ತಿದ್ದೇವೆ — ಜನರು ತಮ್ಮ ಹತ್ತಿರದ ಉದ್ಯೋಗಾವಕಾಶಗಳನ್ನು ಸುಲಭವಾಗಿ ಹುಡುಕಲು ಸಹಾಯ ಮಾಡುವ ಉದ್ದೇಶದಿಂದ.",
    findJobsNearMe: "ಹತ್ತಿರದ ಉದ್ಯೋಗಗಳನ್ನು ಹುಡುಕಿ",
    postAJob: "ಉದ್ಯೋಗ ಪ್ರಕಟಿಸಿ",
    startingIn: "ಆರಂಭ ಇಲ್ಲಿಂದಲೇ! ಹುಬ್ಬಳ್ಳಿ–ಧಾರವಾಡ",
    locationFocus: "ಹುಬ್ಬಳ್ಳಿ–ಧಾರವಾಡ, ಕರ್ನಾಟಕ",
    nav: {
      home: "ಮುಖಪುಟ",
      jobs: "ಉದ್ಯೋಗಗಳು",
      employers: "ಉದ್ಯೋಗದಾತರಿಗೆ",
      students: "ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ",
      howItWorks: "ಇದು ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ",
      login: "ಲಾಗಿನ್",
      signup: "ನೋಂದಣಿ",
      dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
      admin: "ನಿರ್ವಾಹಕರು",
      logout: "ಲಾಗ್‌ಔಟ್",
    },
    filters: {
      searchPlaceholder: "ಉದ್ಯೋಗ ಹೆಸರು, ಕೌಶಲ್ಯಗಳು...",
      allCities: "ಎಲ್ಲಾ ನಗರಗಳು",
      allLocalities: "ಎಲ್ಲಾ ಬಡಾವಣೆಗಳು",
      allCategories: "ಎಲ್ಲಾ ವಿಭಾಗಗಳು",
      allTypes: "ಎಲ್ಲಾ ಉದ್ಯೋಗ ವಿಧಗಳು",
      minSalary: "ಕನಿಷ್ಠ ವೇತನ (₹)",
      maxSalary: "ಗರಿಷ್ಠ ವೇತನ (₹)",
      remoteOnly: "ಮನೆಯಿಂದಲೇ ಕೆಲಸ",
      clearFilters: "ಫಿಲ್ಟರ್ ತೆರವುಗೊಳಿಸಿ",
      resultsCount: "ಉದ್ಯೋಗಗಳು ಲಭ್ಯ",
      sortBy: "ವಿಂಗಡಣೆ",
      newest: "ಹೊಸತು ಮೊದಲು",
      highestSalary: "ಹೆಚ್ಚು ವೇತನ",
    },
    jobTypes: {
      full_time: "ಪೂರ್ಣಾವಧಿ (Full-Time)",
      part_time: "ಅರೆಕಾಲಿಕ (Part-Time)",
      internship: "ಇಂಟರ್ನ್‌ಶಿಪ್ (Internship)",
      contract: "ಒಪ್ಪಂದ (Contract)",
      daily_wage: "ದೈನಂದಿನ ವೇತನ (Daily Wage)",
    },
    categories: {
      retail: "ಅಂಗಡಿ ಮತ್ತು ಚಿಲ್ಲರೆ ವ್ಯಾಪಾರ",
      restaurant: "ರೆಸ್ಟೋರೆಂಟ್‌ ಮತ್ತು ಕೆಫೆ",
      manufacturing: "ಉತ್ಪಾದನೆ ಮತ್ತು ಕಾರ್ಖಾನೆ",
      office: "ಐಟಿ ಮತ್ತು ಕಚೇರಿ ಕೆಲಸ",
      logistics: "ಡೆಲಿವರಿ ಮತ್ತು ಸಾಗಾಣಿಕೆ",
      healthcare: "ಆಸ್ಪತ್ರೆ ಮತ್ತು ಕ್ಲಿನಿಕ್",
      education: "ಬೋಧನೆ ಮತ್ತು ಟ್ಯೂಷನ್",
      customer_service: "ಗ್ರಾಹಕ ಸೇವೆ ಮತ್ತು ಸ್ವಾಗತಕಾರ",
    },
    experienceLevels: {
      no_experience: "ಅನುಭವದ ಅಗತ್ಯವಿಲ್ಲ",
      entry: "ಆರಂಭಿಕ ಹಂತ (0-1 ವರ್ಷ)",
      intermediate: "ಮಧ್ಯಮ ಹಂತ (1-3 ವರ್ಷ)",
      experienced: "ಅನುಭವಿ (3+ ವರ್ಷ)",
    },
    statuses: {
      applied: "ಅರ್ಜಿ ಸಲ್ಲಿಸಲಾಗಿದೆ",
      under_review: "ಪರಿಶೀಲನೆಯಲ್ಲಿದೆ",
      shortlisted: "ಆಯ್ಕೆ ಪಟ್ಟಿಯಲ್ಲಿದೆ",
      rejected: "ಆಯ್ಕೆಯಾಗಿಲ್ಲ",
      hired: "ನೇಮಕಗೊಂಡಿದೆ",
      verified: "ದೃಢೀಕೃತ ಸಂಸ್ಥೆ",
      pending: "ದೃಢೀಕರಣ ಬಾಕಿ ಇದೆ",
    },
    actions: {
      applyNow: "ಈಗಲೇ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ",
      saveJob: "ಉಳಿಸಿ",
      saved: "ಉಳಿಸಲಾಗಿದೆ",
      share: "ಹಂಚಿಕೊಳ್ಳಿ",
      report: "ವರದಿ ಮಾಡಿ",
      viewDetails: "ವಿವರ ನೋಡಿ",
      cancel: "ರದ್ದುಮಾಡಿ",
      submit: "ಸಲ್ಲಿಸಿ",
      edit: "ತಿದ್ದುಪಡಿ",
      delete: "ಅಳಿಸಿ",
      pause: "ವಿರಾಮಗೊಳಿಸಿ",
      publish: "ಪ್ರಕಟಿಸಿ",
      close: "ಮುಕ್ತಾಯಗೊಳಿಸಿ",
    },
    hubliLocalities: [
      "ಚನ್ನಮ್ಮ ವೃತ್ತ (Chennamma Circle)",
      "ವಿದ್ಯಾನಗರ (Vidyanagar)",
      "ಗೋಕುಲ ರಸ್ತೆ (Gokul Road)",
      "ಕೇಶ್ವಾಪುರ (Keshwapur)",
      "ನವನಗರ (Navanagar)",
      "ಹಳೇ ಹುಬ್ಬಳ್ಳಿ (Old Hubli)",
      "ದೇಶಪಾಂಡೆ ನಗರ (Deshpande Nagar)",
      "ಶಿರೂರ ಪಾರ್ಕ್ (Shirur Park)",
      "ತಾರಿಹಾಳ ಕೈಗಾರಿಕಾ ಪ್ರದೇಶ (Tarihal)",
      "ಉಣಕಲ್ ಕೆರೆ ಪ್ರದೇಶ (Unkal)",
      "ಕುಸುಗಲ್ ರಸ್ತೆ (Kusugal Road)",
    ],
    dharwadLocalities: [
      "ಲೈನ್ ಬಜಾರ್ (Line Bazar)",
      "ಸಾಧನಕೇರಿ (Sadhankeri)",
      "ಟೋಲ್ ನಾಕಾ (Toll Naka)",
      "ಸಪ್ತಾಪುರ (Saptapur)",
      "ಕೇಳಗೇರಿ (Kelageri)",
      "ಕರ್ನಾಟಕ ಕಾಲೇಜು (KCD Area)",
      "ಧಾರವಾಡ ವಿವಿ ಆವರಣ (University)",
      "ಬೆಳಗಾವಿ ರಸ್ತೆ (Belgaum Road)",
    ],
  },
};
