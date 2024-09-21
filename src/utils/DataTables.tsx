import { useEffect } from 'react';
import $ from 'jquery';
import 'datatables.net-dt/css/dataTables.dataTables.min.css';
import 'datatables.net';


interface ColumnDef {
    title: string; 
    data?: string | null; 
    orderable?: boolean; 
    searchable?: boolean; 
    className?: string; 
    render?: (data: any, type: string, row: any, meta: any) => string;
    visible?: boolean; 
    width?: string; 
    [key: string]: any; 
  }
  
export const useDataTable = (tableId:string, columnDefs: ColumnDef[]) => {
  useEffect(() => {
    
    const table = $(`#${tableId}`).DataTable({
      columns: columnDefs,
      destroy: true, 
    });


    return () => {
      if (table) {
        table.destroy();
      }
    };
  }, [tableId, columnDefs]);
};
