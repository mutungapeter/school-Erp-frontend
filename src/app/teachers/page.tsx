import { DefaultLayout } from "@/src/components/layouts/DefaultLayout"
// import AssignTeacherForm from "@/src/components/teachers/assignSubjectsAndClasses"
import Teachers from "@/src/components/teachers/Teachers"

const TeachersPage=()=>{
  return (
    <DefaultLayout>
      <Teachers />
      {/* <AssignTeacherForm /> */}
    </DefaultLayout>
  )
}
export default TeachersPage