// Initial Mock Data for GiveHope NGO Management System

export const INITIAL_CAMPAIGNS = [
  {
    id: "camp-001",
    title: "Flood Relief & Emergency Food Packages",
    category: "Disaster Relief",
    image: "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=1000&q=80",
    description: "Providing urgent dry ration packages, clean drinking water kits, waterproof tents, and emergency medical supplies to over 3,500 displaced families affected by torrential monsoon flooding.",
    longDescription: `Catastrophic seasonal floods have displaced thousands of vulnerable families, washing away homes, livestock, and clean water supplies. Our emergency field units are operating 24/7 in the hardest-hit rural districts.
    
    Each emergency survival kit includes:
    • 30 days of high-nutrition dry food rations (flour, rice, lentils, cooking oil, milk powder)
    • Water purification tablets & 20L Jerry cans
    • Waterproof family tents & mosquito nets
    • Essential first-aid and hygiene kits for mothers and infants.
    
    100% of your contribution directly funds procurement and ground distribution. Join hands to bring hope to flood survivors.`,
    goalAmount: 1500000,
    raisedAmount: 1185000,
    donorsCount: 234,
    status: "Active",
    isUrgent: true,
    startDate: "2026-07-15",
    endDate: "2026-10-31",
    location: "Sindh & Balochistan Flood Plains",
    beneficiariesCount: 14000,
    featured: true,
    breakdown: [
      { label: "Emergency Food Packs", percentage: 45 },
      { label: "Shelter & Tents", percentage: 25 },
      { label: "Clean Water & Sanitation", percentage: 18 },
      { label: "Ground Logistics & Transport", percentage: 12 }
    ]
  },
  {
    id: "camp-002",
    title: "Education for Underprivileged Children",
    category: "Education",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80",
    description: "Sponsoring school fees, uniforms, digital learning tablets, and daily nutritious midday meals for 500 street children and orphan students in slum community schools.",
    longDescription: `Education is the only lasting bridge out of systemic poverty. In underserved suburban settlements, thousands of bright children are forced to drop out due to lack of books, school fees, and basic nutrition.

    Through this flagship initiative, GiveHope operates 6 community learning centers and sponsors full annual tuition, textbooks, digital learning labs, certified teachers' stipends, and healthy warm lunches for 500 children.
    
    Your monthly sponsorship of Rs. 2,500 ensures a child stays in school for a full academic year.`,
    goalAmount: 850000,
    raisedAmount: 642000,
    donorsCount: 168,
    status: "Active",
    isUrgent: false,
    startDate: "2026-05-01",
    endDate: "2026-12-31",
    location: "Urban Slum Settlements & Community Centers",
    beneficiariesCount: 500,
    featured: true,
    breakdown: [
      { label: "Tuition & Teacher Stipends", percentage: 40 },
      { label: "Books, Uniforms & Bags", percentage: 30 },
      { label: "Nutritious Midday Meals", percentage: 20 },
      { label: "Classroom Maintenance", percentage: 10 }
    ]
  },
  {
    id: "camp-003",
    title: "Mobile Health Clinics & Medical Aid",
    category: "Healthcare",
    image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1000&q=80",
    description: "Deploying fully equipped mobile medical vans, free diagnostic lab tests, prescription drugs, and maternal care consultations to remote villages lacking hospitals.",
    longDescription: `Remote rural communities often live over 50 kilometers away from the nearest secondary healthcare facility. Preventable ailments like pneumonia, gastroenteritis, hypertension, and maternal complications frequently turn fatal.

    Our fleet of 3 customized mobile medical vans conducts bi-weekly free clinics with licensed doctors, female gynecologists, and pediatricians. Patients receive free consultations, ultrasound screenings, sugar/HB tests, and essential pharmaceuticals at zero cost.`,
    goalAmount: 1200000,
    raisedAmount: 935000,
    donorsCount: 195,
    status: "Active",
    isUrgent: true,
    startDate: "2026-03-10",
    endDate: "2026-11-30",
    location: "Remote District Villages & Tribal Areas",
    beneficiariesCount: 8200,
    featured: true,
    breakdown: [
      { label: "Prescription Medicines", percentage: 50 },
      { label: "Diagnostic Equipment & Tests", percentage: 25 },
      { label: "Mobile Van Fuel & Upkeep", percentage: 15 },
      { label: "Doctor & Nurse Honorariums", percentage: 10 }
    ]
  },
  {
    id: "camp-004",
    title: "Winter Clothes & Blanket Distribution",
    category: "Seasonal Relief",
    image: "https://images.unsplash.com/photo-1578357078586-491adf1aa5ba?auto=format&fit=crop&w=1000&q=80",
    description: "Distributing warm jackets, thermal innerwear, wool blankets, and socks to homeless individuals and mountain village families facing sub-zero temperatures.",
    longDescription: `When winter temperatures plummet below freezing in northern mountain regions, cold waves claim vulnerable elderly lives and infants. 
    
    GiveHope's annual Winter Warmth Drive delivers comprehensive warmth packages containing high-density wool blankets, thermal socks, heavy fleece jackets, woolen caps, and insulated footwear directly to mountain villages and urban pavement dwellers.`,
    goalAmount: 600000,
    raisedAmount: 580000,
    donorsCount: 142,
    status: "Active",
    isUrgent: false,
    startDate: "2026-08-01",
    endDate: "2026-12-15",
    location: "Northern Mountain Valleys & Homeless Shelters",
    beneficiariesCount: 3200,
    featured: false,
    breakdown: [
      { label: "Heavy Woolen Blankets", percentage: 40 },
      { label: "Insulated Jackets & Sweaters", percentage: 35 },
      { label: "Thermal Caps, Gloves & Socks", percentage: 15 },
      { label: "Distribution Logistics", percentage: 10 }
    ]
  },
  {
    id: "camp-005",
    title: "Clean Drinking Water Solar Wells",
    category: "Infrastructure",
    image: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1000&q=80",
    description: "Installing sustainable solar-powered deep water filtration borewells in drought-stricken desert villages where women walk miles for contaminated water.",
    longDescription: `Waterborne diseases account for over 40% of childhood hospitalizations in arid rural belts. Women and young girls walk an average of 4 to 6 hours each day carrying heavy earthen pots of saline, unsafe water.

    We install solar-powered community deep-bore water filtration plants that pump clean, sweet, mineral-filtered drinking water directly into central village distribution taps at the rate of 10,000 liters per day per well, powering self-sustaining local water committees.`,
    goalAmount: 2000000,
    raisedAmount: 1720000,
    donorsCount: 310,
    status: "Active",
    isUrgent: false,
    startDate: "2026-01-15",
    endDate: "2026-12-31",
    location: "Tharparkar & Cholistan Arid Regions",
    beneficiariesCount: 18000,
    featured: false,
    breakdown: [
      { label: "Deep Drilling & Solar Pumps", percentage: 55 },
      { label: "RO Filtration Modules", percentage: 25 },
      { label: "Storage Tanks & Piping", percentage: 12 },
      { label: "Community Training & Maintenance", percentage: 8 }
    ]
  },
  {
    id: "camp-006",
    title: "Zero-Hunger Daily Community Dastarkhwan",
    category: "Food Security",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1000&q=80",
    description: "Serving over 800 freshly cooked, hygienic, dignified meals every day to daily wage laborers, hospital attendants, and homeless persons.",
    longDescription: `With rising inflation, daily-wage laborers, rickshaw drivers, and patient attendants outside public hospitals struggle to afford even one square meal a day.
    
    GiveHope operates 3 hygienic community kitchens (Dastarkhwans) serving hot, nutritious lunch and dinner meals (chicken biryani, mutton lentils, fresh roti, yogurt, and clean water) with dignity and respect to anyone who walks in.`,
    goalAmount: 900000,
    raisedAmount: 900000,
    donorsCount: 220,
    status: "Completed",
    isUrgent: false,
    startDate: "2026-01-01",
    endDate: "2026-06-30",
    location: "Central General Hospitals & Labor Hubs",
    beneficiariesCount: 24000,
    featured: false,
    breakdown: [
      { label: "Raw Grocery & Meat Supplies", percentage: 65 },
      { label: "Kitchen Fuel & Cooking Team", percentage: 20 },
      { label: "Eco-friendly Packaging & Cleanliness", percentage: 10 },
      { label: "Distribution Van", percentage: 5 }
    ]
  }
];

