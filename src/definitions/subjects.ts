export interface Subject {

      id: number;
      created_at: string;
      updated_at: string;
      subject_name: string;
      subject_type: string;
      category: {
        id: number;
        name: string;
      };
        
   
  }