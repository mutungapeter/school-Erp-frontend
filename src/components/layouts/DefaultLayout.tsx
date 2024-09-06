import { ReduxProvider } from "@/src/app/Provider"
import { Header } from "../header/Header"
// #D6DBDC
// #F1F6F9
export const DefaultLayout=({children}:{children:React.ReactNode})=>{
    return (
<div
      style={{ minHeight: "100vh", display: "flex",  }}
      className="bg-[#F1F6F9] flex flex-col"
    >
        <Header />
      <div className="p-5">
      <ReduxProvider>
      {children}
      </ReduxProvider>
      </div>
    </div>
    )
}