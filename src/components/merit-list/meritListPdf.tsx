import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { Report } from "@/src/definitions/marks";
import { Image } from "@react-pdf/renderer";
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: 10,
    fontFamily: "Helvetica",
  },
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
    fontSize: 10,
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
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
    textDecoration: "underline",
    justifyContent: "center",
    marginTop: 20,
    textTransform: "uppercase",
  },
  schoolLogo: {
    width: 90,
    height: 90,
  },
});
interface MeritProps{
  reports: Report[];
  title : string;
  subtitle : string;
}
export const MeritListPDF = ({ reports, title, subtitle }: MeritProps) => {
  const firstReport = reports.length > 0 ? reports[0] : undefined;
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerContainer}>
          <Image style={styles.schoolLogo} src="/images/logo.jpg" />
          <View style={{ alignItems: "center" }}>
            <Text style={styles.header}>KWAMWATU SECONDARY SCHOOL </Text>
            <View style={styles.subHeaderSection}>
              <Text style={styles.subHeader}>{title}</Text>
              <Text style={styles.subHeader}>{subtitle} - {firstReport?.student.class_level.name}{" "}
              {firstReport?.student.class_level?.stream?.name}</Text>
              {/* <Text style={styles.header1}>
                MERIT LIST - {firstReport?.student.class_level.name}{" "}
                {firstReport?.student.class_level?.stream?.name}
              </Text> */}

              <Text style={styles.subHeader}>
                {firstReport?.marks[0]?.term.term || "-"} -
                {firstReport?.student.class_level.calendar_year || "-"}
              </Text>
            </View>
          </View>
        </View>

     
        <View style={styles.table}>
     
          <View style={styles.tableRow}>
            {/* <Text style={styles.tableCell}>#</Text> */}
            <Text style={styles.tableCell}>Name</Text>
            <Text style={styles.tableCell}>Admission No</Text>
            <Text style={styles.tableCell}>Mean points</Text>
            <Text style={styles.tableCell}>Mean grade</Text>
            <Text style={styles.tableCellLast}>Position</Text>
          </View>

          {reports.map((report, index) => (
            <View key={index} style={styles.tableRow}>
              {/* <Text style={styles.tableCell}>{index + 1}</Text> */}
              <Text style={styles.tableCell}>
                {report.student.first_name} {report.student.last_name}
              </Text>
              <Text style={styles.tableCell}>
                {report.student.admission_number}
              </Text>
              <Text style={styles.tableCell}>
              {report.overall_grading.mean_points}
              </Text>
              <Text style={styles.tableCell}>
                {report.overall_grading.mean_grade}
              </Text>
              <Text style={styles.tableCellLast}>
                {report.overall_grading.position}
              </Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};
