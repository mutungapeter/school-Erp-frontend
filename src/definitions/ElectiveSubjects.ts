// types.ts

export interface ClassLevel {
    id: number;
    stream?: {
      name: string;
    } | null;
    // form_level: {
    //   id: number;
    //   created_at: string;
    //   updated_at: string;
    //   name: string;
    //   level: number;
    // };
    name:string;
    level:number;
  }
  
  export interface Subject {
    id: number;
    category: {
      id: number;
      created_at: string;
      updated_at: string;
      name: string;
    };
    class_levels: ClassLevel[]; 
    created_at: string;
    updated_at: string;
    subject_name: string;
    subject_type: string;
  }
  
  export interface SubjectWithClassLevels {
    subject: Subject;
    class_levels: ClassLevel[]; 
  }
  