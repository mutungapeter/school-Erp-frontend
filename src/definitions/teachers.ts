export interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    role: string;
  }
  
export  interface Subject {
    teacher: number;
    subject: string;
    class_level: string;
  }
  
export interface Stream {
    id: number;
    name: string;
  }
  
export interface FormLevel {
    name: string;
    level: number;
    streams_count: number;
  }
  
export interface Class {
    id: number;
    stream: Stream | null;
    form_level: FormLevel;
  }
  
export  interface Teacher {
    id: number;
    staff_no: string;
    user: User;
    subjects: Subject[];
    classes: Class[];
  }
  