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

export interface StudentData {
  student: {
    first_name: string;
    last_name: string;
    birth_date: string;
    gender: string;
    admission_number: string;
    class_level: number;
    admission_type: string;
  };
  subject: {
    id: number;
    subject_name: string;
    subject_type: string;
    category: string;
  };
}
