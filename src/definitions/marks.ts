export interface MarksInterface {
  id: number;
  grade: string;
  points: number;
  remarks: string;
  student: {
    id: number;
    created_at: string;
    updated_at: string;
    first_name: string;
    last_name: string;
    admission_number: string;
    birth_date: string;
    gender: string;
    admission_type: string;
    class_level: number;
  };
  student_subject: {
    id: number;
    student: {
      id: number;
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
 
  };
  term:{
    created_at: string;
    updated_at: string;
    id:number;
    calendar_year:number;
    term:string;
  }
  cat_mark: number;
  exam_mark: number;
  total_score: number;
}

export interface Marks{
    id: number;
    grade: string;
    points: number;
    remarks: string;
    student: {
      id: number;
      created_at: string;
      updated_at: string;
      first_name: string;
      last_name: string;
      admission_number: string;
      birth_date: string;
      gender: string;
      admission_type: string;
      class_level: number;
    };
    student_subject: {
      id: number;
      student: {
        id: number;
        created_at: string;
        updated_at: string;
        first_name: string;
        last_name: string;
        admission_number: string;
        birth_date: string;
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
    };
    term: {
      id: number;
      created_at: string;
      updated_at: string;
      term: string;
      calendar_year: number;
    };
    cat_mark: number;
    exam_mark: number;
    total_score: number;
  }
export interface TermData{
  term:string;
  mean_marks:string;
}
export interface Report {
  student: {
    id: number;
    first_name: string;
    last_name: string;
    birth_date: string;
    gender: string;
    admission_number: string;
    class_level: {
      id: number;
      stream: {
        id: number;
        name: string;
      };
      name: string;
      level: number;
      calendar_year:number;
    };
    admission_type: string;
    created_at: string;
  };
  overall_grading: {
    mean_grade: string;
    mean_points: number;
    mean_remarks: string;
    mean_marks: string;
    grand_total:number;
    total_points:number;
    total_marks:number;
    position:number;
    kcpe_average:number;
    principal_remarks:string;
  };
  marks: Marks[];
  term_data:TermData[];
}
