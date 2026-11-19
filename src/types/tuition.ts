
export interface Tuition {
  _id: string;
  title: string;
  subject: string;
  class?: string;
  medium?: string;
  location: string;
  salary: number;
  description: string;
  tutorId?: string;
  studentId?: string;
  status?: "active" | "pending" | "closed";
  createdAt?: string;
  updatedAt?: string;
}
