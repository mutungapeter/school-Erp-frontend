"use client";
import { Marks, Report } from "@/src/definitions/marks";
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

import { Image } from "@react-pdf/renderer";
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: 10,
    fontFamily: "Helvetica",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    marginBottom: 5,
    paddingHorizontal: 5,
  },
  schoolLogo: {
    width: 90,
    height: 90,
  },
  schoolDetails: {
    flex: 1,
  },
  meanGrade: {
    flex: 1,
  },
  header: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "uppercase",
  },
  header1: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "uppercase",
    justifyContent: "center",
  },
  subHeaderSection: {
    alignItems: "center",
    justifyContent: "space-around",
    marginTop: 5,
  },
  subHeader: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    textDecoration: "underline",
    justifyContent: "center",
    marginTop: 20,
  },
  studentContainer: {
    marginBottom: 30,
    padding: 15,
    backgroundColor: "white",
  },
  topSection: {
    flexDirection: "column",
  },

  studentName: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
  },
  text: {
    fontSize: 10,
    fontWeight: "normal",
    textTransform: "uppercase",
  },
  overallText: {
    fontSize: 10,
    fontWeight: "normal",
    textTransform: "uppercase",
  },
  innerText: {
    fontSize: 10,
    fontWeight: "normal",
    textDecoration: "underline",
  },
  table: {
    marginTop: 10,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
  },
  tableCell: {
    flex: 1,
    padding: 5,
    textAlign: "center",
    fontSize: 10,
    borderRightWidth: 1,
    borderRightColor: "#000",
    borderRightStyle: "solid",
  },
  tableCellLast: {
    flex: 1,
    padding: 5,
    textAlign: "center",
    fontSize: 12,
  },
  subjectTitle: {
    fontWeight: "light",
    fontSize: 12,
  },
  subjectTableText: {
    fontWeight: "light",
    fontSize: 12,
    textAlign: "left",
  },
  subjectTableCell: {
    flex: 1,
    padding: 5,
    textAlign: "left",
    fontSize: 10,
    borderRightWidth: 1,
    borderRightColor: "#000",
    borderRightStyle: "solid",
  },
  rowSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  commentSection: {
    borderTopColor: "#000",
    borderTopWidth: 1,
    borderTopStyle: "solid",
  },
  commentHeader: {
    fontSize: 10,
    fontWeight: "bold",
    textDecoration: "underline",
    marginBottom: 5,
    textTransform: "uppercase",
  },
  classTeacher: {
    borderBottomColor: "#000",
    borderBottomWidth: 1,
    borderBottomTopStyle: "solid",
  },
  classTeacherHeader: {
    fontSize: 10,
    fontWeight: "bold",
    textDecoration: "underline",
    paddingTop: 5,
    marginLeft: 5,
    textTransform: "uppercase",
  },
  principalHeader: {
    fontSize: 10,
    fontWeight: "bold",
    textDecoration: "underline",
    paddingTop: 5,
    marginLeft: 5,
    textTransform: "uppercase",
  },
  commentText: {
    fontSize: 10,
    marginBottom: 3,
    padding: 5,
    fontWeight: "semibold",
  },
  dateAndSignText: {
    fontSize: 10,
    marginBottom: 3,
    padding: 5,
    textTransform: "uppercase",
    fontWeight: "extralight",
  },
  dateAndSignature: {
    flexDirection: "column",
    gap: 3,
  },

  section: {
    marginBottom: 10,
  },
  smallTable: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#c0c4c8",
    width: "30%",
    marginTop: 5,
    marginBottom: 5,
    borderCollapse: "collapse",
  },
  smallTableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#c0c4c8",
  },
  smallTableCell: {
    flex: 1,
    padding: 1,
    textAlign: "center",
    fontSize: 9,
    borderRightWidth: 1,
    borderRightColor: "#c0c4c8",
    borderRightStyle: "solid",
  },
  smallTableTermCell: {
    textAlign: "left",
  },
  smallTableCellLast: {
    borderRightWidth: 0,
  },
});

