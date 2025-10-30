export const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

export const DISTRICTS = {
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur"],
  "Arunachal Pradesh": ["Itanagar", "Tawang", "Pasighat"],
  "Assam": ["Guwahati", "Jorhat", "Dibrugarh"],
  "Bihar": ["Patna", "Gaya", "Bhagalpur"],
  "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur"],
  "Goa": ["Panaji", "Margao", "Vasco da Gama"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara"],
  "Haryana": ["Gurgaon", "Faridabad", "Panchkula"],
  "Himachal Pradesh": ["Shimla", "Dharamshala", "Mandi"],
  "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad"],
  "Karnataka": ["Bangalore", "Mysore", "Mangalore"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode"],
  "Madhya Pradesh": ["Indore", "Bhopal", "Gwalior"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur"],
  "Manipur": ["Imphal", "Thoubal", "Churachandpur"],
  "Meghalaya": ["Shillong", "Tura", "Nongpoh"],
  "Mizoram": ["Aizawl", "Lunglei", "Chhimtuipui"],
  "Nagaland": ["Kohima", "Dimapur", "Mokokchung"],
  "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela"],
  "Punjab": ["Ludhiana", "Amritsar", "Jalandhar"],
  "Rajasthan": ["Jaipur", "Udaipur", "Jodhpur"],
  "Sikkim": ["Gangtok", "Namchi", "Geyzing"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad"],
  "Tripura": ["Agartala", "Udaipur", "Dharmanagar"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi"],
  "Uttarakhand": ["Dehradun", "Haridwar", "Nainital"],
  "West Bengal": ["Kolkata", "Darjeeling", "Howrah"]
};

export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
export const COMPONENTS = ["Whole Blood", "Plasma", "Platelets", "Cryoprecipitate"];
const CATEGORIES = ["Govt.", "Private", "Charitable/Vol"];
const TYPES = ["Blood Bank", "Hospital"];

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export const BLOOD_BANK_RESULTS = [];

for (const state of STATES) {
  for (const district of DISTRICTS[state]) {
    for (let i = 1; i <= 20; i++) {
      BLOOD_BANK_RESULTS.push({
        name: `${district} Blood Center ${i}`,
        address: `${district} Main Road, ${state}`,
        contact: `98${Math.floor(100000000 + Math.random() * 900000000)}`,
        category: random(CATEGORIES),
        availability: `${random(COMPONENTS)}, ${random(BLOOD_GROUPS)}: ${Math.random() < 0.5 ? "Available" : "Not Available"}`,
        updated: "2025-10-02 14:00:00",
        type: random(TYPES),
        state,
        district,
      });
    }
  }
}
