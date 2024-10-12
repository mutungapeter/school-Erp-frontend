'use client';
import { MdEmail, MdFolder, MdCloudUpload } from 'react-icons/md';  
import { useRouter } from "next/navigation";


type ReportSection = {
  heading: string;
  items: { label: string; link: string; icon?: JSX.Element }[];  
};

const reportSections:ReportSection[]  = [
  {
    heading: "Student Reports",
    items: [
      { label: "Report Card", icon: <MdEmail />, link: "/reports/report-card" },
      // { label: "Transcript", icon: <MdEmail />, link: "#"S },
      { label: "Student Summary", icon: <MdEmail />, link: "#" },
    ]
  },
  {
    heading: "Attendance Reports",
    items: [
      { label: "Daily Report", link: "#" },
      { label: "Student Totals", link: "#" },
      
      { label: "Class Detail", link: "#" },
    ]
  },
  {
    heading: "Administrative",
    items: [
      { label: "Class Enrollment", link: "#" },
      { label: "Class Promotion", link: "#" },
      { label: "Class Performance", link: "#" }
      
    ]
  },
  {
    heading: "Login Invitations",
    items: [
      { label: "Teacher", icon: <MdEmail />, link: "#" },
      { label: "Student", icon: <MdEmail />, link: "#" },
      { label: "Parent", icon: <MdEmail />, link: "#" }
    ]
  }
];

const Reports = () => {
  const router = useRouter();
  const handleNavigate = (link: string): void => {
    router.push(link);
  };

  return (
    <div className="lg:mt-[110px] sm:mt-[110px] mt-[50px] flex flex-col bg-white">
      <div className="px-3 p-5 border-b flex justify-between">
        <h2 className="font-bold text-lg text-primary">Reports</h2>
      </div>

      <div className="p-5 grid lg:grid-cols-4 sm:grid-cols-2 gap-5">
        {reportSections.map((section, index) => (
          <div key={index} className="border rounded-md shadow-sm  ">
           
            <h3 className="font-semibold text-md  bg-secondaryLight  p-3 text-primary">
              {section.heading}
            </h3>
            <ul>
              {section.items.map((item, i) => (
                <li 
                  key={i} 
                  onClick={() => handleNavigate(item.link)}
                  className="p-2 flex items-center space-x-2 border-b cursor-pointer decoration-dotted  last:border-b-0  hover:text-blue-500 transition"
                >
                 
                  <div   className="text-primary hover:text-secondary text-sm ">
                    {item.label}
                  </div>
                  {item.icon && <span className="mr-2 text-primary">{item.icon}</span>}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;