interface ReportPDFProps {
  data: Report[];
  title : string;
}
const ReportPDF = ({ data, title  }: ReportPDFProps) => {
//  const reportTitle = userRole === "Admin" || userRole === "Principal" ? "TERMINAL REPORT FORM" : "UNOFFICIAL TERMINAL REPORT FORM";
  console.log("data", data);
  if (!data || data.length === 0) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text style={styles.commentText}>No reports available.</Text>
        </Page>
      </Document>
    );
  }
  return (
    <Document>
      {data.map((report: Report, index: number) => (
        <Page key={report.student.id} size="A4" style={styles.page}>
          <View style={styles.headerContainer}>
            <Image style={styles.schoolLogo} src="/images/logo.jpg" />
            <View style={{ alignItems: "center" }}>
              <Text style={styles.header}>KWAMWATU SECONDARY SCHOOL </Text>
              <View style={styles.subHeaderSection}>
                <Text style={styles.header1}>P.O Box 180-90119</Text>
                
                  <Text style={styles.subHeader}>{title}</Text>
               
              </View>
            </View>
          </View>
          <View style={styles.studentContainer}>
            <View style={styles.topSection}>
              <View style={styles.rowSection}>
                <Text style={styles.text}>
                  NAME:{" "}
                  <Text style={styles.innerText}>
                    {report.student.first_name} {report.student.last_name}
                  </Text>
                </Text>
                <Text style={styles.text}>
                  ADM No:{" "}
                  <Text style={styles.innerText}>
                    {report.student.admission_number}
                  </Text>
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.text}>
                  Class:{" "}
                  <Text style={styles.innerText}>
                    {report.student.class_level.form_level.name}{" "}
                    {report.student.class_level?.stream?.name}
                  </Text>
                </Text>
                <Text style={styles.text}>
                  TERM:{" "}
                  <Text style={styles.innerText}>
                    {report.marks[0]?.term.term || "N/A"}
                  </Text>
                </Text>
                <Text style={styles.text}>
                  YEAR:{" "}
                  <Text style={styles.innerText}>
                    {report.marks[0]?.term.calendar_year || "N/A"}
                  </Text>
                </Text>
                <Text style={styles.text}>
                  POSITION:{" "}
                  <Text style={styles.innerText}>
                    {report.overall_grading.position}
                  </Text>
                </Text>
              </View>
            </View>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.subjectTableText]}>
                  Subject
                </Text>
                <Text style={styles.tableCell}>Cat</Text>
                <Text style={styles.tableCell}>End Term</Text>
                <Text style={styles.tableCell}>Total</Text>
                <Text style={styles.tableCell}>Grade</Text>
                <Text style={[styles.tableCell, styles.subjectTitle]}>
                  Points
                </Text>
                <Text style={styles.tableCell}>Remarks</Text>
                <Text style={styles.tableCellLast}>Initials</Text>
              </View>
              {report.marks?.map((mark: Marks, index: number) => (
                <View key={mark.id} style={styles.tableRow}>
                  <Text style={styles.subjectTableCell}>
                    {mark.student_subject.subject.subject_name}
                  </Text>
                  <Text style={styles.tableCell}>{mark.cat_mark}</Text>
                  <Text style={styles.tableCell}>{mark.exam_mark}</Text>
                  <Text style={styles.tableCell}>{mark.total_score}</Text>
                  <Text style={styles.tableCell}>{mark.grade}</Text>
                  <Text style={styles.tableCell}>{mark.points}</Text>
                  <Text style={styles.tableCell}>{mark.remarks}</Text>
                  <Text style={styles.tableCellLast}></Text>
                </View>
              ))}
              <View style={{ padding: 8, flexDirection: "column", gap: 10 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    // padding: 5,
                  }}
                >
                  <Text style={styles.overallText}>
                    Points:{" "}
                    <Text style={styles.innerText}>
                      {report.overall_grading.total_points}
                    </Text>
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 20,
                    }}
                  >
                    <Text style={styles.overallText}>
                      Total Marks:{" "}
                      <Text style={styles.innerText}>
                        {report.overall_grading.total_marks}
                      </Text>
                    </Text>
                    <Text style={styles.overallText}>
                      Out of:{" "}
                      <Text style={styles.innerText}>
                        {report.overall_grading.grand_total}
                      </Text>
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    // padding: 5,
                  }}
                >
                  <Text style={styles.overallText}>
                    Average Mark:{" "}
                    <Text style={styles.innerText}>
                      {report.overall_grading.mean_marks}
                    </Text>
                  </Text>
                  <Text style={styles.overallText}>
                    Mean Grade:{" "}
                    <Text style={styles.meanGrade}>
                      {" "}
                      {report.overall_grading.mean_grade}
                    </Text>
                  </Text>
                </View>
              </View>
              <View>
                <View
                  style={{
                    padding: 5,
                    alignItems: "flex-start",
                    borderTopStyle: "solid",
                    borderTopWidth: 1,
                    borderTopColor: "#000",
                  }}
                >
                  <View style={styles.smallTable}>
                    <View style={styles.smallTableRow}>
                      <Text
                        style={[
                          styles.smallTableCell,
                          styles.smallTableTermCell,
                        ]}
                      >
                        Term
                      </Text>
                      <Text style={styles.smallTableCell}>Mean Marks</Text>
                    </View>

                    {report?.term_data?.map((termData) => (
                      <View key={termData.term} style={styles.smallTableRow}>
                        <Text
                          style={[
                            styles.smallTableCell,
                            styles.smallTableTermCell,
                          ]}
                        >
                          {termData.term}
                        </Text>
                        <Text style={styles.smallTableCell}>
                          {parseFloat(termData.mean_marks).toFixed(2)}
                        </Text>
                      </View>
                    ))}

                    <View style={styles.smallTableRow}>
                      <Text
                        style={[
                          styles.smallTableCell,
                          styles.smallTableTermCell,
                        ]}
                      >
                        KCPE Average
                      </Text>
                      <Text style={styles.smallTableCell}>
                        {report.overall_grading.kcpe_average
                          ? report.overall_grading.kcpe_average.toFixed(2)
                          : "N/A"}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.commentSection}>
                  <View style={styles.classTeacher}>
                    <Text style={styles.classTeacherHeader}>
                      Class Master&apos;s/Mistress&apos;s Comments:
                    </Text>
                    <View style={{ padding: 5 }}>
                      <View style={styles.dateAndSignature}>
                        <Text style={styles.commentText}>
                          {report.overall_grading.mean_remarks
                            ? report.overall_grading.mean_remarks
                            : "N/A"}
                        </Text>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <Text style={styles.dateAndSignText}>
                            Date: ___________________
                          </Text>
                          <Text style={styles.dateAndSignText}>
                            Signature: ___________________
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
                <View>
                  <Text style={styles.principalHeader}>
                    Principal&apos;s Comments:
                  </Text>

                  <View style={{ padding: 5 }}>
                    <View style={styles.dateAndSignature}>
                      <Text style={styles.commentText}>
                        {report.overall_grading.mean_remarks
                          ? report.overall_grading.mean_remarks
                          : "N/A"}
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text style={styles.dateAndSignText}>
                          Date: ___________________
                        </Text>
                        <Text style={styles.dateAndSignText}>
                          Signature: ___________________
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <View style={{ flexDirection: "column", gap: 5, marginTop: 5 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 10 }}>
                  Outstanding Fees Balance: Ksh___________
                </Text>
                <Text style={{ fontSize: 10 }}>
                  Next term Fees: Ksh _______________
                </Text>
                <Text style={{ fontSize: 10 }}>
                  Total balance: Ksh ____________
                </Text>
              </View>
              <View style={{ flexDirection: "row", gap: 20 }}>
                <Text style={{ fontSize: 10 }}>
                  Report Seen by Parent/Guardian:______________
                </Text>
                <Text style={{ fontSize: 10 }}>Date:______________</Text>
                <Text style={{ fontSize: 10 }}>SIGN_____________</Text>
              </View>
              <Text style={{ fontSize: 10 }}>
                Next term begins on:___________
              </Text>
            </View>
          </View>
        </Page>
      ))}
    </Document>
  );
};

export default ReportPDF;
