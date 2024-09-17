import { ReduxProvider } from "@/src/app/Provider"
import { Header } from "../header/Header"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// #D6DBDC
// #F1F6F9
export const DefaultLayout=({children}:{children:React.ReactNode})=>{
    return (
<div
      style={{ minHeight: "100vh", display: "flex",  }}
      className="bg-[#F1F6F9] flex flex-col"
    >
        <Header />
      <div className="p-1 lg:p-5 md:p-5">
      <ReduxProvider>
      {children}
      <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light" 
        />
      </ReduxProvider>
      </div>
    </div>
    )
}