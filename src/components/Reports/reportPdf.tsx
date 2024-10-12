'use client';
import React, { useEffect, useRef, useState } from "react";
import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import _ from "lodash";
import { Report, Marks } from "@/src/definitions/marks";
import { Image } from "@react-pdf/renderer";

import { ChartSvg } from "./Chart";
import CustomBarChart from "./Barchart";


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
    gap: 30,
    marginBottom: 20,
    paddingHorizontal: 10,
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
  subHeader: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    textDecoration: "underline",
    marginTop: 10,
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
    fontSize: 10,
  },
  subjectTitle: {
    fontWeight: "light",
    fontSize: 12,
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
    marginTop: 30,
    paddingTop: 10,
    paddingBottom: 10,
  },
  commentHeader: {
    fontSize: 12,
    fontWeight: "bold",
    textDecoration: "underline",
    marginBottom: 5,
  },
  commentText: {
    fontSize: 10,
    marginBottom: 15,
  },
  dateAndSignature: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#000",
    paddingTop: 10,
  },
  horizontalLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    marginTop: 20,
    marginBottom: 20,
  },
  chartContainer: {
    marginTop: 20,
    padding: 10,
  },
  chartTitle: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 5,
  },
});

interface ReportPDFProps {
  data: Report[];
}
const ReportPDF: React.FC<ReportPDFProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.headerContainer}>
            <Image style={styles.schoolLogo} src="/logo.jpeg" />
            <View style={styles.schoolDetails}>
              <Text style={styles.header}>MATHAUTA MIXED SECONDARY SCHOOL</Text>
              <Text style={styles.header}>P.O Box 299-90119</Text>
              <Text style={styles.subHeader}>TERMINAL REPORT FORM</Text>
            </View>
          </View>
          <View style={styles.studentContainer}>
            <Text style={styles.text}>No data available for this report.</Text>
          </View>
        </Page>
      </Document>
    );
  }
  const chartWidth = 500; // Set a static or calculated width
  const chartHeight = 300; // Set a static or calculated height
  const chartData = data.map(report => ({
    calendar_year: report.marks[0]?.term.calendar_year || "N/A", 
    mean_marks: report.overall_grading.mean_marks || "N/A",
  }));
  return (
    <Document>
      {data.map((report: Report, index: number) => (
        <Page key={report.student.id} size="A4" style={styles.page}>
          <View style={styles.headerContainer}>
            <Image style={styles.schoolLogo} src="/logo.jpeg" />
            <View>
              <Text style={styles.header}>MATHAUTA MIXED SECONDARY SCHOOL</Text>
              <Text style={styles.header}>P.O Box 299-90119</Text>
              <Text style={styles.subHeader}>TERMINAL REPORT FORM</Text>
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
                <Text style={styles.tableCell}>Subject</Text>
                <Text style={styles.tableCell}>Cat</Text>
                <Text style={styles.tableCell}>End Term</Text>
                <Text style={styles.tableCell}>Total</Text>
                <Text style={styles.tableCell}>Grade</Text>
                <Text style={[styles.tableCell, styles.subjectTitle]}>
                  Points
                </Text>
                <Text style={styles.tableCellLast}>Remarks</Text>
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
                  <Text style={styles.tableCellLast}>{mark.remarks}</Text>
                </View>
              ))}
              <View style={{ padding: 15 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 10,
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
                    marginTop: 10,
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
                {/* <ChartSvg width={chartWidth} height={chartHeight}>
            <CustomBarChart data={chartData} />
          </ChartSvg> */}
              </View>
            </View>
          </View>
        </Page>
      ))}
    </Document>
  );
};

export default ReportPDF;