export const INITIAL_DONATIONS = [
  {
    id: "DON-2026-8801",
    donorName: "Dr. Tariq Mansoor",
    email: "tariq.mansoor@hospital.org",
    phone: "+92 300 8241991",
    amount: 50000,
    currency: "PKR",
    campaignId: "camp-003",
    campaignTitle: "Mobile Health Clinics & Medical Aid",
    donationType: "One-Time",
    paymentMethod: "Bank Transfer",
    status: "Completed",
    transactionDate: "2026-09-02T10:30:00Z",
    anonymous: false,
    message: "May this help bring relief to those in remote areas. Keep up the noble work!",
    taxExemptId: "TX-GH-99120"
  },
  {
    id: "DON-2026-8802",
    donorName: "Amina Al-Sayed",
    email: "amina.sayed@globaltech.com",
    phone: "+92 321 4458912",
    amount: 25000,
    currency: "PKR",
    campaignId: "camp-001",
    campaignTitle: "Flood Relief & Emergency Food Packages",
    donationType: "Monthly",
    paymentMethod: "Debit Card",
    status: "Completed",
    transactionDate: "2026-09-01T15:14:00Z",
    anonymous: false,
    message: "Monthly contribution for flood relief emergency food packages.",
    taxExemptId: "TX-GH-99121"
  },
  {
    id: "DON-2026-8803",
    donorName: "Muhammad Farooq Khan",
    email: "mfkhan.realestate@gmail.com",
    phone: "+92 333 5129988",
    amount: 100000,
    currency: "PKR",
    campaignId: "camp-005",
    campaignTitle: "Clean Drinking Water Solar Wells",
    donationType: "One-Time",
    paymentMethod: "JazzCash",
    status: "Completed",
    transactionDate: "2026-08-30T11:20:00Z",
    anonymous: false,
    message: "In memory of my late parents for continuous charity (Sadaqah Jariyah).",
    taxExemptId: "TX-GH-99122"
  },
  {
    id: "DON-2026-8804",
    donorName: "Anonymous Donor",
    email: "anonymous.supporter@yahoo.com",
    phone: "+92 301 0000000",
    amount: 10000,
    currency: "PKR",
    campaignId: "camp-002",
    campaignTitle: "Education for Underprivileged Children",
    donationType: "One-Time",
    paymentMethod: "EasyPaisa",
    status: "Completed",
    transactionDate: "2026-08-29T18:45:00Z",
    anonymous: true,
    message: "For books and school bags for the little ones.",
    taxExemptId: "TX-GH-99123"
  },
  {
    id: "DON-2026-8805",
    donorName: "Fatima Zahra",
    email: "fatima.zahra.design@gmail.com",
    phone: "+92 345 8823190",
    amount: 5000,
    currency: "PKR",
    campaignId: "camp-004",
    campaignTitle: "Winter Clothes & Blanket Distribution",
    donationType: "One-Time",
    paymentMethod: "Credit Card",
    status: "Completed",
    transactionDate: "2026-08-28T09:15:00Z",
    anonymous: false,
    message: "Stay warm this winter!",
    taxExemptId: "TX-GH-99124"
  },
  {
    id: "DON-2026-8806",
    donorName: "Shahid Bilal",
    email: "sbilal.corp@gmail.com",
    phone: "+92 312 9901234",
    amount: 15000,
    currency: "PKR",
    campaignId: "camp-001",
    campaignTitle: "Flood Relief & Emergency Food Packages",
    donationType: "One-Time",
    paymentMethod: "JazzCash",
    status: "Pending",
    transactionDate: "2026-08-27T16:00:00Z",
    anonymous: false,
    message: "Awaiting payment verification on merchant portal.",
    taxExemptId: "TX-GH-99125"
  },
  {
    id: "DON-2026-8807",
    donorName: "Zainab Rasheed",
    email: "zainab.rasheed@edu.pk",
    phone: "+92 334 1239876",
    amount: 8000,
    currency: "PKR",
    campaignId: "camp-002",
    campaignTitle: "Education for Underprivileged Children",
    donationType: "Monthly",
    paymentMethod: "EasyPaisa",
    status: "Completed",
    transactionDate: "2026-08-25T14:10:00Z",
    anonymous: false,
    message: "Sponsoring 3 kids education.",
    taxExemptId: "TX-GH-99126"
  },
  {
    id: "DON-2026-8808",
    donorName: "Kamran Siddiqui",
    email: "ksiddiqui@fmcg.com",
    phone: "+92 300 7711223",
    amount: 20000,
    currency: "PKR",
    campaignId: "camp-003",
    campaignTitle: "Mobile Health Clinics & Medical Aid",
    donationType: "One-Time",
    paymentMethod: "Bank Transfer",
    status: "Completed",
    transactionDate: "2026-08-24T11:00:00Z",
    anonymous: false,
    message: "For essential medicines and lab tests.",
    taxExemptId: "TX-GH-99127"
  },
  {
    id: "DON-2026-8809",
    donorName: "Hamza Rehman",
    email: "hamza.r@outlook.com",
    phone: "+92 322 8844331",
    amount: 3000,
    currency: "PKR",
    campaignId: "camp-004",
    campaignTitle: "Winter Clothes & Blanket Distribution",
    donationType: "One-Time",
    paymentMethod: "Credit Card",
    status: "Failed",
    transactionDate: "2026-08-22T20:30:00Z",
    anonymous: false,
    message: "Transaction declined by issuing bank (insufficient balance).",
    taxExemptId: "TX-GH-99128"
  },
  {
    id: "DON-2026-8810",
    donorName: "Syeda Maryam",
    email: "maryam.syeda@lawfirm.com",
    phone: "+92 308 5544332",
    amount: 35000,
    currency: "PKR",
    campaignId: "camp-006",
    campaignTitle: "Zero-Hunger Daily Community Dastarkhwan",
    donationType: "One-Time",
    paymentMethod: "Bank Transfer",
    status: "Completed",
    transactionDate: "2026-08-20T12:00:00Z",
    anonymous: false,
    message: "Feeding daily wage workers for 2 weeks.",
    taxExemptId: "TX-GH-99129"
  }
];

