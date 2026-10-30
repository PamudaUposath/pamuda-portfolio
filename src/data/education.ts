// Education data - Academic background and qualifications
export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string; // Format: "Month YYYY"
  endDate: string; // Format: "Month YYYY" or "Present"
  grade?: string;
  description?: string;
  activities?: string[];
  skills?: string[];
  logo?: string;
}

export const educations: Education[] = [
  {
    id: "6",
    institution: "University of Jaffna",
    degree: "B.Sc. Hons (Computer Science)",
    field: "(Undergraduate)",
    startDate: "Oct 2023",
    endDate: "Present",
    grade: "Expected completion: 2027",
    description: "Pursuing BSc (Hons) in Computer Science with a strong focus on Cloud Computing, DevOps, Distributed Systems, Software Engineering, Cloud Architecture, and System Reliability. Research: 'Impact of Monitoring Baselines on Microservice Failure Detection', investigating how different sources of normal monitoring data influence microservice failure detection using infrastructure metrics, service response signals, and their combination.",
    activities: [
      "AWS Student Builder Group Leader at University of Jaffna",
      "IEEE Student Branch Executive Committee",
      "Gavel Club & University Badminton",
    ],
    skills: [
      "Java",
      "Python (Programming Language)",
      "MIPS Assembly",
      "MySQL",
      "MongoDB",
      "Perl",
    ],
    logo: "/education/UOJ-Logo-Color-scaled.png"
  },
  {
    id: "4",
    institution: "Ananda College",
    degree: "GCE Advanced Level",
    field: "(Physical Science Stream)",
    startDate: "Jun 2019",
    endDate: "Jan 2022",
    grade: "2Bs and 1C (z-score: 1.1546)",
    description: "Completed Advanced Level studies in Combined Mathematics, Physics, and ICT, qualifying for university entrance in Computer Science.",
    activities: [
      "Board Member (Editor) - Science Union (2020-2021)",
      "Member of ICT Society (2019-2021)",
      "Member of Science Union (2019-2021)",
      "Member of Shooting Sports Association (2019-2021)",
    ],
    logo: "/education/ananda_logo.png"
  },
  {
    id: "3",
    institution: "ESOFT Metro Campus",
    degree: "Diploma in",
    field: "English",
    startDate: "Jan 2019",
    endDate: "Jun 2019",
    description: "Completed Diploma in English language.",
    logo: "/education/esoft-metro-campus-colombo-sri-lanka.jpg"
  },
  {
    id: "1",
    institution: "Thurstan College",
    degree: "GCE Ordinary Level",
    field: "(Secondary Education)",
    startDate: "Feb 2008",
    endDate: "May 2019",
    grade: "9As in O/L (2018)",
    description: "Completed secondary education with 9As at the GCE O/L examination along with active sports and co-curricular involvement.",
    activities: [
      "Junior Prefect (2017)",
      "Primary Prefect (2012)",
      "U15 Vice-Captain - Badminton",
      "U14 Vice-Captain - Badminton",
      "U13 Captain - Badminton",
      "Member of Buddhist Society",
      "Member of chess team (2011-2013)",
      "Member of badminton team (2013-2019)",
    ],
    logo: "/education/Thurstan_College_crest.png"
  }
];
