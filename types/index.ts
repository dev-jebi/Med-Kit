export type Profile = {
  id: string;
  name: string;
  age: number;
  timezone: string;
  breakfast_start: string;
  breakfast_end: string;
  lunch_start: string;
  lunch_end: string;
  dinner_start: string;
  dinner_end: string;
  expo_push_token: string | null;
  created_at: string;
};

export type Medicine = {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  default_dose: string | null;
  default_qty: number | null;
  created_at: string;
};

export type Course = {
  id: string;
  user_id: string;
  medicine_id: string;
  dose: string;
  total_qty: number | null;
  remaining_qty: number | null;
  start_date: string;
  is_active: boolean;
  created_at: string;
  medicine?: Medicine;
};

export type Schedule = {
  id: string;
  course_id: string;
  user_id: string;
  reminder_time: string;
  is_active: boolean;
  created_at: string;
  course?: Course;
};

export type DoseLog = {
  id: string;
  schedule_id: string;
  user_id: string;
  scheduled_at: string;
  status: 'taken' | 'skipped' | 'missed';
  responded_at: string;
};

export type CourseWithDetails = Course & {
  medicine: Medicine;
  schedules: Schedule[];
};
