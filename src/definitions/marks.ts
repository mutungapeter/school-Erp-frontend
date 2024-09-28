export interface MarksInterface {
  id: number;
  grade: string;
  points: number;
  remakrs: string;
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
  cat_mark: number;
  exam_mark: number;
  total_score: number;
}