export const INITIAL_VOLUNTEERS = [
  {
    id: "VOL-101",
    name: "Dr. Ayesha Malik",
    email: "ayesha.malik@mediclinic.org",
    phone: "+92 300 4422991",
    address: "Gulberg III, Lahore",
    skills: ["Medical & First Aid", "Public Health", "Emergency Triage", "Counseling"],
    areaOfInterest: "Medical & Health Camps",
    availability: "Weekends & Emergency Callouts",
    experience: "5 years experience as senior medical officer at Jinnah Hospital. Led 4 previous rural flood relief medical camps.",
    status: "Approved",
    appliedDate: "2026-08-15",
    approvedDate: "2026-08-16",
    assignedCampaign: "camp-003",
    hoursContributed: 48,
    message: "Eager to provide voluntary clinical support in remote health camps and maternal awareness drives."
  },
  {
    id: "VOL-102",
    name: "Bilal Ahmed",
    email: "bilal.ahmed.eng@gmail.com",
    phone: "+92 333 9102834",
    address: "F-10/2, Islamabad",
    skills: ["Logistics & Warehousing", "Supply Chain", "Driving (4x4)", "Inventory Management"],
    areaOfInterest: "Disaster Relief Operations",
    availability: "Full-Time (On Call)",
    experience: "3 years supply chain coordinator at Red Crescent. Experience managing ration packing lines and field convoy navigation.",
    status: "Approved",
    appliedDate: "2026-08-18",
    approvedDate: "2026-08-19",
    assignedCampaign: "camp-001",
    hoursContributed: 72,
    message: "I have my own 4x4 pickup and can assist directly in transporting dry rations to cut-off flood zones."
  },
  {
    id: "VOL-103",
    name: "Sara Qureshi",
    email: "sara.qureshi.edu@gmail.com",
    phone: "+92 321 8899001",
    address: "DHA Phase 5, Karachi",
    skills: ["Teaching & Tutoring", "Curriculum Design", "Art & Craft", "Child Psychology"],
    areaOfInterest: "Child Education & Mentorship",
    availability: "Weekdays (3:00 PM - 7:00 PM)",
    experience: "Primary school teacher with 4 years teaching experience. Certified in early childhood development.",
    status: "Approved",
    appliedDate: "2026-08-20",
    approvedDate: "2026-08-21",
    assignedCampaign: "camp-002",
    hoursContributed: 36,
    message: "Excited to teach mathematics, english, and art therapy to underprivileged children at GiveHope learning centers."
  },
  {
    id: "VOL-104",
    name: "Usman Ghani",
    email: "usman.ghani.media@outlook.com",
    phone: "+92 345 1122334",
    address: "Satellite Town, Rawalpindi",
    skills: ["Photography & Videography", "Social Media", "Graphic Design", "Content Writing"],
    areaOfInterest: "Media, PR & Awareness",
    availability: "Flexible / Remote",
    experience: "Freelance documentary filmmaker and digital storyteller. Created impact videos for 2 local charity foundations.",
    status: "Pending",
    appliedDate: "2026-09-01",
    approvedDate: null,
    assignedCampaign: null,
    hoursContributed: 0,
    message: "I want to document ground relief efforts and produce high quality human-interest stories to boost campaign donations."
  },
  {
    id: "VOL-105",
    name: "Zainab Hashmi",
    email: "zainab.hashmi@fintech.co",
    phone: "+92 313 7788990",
    address: "Model Town, Lahore",
    skills: ["Fundraising", "Event Coordination", "Accounting", "Corporate Outreach"],
    areaOfInterest: "Fundraising & Donor Relations",
    availability: "Weekends Only",
    experience: "Corporate relations officer with extensive network in CSR departments of multinational corporations.",
    status: "Pending",
    appliedDate: "2026-09-02",
    approvedDate: null,
    assignedCampaign: null,
    hoursContributed: 0,
    message: "I can help connect GiveHope with corporate CSR sponsorship programs for clean water solar wells."
  },
  {
    id: "VOL-106",
    name: "Hassan Raza",
    email: "hassan.raza.mech@gmail.com",
    phone: "+92 302 9944112",
    address: "Saddar, Hyderabad",
    skills: ["Solar Installation", "Plumbing", "Mechanical Repair", "Field Survey"],
    areaOfInterest: "Clean Water Well Infrastructure",
    availability: "Weekends",
    experience: "Certified technician with 3 years solar pumping installation background in rural Sindh.",
    status: "Approved",
    appliedDate: "2026-08-10",
    approvedDate: "2026-08-12",
    assignedCampaign: "camp-005",
    hoursContributed: 60,
    message: "Happy to volunteer my technical expertise in inspecting and maintaining solar water filtration units."
  },
  {
    id: "VOL-107",
    name: "Nida Sheikh",
    email: "nida.sheikh@invalidmail.com",
    phone: "+92 300 0001111",
    address: "Multan Cantt",
    skills: ["General Volunteering"],
    areaOfInterest: "General Assistance",
    availability: "Irregular",
    experience: "No prior experience provided.",
    status: "Rejected",
    appliedDate: "2026-08-05",
    approvedDate: null,
    assignedCampaign: null,
    hoursContributed: 0,
    message: "Application incomplete and contact details unverifiable."
  }
];

