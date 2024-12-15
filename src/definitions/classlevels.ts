export interface ClassLevel {
    id: number;
    stream: {
      name: string;
    };
    form_level: {
      id: number;
      created_at: string;
      updated_at: string;
      name: string;
      level: number
    };
    calendar_year:string;
    
   
  }