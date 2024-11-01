'use client';
import { MdEmail, MdFolder, MdCloudUpload } from 'react-icons/md';  
import { useRouter } from "next/navigation";
import { FaGear } from "react-icons/fa6";
type GradingSetting = {
  heading: string;
  items: { label: string; link: string; icon?: JSX.Element }[];  
};

const gradingSections:GradingSetting[]  = [
  {
    heading: "Subjects Grade scale configurations",
    items: [
      { label: "Grading scale configs", icon: <FaGear size={25} />, link: "/grading" },
      
    ]
  },
  {
    heading: "MeanGrade Scale configurations",
    items: [
      { label: "Meangrade configs ", icon: <FaGear size={25} />, link: "/grading/meangradeconfigs" },
    ]
  },
  
];

const Settings = () => {
  const router = useRouter();
  const handleNavigate = (link: string): void => {
    router.push(link);
  };

  return (
    <div className="lg:mt-[110px] sm:mt-[110px] mt-[70px] flex flex-col bg-white min-h-[75vh] shadow-md">
      <div className="px-3 p-5 border-b flex justify-between">
        <h2 className="font-bold text-lg text-primary">Settings</h2>
      </div>

      <div className="p-5 grid lg:grid-cols-4 sm:grid-cols-2 gap-5">
        {gradingSections.map((section, index) => (
          <div key={index} className="border rounded-md shadow-sm  min-h-[40vh] ">
           
            <div className="font-semibold   bg-secondaryLight  p-3 ">
              <h5 className="uppercase  text-sm lg:text-md uppercase text-primary">{section.heading}</h5>
            </div>
            <ul className="p-2 ">
              {section.items.map((item, i) => (
                <li 
                  key={i} 
                  onClick={() => handleNavigate(item.link)}
                  className="p-2 flex items-center hover:text-green-500 space-x-4 border-b cursor-pointer decoration-dotted  last:border-b-0  hover:text-blue-500 transition"
                >
                 
                 
                    <h5 className="text-green-900 font-medium hover:text-green-500 text-sm lg:text-lg">
                        {item.label}
                    </h5>
                  {/* {item.icon && <span className="mr-2 text-primary">{item.icon}</span>} */}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Settings;