export const INITIAL_DONORS = [
  {
    id: "DNR-001",
    name: "Dr. Tariq Mansoor",
    email: "tariq.mansoor@hospital.org",
    phone: "+92 300 8241991",
    totalDonated: 180000,
    donationsCount: 5,
    lastDonationDate: "2026-09-02",
    tier: "Platinum Champion",
    city: "Lahore",
    status: "Active"
  },
  {
    id: "DNR-002",
    name: "Muhammad Farooq Khan",
    email: "mfkhan.realestate@gmail.com",
    phone: "+92 333 5129988",
    totalDonated: 350000,
    donationsCount: 7,
    lastDonationDate: "2026-08-30",
    tier: "Platinum Champion",
    city: "Islamabad",
    status: "Active"
  },
  {
    id: "DNR-003",
    name: "Amina Al-Sayed",
    email: "amina.sayed@globaltech.com",
    phone: "+92 321 4458912",
    totalDonated: 125000,
    donationsCount: 6,
    lastDonationDate: "2026-09-01",
    tier: "Gold Benefactor",
    city: "Karachi",
    status: "Active"
  },
  {
    id: "DNR-004",
    name: "Syeda Maryam",
    email: "maryam.syeda@lawfirm.com",
    phone: "+92 308 5544332",
    totalDonated: 95000,
    donationsCount: 3,
    lastDonationDate: "2026-08-20",
    tier: "Silver Supporter",
    city: "Lahore",
    status: "Active"
  },
  {
    id: "DNR-005",
    name: "Kamran Siddiqui",
    email: "ksiddiqui@fmcg.com",
    phone: "+92 300 7711223",
    totalDonated: 60000,
    donationsCount: 4,
    lastDonationDate: "2026-08-24",
    tier: "Silver Supporter",
    city: "Karachi",
    status: "Active"
  },
  {
    id: "DNR-006",
    name: "Zainab Rasheed",
    email: "zainab.rasheed@edu.pk",
    phone: "+92 334 1239876",
    totalDonated: 40000,
    donationsCount: 5,
    lastDonationDate: "2026-08-25",
    tier: "Bronze Friend",
    city: "Peshawar",
    status: "Active"
  },
  {
    id: "DNR-007",
    name: "Fatima Zahra",
    email: "fatima.zahra.design@gmail.com",
    phone: "+92 345 8823190",
    totalDonated: 25000,
    donationsCount: 3,
    lastDonationDate: "2026-08-28",
    tier: "Bronze Friend",
    city: "Faisalabad",
    status: "Active"
  }
];

