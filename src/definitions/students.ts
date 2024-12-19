export interface Student {
    id: number;
    first_name: string;
    last_name: string;
    admission_number: string;
    kcpe_marks:number;
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
      calendar_year:number;
    },
    created_at:string;
  }

export interface StudentSubject{
  id:number;
  student: {
    id:number;
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

export interface StudentData {
  id: number;
  first_name: string;
  last_name: string;
  kcpe_marks: number;
  gender: string;
  admission_number: string;
  admission_type: string;
  created_at: string;
  class_level: {
    id: number;
    stream: string | null;
    form_level: {
      id: number;
      created_at: string;
      updated_at: string;
      name: string;
      level: number;
    };
  };
  subjects: {
    id: number;
    student: {
      id: number;
      created_at: string;
      updated_at: string;
      first_name: string;
      last_name: string;
      admission_number: string;
      kcpe_marks: number;
      gender: string;
      admission_type: string;
      class_level: number;
    };
    subject: {
      id: number;
      subject_name: string;
      subject_type: string;
      category: string;
    };
  }[];
}
