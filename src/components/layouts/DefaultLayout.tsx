import { ReduxProvider } from "@/src/app/Provider";
import { Header } from "../header/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SessionChecker from "../Sessions/SessionChecker";
// #D6DBDC
// #F1F6F9
export const DefaultLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
          <SessionChecker />
    <div
      style={{ minHeight: "100vh",  }}
      className="bg-[#F1F6F9] "
    >
      <Header />
      <div className="p-1 lg:p-5 md:p-5">
          {children} 
      </div>
    </div>
    </>
  );
};