export const INITIAL_USERS = [
  {
    id: "usr-admin-01",
    name: "Ihsan Ullah (Executive Director)",
    email: "admin@givehope.ngo",
    role: "Admin",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    joinedDate: "2024-01-15",
    phone: "+92 300 1234567"
  },
  {
    id: "usr-donor-01",
    name: "Dr. Tariq Mansoor",
    email: "donor@example.com",
    role: "Donor",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    joinedDate: "2025-03-10",
    phone: "+92 300 8241991"
  },
  {
    id: "usr-vol-01",
    name: "Dr. Ayesha Malik",
    email: "volunteer@example.com",
    role: "Volunteer",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
    joinedDate: "2026-08-15",
    phone: "+92 300 4422991"
  }
];

export const INITIAL_NGO_SETTINGS = {
  orgName: "GiveHope Humanitarian Trust",
  shortName: "GiveHope NGO",
  tagline: "Together We Can Make a Difference",
  registrationNumber: "NGO/REG-PB/2021/9842",
  ntnNumber: "7492104-9",
  taxExemptionStatus: "Section 61 & 2(36) Approved Non-Profit",
  currency: "PKR",
  currencySymbol: "Rs.",
  email: "contact@givehope.ngo",
  helpline: "+92 (42) 3588-4422",
  whatsapp: "+92 300 9988776",
  address: "Plot 42-B, Main Boulevard, Gulberg III, Lahore, Pakistan",
  socialLinks: {
    facebook: "https://facebook.com/givehopengo",
    twitter: "https://twitter.com/givehopengo",
    instagram: "https://instagram.com/givehopengo",
    linkedin: "https://linkedin.com/company/givehopengo",
    youtube: "https://youtube.com/c/givehopengo"
  },
  paymentGateways: {
    jazzCashEnabled: true,
    easyPaisaEnabled: true,
    stripeCardEnabled: true,
    bankTransferEnabled: true,
    cashPickupEnabled: true
  },
  notifications: {
    emailOnDonation: true,
    emailOnVolunteerSignup: true,
    dailySummaryDigest: true,
    smsReceiptsEnabled: true
  }
};

