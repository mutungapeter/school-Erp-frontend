export interface Student {
    id: number;
    first_name: string;
    last_name: string;
    admission_number: string;
    birth_date: string;
    gender: string;
    admission_type: string;
    class_level: {
      id: number;
      stream:{
        id:number;
        name: string;
      }
      form_level:{
        id:number;
        name:string;
        level: number;
        streams_count: number;
      }
    },
    created_at:string;
  }