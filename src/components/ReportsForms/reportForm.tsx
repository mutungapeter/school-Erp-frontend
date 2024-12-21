"use client";
import { Marks, Report } from "@/src/definitions/marks";
import Image from "next/image";
interface ReportComponentProps {
  data: Report[];
}

const ReportComponent = ({ data }: ReportComponentProps) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-500 text-lg">No reports available.</p>
      </div>
    );
  }
{/* <div className="print-container">

<ReportComponent data={pdfData} />
</div>
  )} */}
  return (
    <div className="print-container mx-auto space-y-8 bg-gray-300 p-8">
      {data.map((report, index) => (
        <div
          key={report.student.id}
          className="max-w-4xl  bg-white shadow-lg rounded-sm p-6 print:page-break-before-always print:page-break-inside-avoid"
        >
          <div className="flex items-center space-x-8 justify-center pb-4 mb-6">
            <Image src={"/images/logo.jpg"} height={90} width={90} alt="" />
            <div className="text-center space-y-4">
              <h2 className="text-xl font-semibold ">
                KWAMWATU SECONDARY SCHOOL
              </h2>
              <h2 className="text-sm font-semibold">P.O BOX 180-90119</h2>
              <h2 className="text-lg font-semibold  ">TERMINAL REPORT FORM</h2>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p>
                <span className="font-semibold text-sm uppercase">NAME:</span>{" "}
                <span className="uppercase">
                  {report.student.first_name} {report.student.last_name}
                </span>
              </p>
              <p>
                <span className="font-semibold text-sm uppercase">ADM No:</span>{" "}
                <span className="uppercase">
                  {report.student.admission_number}
                </span>
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p>
                <span className="font-semibold text-sm uppercase">Class:</span>{" "}
                <span className="uppercase">
                  {report.student.class_level.name}{" "}
                  {report.student.class_level.stream?.name || ""}
                </span>
              </p>
              <p>
                <span className="font-semibold text-sm uppercase">TERM:</span>{" "}
                <span className="uppercase">
                  {report.marks[0]?.term.term || "N/A"}
                </span>
              </p>
              <p>
                <span className="font-semibold text-sm uppercase">YEAR:</span>{" "}
                <span className="uppercase">
                  {report.marks[0]?.term.calendar_year || "N/A"}
                </span>
              </p>
              <p>
                <span className="font-semibold text-sm uppercase">
                  POSITION:
                </span>{" "}
                <span className="uppercase">
                  {report.overall_grading.position}
                </span>
              </p>
            </div>
            <div className="border border-gray-500 ">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-white text-center">
                    <th className="border border-gray-300 text-left p-2">
                      Subject
                    </th>
                    <th className="border border-gray-300    p-2">Cat</th>
                    <th className="border border-gray-300 p-2">End Term</th>
                    <th className="border border-gray-300 p-2">Total</th>
                    <th className="border border-gray-300 p-2">Grade</th>
                    <th className="border border-gray-300 p-2">Points</th>
                    <th className="border border-gray-300 p-2">Remarks</th>
                    <th className="border border-gray-300 p-2">Initials</th>
                  </tr>
                </thead>
                <tbody>
                  {report.marks.map((mark) => (
                    <tr key={mark.id} className="text-center">
                      <td className="border text-left border-gray-300 p-2">
                        {mark.student_subject.subject.subject_name}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {mark.cat_mark}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {mark.exam_mark}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {mark.total_score}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {mark.grade}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {mark.points}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {mark.remarks}
                      </td>
                      <td className="border border-gray-300 p-2"></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className=" py-4 space-y-3  ">
                <div className="flex justify-between items-center px-3 ">
                  <div className="flex space-x-5 items-center ">
                    <p>
                      <span className="font-semibold uppercase text-sm">
                        Total Marks:
                      </span>{" "}
                      {report.overall_grading.total_marks}
                    </p>
                    <p>
                      <span className="font-semibold uppercase text-sm">
                        Out of:{" "}
                      </span>
                      {report.overall_grading.grand_total}
                    </p>
                  </div>

                  <p>
                    <span className="font-semibold text-sm uppercase">
                      Average Mark:
                    </span>{" "}
                    {report.overall_grading.mean_marks}
                  </p>
                </div>
                <div className="flex justify-between items-center px-3">
                  <p>
                    <span className="font-semibold text-sm uppercase">
                      Mean Grade:
                    </span>{" "}
                    <span className="uppercase">
                      {report.overall_grading.mean_grade}
                    </span>
                  </p>
                </div>
              </div>
              <div className="py-4 px-3 border-t border-gray-500">
                <div className="border border-gray-300 w-1/3">
                  <div className="flex justify-between border-b border-gray-300">
                    <div className="flex-1 p-1 text-left text-sm font-medium border-r border-gray-300">
                      Term
                    </div>
                    <div className="flex-1 p-1 text-center text-sm font-medium">
                      Mean Marks
                    </div>
                  </div>
                  {report?.term_data?.map((termData) => (
                    <>
                      <div className="flex justify-between border-b border-gray-300">
                        <div className="flex-1 p-1 text-left text-sm border-r border-gray-300">
                          {termData.term}
                        </div>
                        <div className="flex-1 p-1 text-center text-sm">
                          {parseFloat(termData.mean_marks).toFixed(2)}
                        </div>
                      </div>
                    </>
                  ))}
                  <div className="flex justify-between">
                    <div className="flex-1 p-1 text-left text-sm font-medium border-r border-gray-300">
                      KCPE Average
                    </div>
                    <div className="flex-1 p-1 text-center text-sm font-medium">
                      {report.overall_grading.kcpe_average
                        ? report.overall_grading.kcpe_average.toFixed(2)
                        : "N/A"}
                    </div>
                  </div>
                </div>
              </div>
              <div className="py-3 space-y-3 px-3 border-t border-gray-500">
                <h2 className="uppercase underline text-sm font-semibold decoration-gray-500 underline-offset-4 decoration-1">
                  CLass Minister&apos;s/Mistress&apos;s Comments
                </h2>
                <p>
                  {report.overall_grading.mean_remarks
                    ? report.overall_grading.mean_remarks
                    : "N/A"}
                </p>
                <div className="flex items-center justify-between">
                <div className="flex items-center ">
                  <p>Date:</p>
                  <div className="flex mt-4 w-24 border-b border-black ml-2"></div>
                  </div>
                  <div className="flex items-center ">
                  <p>Signature:</p>
                  <div className="flex mt-4 w-24 border-b border-black ml-2"></div>
                  </div>
                </div>
              </div>
              <div className="py-3 space-y-3 px-3 border-t border-gray-500">
                <h2 className="uppercase underline text-sm font-semibold decoration-gray-500 underline-offset-4 decoration-1">
                  Principal&apos;s Comments
                </h2>
                <p>
                  {report.overall_grading.mean_remarks
                    ? report.overall_grading.mean_remarks
                    : "N/A"}
                </p>
                <div className="flex items-center justify-between">
                <div className="flex items-center ">
                  <p>Date:</p>
                  <div className="flex mt-4 w-24 border-b border-black ml-2"></div>
                  </div>
                  <div className="flex items-center ">
                  <p>Signature:</p>
                  <div className="flex mt-4 w-24 border-b border-black ml-2"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-3 mt-5">
            <div className="flex items-center justify-between">
            <div className="flex items-center ">
            <p className="text-sm font-semibold">Outstanding Fees Balance: Ksh</p>
            <div className="flex mt-4 w-24 border-b border-black ml-2"></div>
            </div>
            <div className="flex items-center ">
            <p className="text-sm font-semibold">Next term Fees: Ksh</p>
            <div className="flex mt-4 w-24 border-b border-black ml-2"></div>
            </div>
            <div className="flex items-center ">
            <p className="text-sm font-semibold">Total balance: Ksh</p>
            <div className="flex mt-4 w-24 border-b border-black ml-2"></div>
            </div>
            </div>
            <div className="flex items-center justify-between">
            <div className="flex items-center ">
                <p className="text-sm font-semibold">Report Seen by Parent/Guardian:</p>
                <div className="flex mt-4 w-32 border-b border-black ml-2"></div>
                </div>
                <div className="flex items-center ">
                <p className="text-sm font-semibold">Date:</p>
                <div className="flex mt-4 w-32 border-b border-black ml-2"></div>
                </div>
                <div className="flex items-center ">
                <p className="text-sm font-semibold">SIGN:</p>
                <div className="flex mt-4 w-32 border-b border-black ml-2"></div>
                </div>
            </div>
            <div className="flex items-center ">
            <p className="text-sm font-semibold ">Next term begins on:</p>
            <div className="flex mt-4 w-32 border-b border-black ml-2"></div>
            </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReportComponent;
