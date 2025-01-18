import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { Report } from "@/src/definitions/marks";

const styles = StyleSheet.create({
  page: {   
    flexDirection: "column",
    padding: 10,
    fontFamily: "Helvetica",},
  table: {
    marginTop: 10,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000", // Border color retained
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#black",
    borderBottomStyle: "solid",
  },
  tableCell: {
    flex: 1,
    padding: 3,
    textAlign: "left",
    fontSize: 10, 
    borderRightWidth: 1,
    borderRightColor: "black",
    borderRightStyle: "solid",
  },
  tableCellLast: {
    flex: 1,
    padding: 3,
    textAlign: "center",
    fontSize: 10, 
  },
  heading: {
    fontSize: 14,
    marginBottom: 10,
    textAlign: "center",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    marginBottom: 5,
    paddingHorizontal: 5,
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
    textTransform: "uppercase",
  },
});

export const MeritListPDF = ({ reports }: { reports: Report[] }) => {

    const firstReport = reports.length > 0 ? reports[0] : undefined;
    return (
    
      <Document>
        <Page size="A4" style={styles.page}>
    
          <>
          <View style={styles.headerContainer}>
    
                  <View style={{ alignItems: "center" }}>
                      <Text style={styles.subHeaderSection}>KWAMWATU SECONDARY SCHOOL </Text>
                      <View style={styles.header}>
                            <Text> MERIT LIST - 
                                {firstReport?.student.class_level.name}{" "}
                                {firstReport?.student.class_level?.stream?.name}
                            </Text>
                            <Text style={styles.subHeader}>
                                {firstReport?.marks[0]?.term.term || "-"} - 
                                {firstReport?.student.class_level.calendar_year || "-"}
                            </Text>
                        </View>
                  </View>
              </View><View style={styles.table}>
                      {/* Table Header */}
                      <View style={styles.tableRow}>
                          {/* <Text style={styles.tableCell}>#</Text> */}
                          <Text style={styles.tableCell}>Name</Text>
                          <Text style={styles.tableCell}>Admission Number</Text>
                          <Text style={styles.tableCell}>Mean Grade</Text>
                          <Text style={styles.tableCellLast}>Position</Text>
                      </View>
    
    
                      {reports.map((report, index) => (
                      <View key={index} style={styles.tableRow}>
                          {/* <Text style={styles.tableCell}>{index + 1}</Text> */}
                          <Text style={styles.tableCell}>
                              {report.student.first_name} {report.student.last_name}
                          </Text>
                          <Text style={styles.tableCell}>{report.student.admission_number}</Text>
                          <Text style={styles.tableCell}>
                              {report.overall_grading.mean_grade}
                          </Text>
                          <Text style={styles.tableCellLast}>
                              {report.overall_grading.position}
                          </Text>
                      </View>
     ))}
                  </View>
                  </>
    
        </Page>
      </Document>
    );
}

