export interface Team {
  name: string;
  members: string[];
}

export interface Sport {
  id: string;
  name: string;
  type: "team" | "individual";
  teams: Team[];
}

export const SPORTS_DATA: Sport[] = [
  {
    id: "chess",
    name: "Chess",
    type: "team",
    teams: [
      {
        name: "UG2023 BongCloud",
        members: ["Arnav Gupta", "Mannan Gupta", "Ansh Tiwari"],
      },
      {
        name: "UG2023 Pawn stars",
        members: ["Kamya Gupta", "Rajit Mundhra", "Charchit Agarwal"],
      },
      {
        name: "UG2024 Bobby Fisther",
        members: [
          "Pranav Ananthasubramanyam",
          "Yashasvi Gupta",
          "Ambar Juneja",
        ],
      },
      {
        name: "Tal's Terrorists",
        members: ["Vishuddh Nishchhal", "Achyut Harsh", "Avi Shukla"],
      },
      {
        name: "UG25 rookies",
        members: ["Anurav Singh", "Harshit Amarnani", "Prithvij Modi"],
      },
      {
        name: "PhD The Royal Fork",
        members: ["K Mohan Reddy", "Saurav", "Anik Mandal"],
      },
      {
        name: "YIF2025 UNFORTUNATELY",
        members: ["Pratyush", "Anu", "Sanyam"],
      },
    ],
  },
  {
    id: "football",
    name: "Football",
    type: "team",
    teams: [
      {
        name: "UG2024 SonipatStrikers",
        members: [
          "Aania Muthreja",
          "Mythili Vaidya",
          "Khwaish Surana",
          "Nihar Roy",
          "Renuka Yadav",
          "Rajita Rai",
          "Susanna John",
          "Rivika Gotewala",
        ],
      },
      {
        name: "Jet2Holiday",
        members: [
          "Kavya Murugan",
          "Samaira Charles",
          "Ananya Shah",
          "Priyal Didwania",
          "Savy Rattan",
          "Ayanna Raha",
          "Pari Dutt",
          "Kaavyaa Gandhi",
        ],
      },
      {
        name: "UG2023 Adhoka United",
        members: [
          "Aisha Lowe",
          "Sanjna Sridhar",
          "Priyanshi Singh",
          "Keerthana Sairam",
          "Kavya Desai",
          "Roshni Pai",
          "Juni",
          "Saanvi Khurana",
        ],
      },
      {
        name: "UG2026 Mallikagang",
        members: [
          "Anandi",
          "Avishikta Sinha",
          "Anya Gosain",
          "Reet Dara",
          "Twisha",
          "Vinee",
          "Ananya Chaddha",
        ],
      },
    ],
  },
  {
    id: "frisbee",
    name: "Frisbee",
    type: "team",
    teams: [
      {
        name: "UG2023 PowerOfFriendship",
        members: [
          "Tanishk Ginoria",
          "Akil Ravichandran",
          "Arnav Mayur",
          "Shivom Srivastava",
          "Yashwanth Reddy",
          "Kushagra Vashista",
        ],
      },
      {
        name: "Aiyoo Ok",
        members: [
          "Varun S Bahl",
          "Ananya Samhita",
          "Kashyap",
          "Krish Goenka",
          "Aditya Malhotra",
          "Tejasdeep",
        ],
      },
      {
        name: "Grazing Goats",
        members: [
          "Arya Gupta",
          "Dheer Jhaveri",
          "Aarav Mookerjee",
          "Aditya Govande",
          "Nayantara Rudra",
          "Saanchi Dhariwal",
        ],
      },
      {
        name: "Disc-o-Deewane",
        members: [
          "Saloni Elizabeth Rego",
          "Vidishaa Mundhra",
          "Aadhya Shetty",
          "Advait Kulkarni",
          "Melvin Musonda",
          "Nila Nagaraja",
        ],
      },
      {
        name: "UG2023 Rizz Bees",
        members: ["Shrinidhi", "Noor", "Amiya", "Abhi", "Gian", "Viraat"],
      },
      {
        name: "UG2025 Huck Yeah!",
        members: [
          "Parisha Thakkar",
          "Shashwat Bhajanka",
          "Ahaan Contractor",
          "Mihika Shah",
          "Kushal Khetan",
          "Sera Khamkar",
        ],
      },
      {
        name: "UG2025 EmeraldEdgers",
        members: [
          "Qaid Bandukwala",
          "Armaan Jamal",
          "Aryaveer Singh",
          "Hardik Srivastava",
          "Aum Desai",
          "Mihika OmSeema",
        ],
      },
    ],
  },
  {
    id: "pool",
    name: "Pool",
    type: "team",
    teams: [
      {
        name: "whatv",
        members: ["Pearl Naik", "Prajwal Gayen"],
      },
      {
        name: "UG2023 Cue-ties",
        members: ["Radhika Garg", "Sashwat Dhanuka"],
      },
      {
        name: "UG2023 SolidBalls",
        members: ["Aditi Mullapudi", "Aarnav Tawar"],
      },
      {
        name: "The Jaideepers",
        members: ["Kavyaa Tanna", "Dev Pathania"],
      },
      {
        name: "UG2023 Sticks & Stones",
        members: ["Trigya", "Kalid"],
      },
      {
        name: "ballbangers",
        members: ["Saachi Moudgal", "Param Shah"],
      },
      {
        name: "UG2023 Cue-Cumber",
        members: ["Tithibrata Pal", "Vartesh Malik"],
      },
      {
        name: "UG2023 HOTSHOTS",
        members: ["Rhythm Khurana", "Nishant Jayade"],
      },
      {
        name: "UG2023 DOUBLEBREAKERS",
        members: ["Cara Sukhtankar", "Ramit Sachdev"],
      },
    ],
  },
  {
    id: "beachvolleyball",
    name: "Beach Volleyball",
    type: "team",
    teams: [
      {
        name: "UG25 ThreeFourthsDosa",
        members: [
          "Jacob Michael Matthew",
          "Katelyn Patta",
          "Varun Bahl",
          "Jyotirmay Zamre",
        ],
      },
      {
        name: "UG2025 First Year Frogs (5)",
        members: [
          "Pranav Srinivas Nalloor",
          "Qaid Bandukwala",
          "Sanjana Vivek",
          "Aahan Desai",
        ],
      },
      {
        name: "UG2024 Bad Beaches (7)",
        members: ["Nayna Taneja", "Jahnavi Krishna", "Essete Girma"],
      },
      {
        name: "The Jaideepers",
        members: [
          "Dev Pathania",
          "Aditya Jatkar",
          "Torsha Dasgupta",
          "Veho Bogi",
        ],
      },
      {
        name: "UG2023 FriendshipOfPower (6)",
        members: [
          "Aditi Gudi",
          "Tanishk Ginoria",
          "Arnav Mayur",
          "Kushagra Vasishta",
        ],
      },
      {
        name: "afghan proverb",
        members: [
          "Archit Das",
          "Aryan Verulkar",
          "Krutika Srivastava",
          "Dersh Savla",
        ],
      },
      {
        name: "Sets on the Beach (4)",
        members: ["Ayaan Dutt", "Raheem Manoj", "Ananya Samhita"],
      },
      {
        name: "Ug2024 TeamName (3)",
        members: ["Sidhant", "Arnav Tandon", "Yashasvi Gupta", "Samay Lankesh"],
      },
      {
        name: "Pizza Ice Cream (2)",
        members: ["Khilan Bhammar", "Devagya", "Vaishnavi Saumya"],
      },
      {
        name: "ug2023 ball (1)",
        members: ["Tanish Parmar", "Ribhu Singh", "Shria Nair", "Vibhu Singh"],
      },
      {
        name: "Four Shore",
        members: ["Hiral Thakur", "Ariya Meshram", "Usher", "Shanaya"],
      },
    ],
  },
  {
    id: "table-tennis",
    name: "Table Tennis",
    type: "individual",
    teams: [
      { name: "Mihika Mehta", members: [] },
      { name: "Radhika Tandon", members: [] },
      { name: "Pearl Naik", members: [] },
      { name: "Tejal Kaur", members: [] },
      { name: "Ojal Rao", members: [] },
      { name: "Amirtha Apollo", members: [] },
      { name: "Reva Agarwal", members: [] },
      { name: "Hrithika Tom", members: [] },
      { name: "Aditi Parmar", members: [] },
      { name: "Darshana Baishya", members: [] },
      { name: "Samridhya", members: [] },
      { name: "Aishani Saurabh", members: [] },
      { name: "Avisikta Sinha", members: [] },
      { name: "Aarya", members: [] },
    ],
  },
  {
    id: "swimming",
    name: "Swimming",
    type: "individual",
    teams: [
      { name: "Raj Choudhary", members: [] },
      { name: "Chaitanya Gupta", members: [] },
      { name: "Shreyas Jhajharia", members: [] },
      { name: "Rohan Marballi", members: [] },
      { name: "Aryan Nath", members: [] },
      { name: "Dharmendra Mahto", members: [] },
      { name: "Advay Almal", members: [] },
      { name: "Shashank Singh", members: [] },
    ],
  },
  {
    id: "shooting",
    name: "Shooting",
    type: "individual",
    teams: [
      { name: "Ananya Agarwal", members: [] },
      { name: "Manas Karthik", members: [] },
      { name: "Lakshita Panghal", members: [] },
      { name: "Alaaya Bahl", members: [] },
      { name: "Preksha", members: [] },
      { name: "Arushi Malhotra", members: [] },
      { name: "Varun Muchhal", members: [] },
      { name: "Advay Awasthy", members: [] },
      { name: "Abhinav Hari", members: [] },
      { name: "Trigya Dhir", members: [] },
      { name: "Hiral Thakur", members: [] },
      { name: "Siya Kohli", members: [] },
      { name: "Shreya Singhal", members: [] },
    ],
  },
];
