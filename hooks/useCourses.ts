import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { CourseWithDetails } from '../types';

export function useCourses() {
  const [courses, setCourses] = useState<CourseWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchCourses(); }, []);

  async function fetchCourses() {
    setLoading(true);
    const { data } = await supabase
      .from('courses')
      .select(`*, medicine:medicines(*), schedules(*)`)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    setCourses(data || []);
    setLoading(false);
  }

  async function addCourse(
    medicine_id: string,
    dose: string,
    total_qty: number | null,
    start_date: string,
    reminder_times: string[]
  ) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: course, error } = await supabase
      .from('courses')
      .insert({
        user_id: user.id,
        medicine_id,
        dose,
        total_qty,
        remaining_qty: total_qty,
        start_date
      })
      .select()
      .single();

    if (error || !course) return null;

    const scheduleRows = reminder_times.map(t => ({
      course_id: course.id,
      user_id: user.id,
      reminder_time: t,
    }));

    await supabase.from('schedules').insert(scheduleRows);
    await fetchCourses();
    return course;
  }

  async function logDose(schedule_id: string, status: 'taken' | 'skipped') {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('dose_logs').insert({
      schedule_id,
      user_id: user.id,
      scheduled_at: new Date().toISOString(),
      status,
    });
  }

  return { courses, loading, addCourse, logDose, refetch: fetchCourses };
}
