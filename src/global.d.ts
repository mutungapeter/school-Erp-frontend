
declare module 'datatables.net' {
    interface DataTablesStatic {
      DataTable: any;
    }
  }
  
  interface JQuery {
    DataTable(options?: any): any;
  }
  