export const MONTHLY_ANALYTICS_DATA = [
  { month: "Jan", target: 800000, donations: 720000, volunteers: 45, donors: 120 },
  { month: "Feb", target: 850000, donations: 890000, volunteers: 58, donors: 145 },
  { month: "Mar", target: 900000, donations: 950000, volunteers: 72, donors: 180 },
  { month: "Apr", target: 1000000, donations: 1120000, volunteers: 95, donors: 210 },
  { month: "May", target: 1100000, donations: 1080000, volunteers: 84, donors: 195 },
  { month: "Jun", target: 1200000, donations: 1350000, volunteers: 110, donors: 260 },
  { month: "Jul", target: 1400000, donations: 1680000, volunteers: 145, donors: 320 },
  { month: "Aug", target: 1500000, donations: 1820000, volunteers: 168, donors: 380 },
  { month: "Sep", target: 1600000, donations: 1950000, volunteers: 190, donors: 420 }
];

export const CATEGORY_DISTRIBUTION = [
  { name: "Disaster Relief", value: 35, color: "#0D9488" },
  { name: "Healthcare Aid", value: 25, color: "#3B82F6" },
  { name: "Child Education", value: 20, color: "#F59E0B" },
  { name: "Clean Water", value: 12, color: "#06B6D4" },
  { name: "Food & Shelter", value: 8, color: "#10B981" }
];
