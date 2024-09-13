import { DefaultLayout } from "@/src/components/layouts/DefaultLayout";
import Link from "next/link";
import {
  FaBookReader,
  FaUniversity,
  FaUser,
  FaUserGraduate,
  FaUserTie,
} from "react-icons/fa";
import { BsHousesFill } from "react-icons/bs";
import { HiClipboardDocumentList } from "react-icons/hi2";
import { FaBookOpen } from "react-icons/fa6";
import { FaShop } from "react-icons/fa6";
import { SiLevelsdotfyi } from "react-icons/si";
const DashboardPage = () => {
  const cardData = [
    { text: "Students", icon: <FaBookReader size={40} />, path: "/students" },
    { text: "Subjects", icon: <FaBookOpen size={40} />, path: "/subjects" },
    { text: "Classes", icon: <FaShop size={40} />, path: "/classes" },
    { text: "Form Levels", icon: <SiLevelsdotfyi size={40} />, path: "/form-levels" },
    { text: "Streams", icon: <BsHousesFill size={40} />, path: "/streams" },
    { text: "Reports", icon: <HiClipboardDocumentList size={40} />, path: "/Reports" },
    { text: "Accounts", icon: <FaUser size={40} />, path: "/accounts" },
  ];
  return (
    <DefaultLayout>
      <div className="mt-[50px] sm:mt-[110px] lg:mt-[110px] grid grid-cols-1 lg:grid-cols-5 sm:grid-cols-4 sm:gap-5 gap-3 lg:gap-5">
        {cardData.map((card, index) => (
          <Link href={card.path} key={index}>
            <div className="max-w-sm rounded overflow-hidden flex flex-col gap-5 text-[#1F4772] hover:text-[#36A000] font-semibold cursor-pointer items-center  bg-white  p-6 border">
              {/* <div style={{ fontSize: "3rem", color: "#1F4772" }}> */}
                {card.icon}
              {/* </div> */}
              <h2 className="">{card.text}</h2>
            </div>
          </Link>
        ))}
      </div>
    </DefaultLayout>
  );
};
export default DashboardPage;
