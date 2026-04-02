import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { useCourses } from '../../hooks/useCourses';
import { useAuth } from '../../hooks/useAuth';
import FAB from '../../components/FAB';
import AddMedicineSheet from '../../components/AddMedicineSheet';
import AddCourseSheet from '../../components/AddCourseSheet';
import { CourseWithDetails } from '../../types';

function getNextDose(course: CourseWithDetails): string {
  if (!course.schedules?.length) return 'No schedule';
  const now = new Date();
  const nowMins = now.getHours() * 60 + now.getMinutes();
  const sorted = [...course.schedules]
    .filter(s => s.is_active)
    .map(s => {
      const [h, m] = s.reminder_time.split(':').map(Number);
      return { time: s.reminder_time, mins: h * 60 + m, id: s.id };
    })
    .sort((a, b) => a.mins - b.mins);
  const next = sorted.find(s => s.mins > nowMins) || sorted[0];
  if (!next) return 'No schedule';
  const [h, m] = next.time.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${suffix}`;
}

function isDueSoon(course: CourseWithDetails): boolean {
  if (!course.schedules?.length) return false;
  const now = new Date();
  const nowMins = now.getHours() * 60 + now.getMinutes();
  return course.schedules.some(s => {
    const [h, m] = s.reminder_time.split(':').map(Number);
    const diff = h * 60 + m - nowMins;
    return diff >= 0 && diff <= 120;
  });
}

export default function HomeScreen() {
  const { courses, loading, logDose, refetch } = useCourses();
  const { profile } = useAuth();
  const [showAddMedicine, setShowAddMedicine] = useState(false);
  const [showAddCourse, setShowAddCourse] = useState(false);

  const dueSoon = courses.filter(isDueSoon);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}>

        <Text style={styles.greeting}>
          {profile?.name ? `Hey, ${profile.name} 👋` : 'MedKit'}
        </Text>
        <Text style={styles.date}>
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
        </Text>

        {dueSoon.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⏰ Due in next 2 hours</Text>
            {dueSoon.slice(0, 6).map(course => (
              <View key={course.id} style={styles.dueItem}>
                <View style={styles.dueInfo}>
                  <Text style={styles.dueName}>{course.medicine?.name}</Text>
                  <Text style={styles.dueTime}>{getNextDose(course)}</Text>
                </View>
                <TouchableOpacity
                  style={styles.takenBtn}
                  onPress={() => course.schedules[0] && logDose(course.schedules[0].id, 'taken')}>
                  <Text style={styles.takenBtnText}>✔</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💊 All Active Courses</Text>
          {courses.length === 0 && (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>No active courses</Text>
              <Text style={styles.emptyHint}>Tap + to add a course</Text>
            </View>
          )}
          {courses.map(course => (
            <View key={course.id} style={styles.courseCard}>
              <View style={styles.courseHeader}>
                <Text style={styles.courseName}>{course.medicine?.name}</Text>
                <Text style={styles.courseDose}>{course.dose}</Text>
              </View>
              <Text style={styles.courseNext}>Next dose: {getNextDose(course)}</Text>
              {course.total_qty != null && (
                <View style={styles.progressRow}>
                  <View style={styles.progressBar}>
                    <View style={[
                      styles.progressFill,
                      { width: `${Math.round(((course.remaining_qty || 0) / course.total_qty) * 100)}%` }
                    ]} />
                  </View>
                  <Text style={styles.progressText}>{course.remaining_qty}/{course.total_qty}</Text>
                </View>
              )}
              <View style={styles.courseActions}>
                <TouchableOpacity
                  style={styles.takeBtn}
                  onPress={() => course.schedules[0] && logDose(course.schedules[0].id, 'taken')}>
                  <Text style={styles.takeBtnText}>✔ Take</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.skipBtn}
                  onPress={() => course.schedules[0] && logDose(course.schedules[0].id, 'skipped')}>
                  <Text style={styles.skipBtnText}>Skip</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <FAB onAddMedicine={() => setShowAddMedicine(true)} onAddCourse={() => setShowAddCourse(true)} />
      <AddMedicineSheet visible={showAddMedicine} onClose={() => setShowAddMedicine(false)} />
      <AddCourseSheet visible={showAddCourse} onClose={() => setShowAddCourse(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f4f0' },
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 100 },
  greeting: { fontSize: 26, fontWeight: '800', color: '#1a1a1a', letterSpacing: -0.5 },
  date: { fontSize: 13, color: '#9ca3af', marginTop: 2, marginBottom: 24 },
  section: { marginBottom: 28 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#374151', marginBottom: 12 },
  dueItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#fff', borderRadius: 10, padding: 12, marginBottom: 8,
    borderLeftWidth: 3, borderLeftColor: '#3b6ef5',
  },
  dueInfo: { flex: 1 },
  dueName: { fontSize: 14, fontWeight: '700', color: '#1a1a1a' },
  dueTime: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  takenBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#3b6ef5', justifyContent: 'center', alignItems: 'center' },
  takenBtnText: { color: '#fff', fontWeight: '700' },
  courseCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e5e0d8' },
  courseHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  courseName: { fontSize: 16, fontWeight: '800', color: '#1a1a1a' },
  courseDose: { fontSize: 12, color: '#6b7280', fontWeight: '600' },
  courseNext: { fontSize: 12, color: '#6b7280', marginBottom: 10 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  progressBar: { flex: 1, height: 6, backgroundColor: '#f3f4f6', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#3b6ef5', borderRadius: 3 },
  progressText: { fontSize: 11, color: '#9ca3af', fontWeight: '600' },
  courseActions: { flexDirection: 'row', gap: 8 },
  takeBtn: { flex: 1, backgroundColor: '#3b6ef5', borderRadius: 8, padding: 10, alignItems: 'center' },
  takeBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  skipBtn: { flex: 1, backgroundColor: '#f3f4f6', borderRadius: 8, padding: 10, alignItems: 'center' },
  skipBtnText: { color: '#6b7280', fontWeight: '600', fontSize: 13 },
  emptyBox: { backgroundColor: '#fff', borderRadius: 12, padding: 32, alignItems: 'center', borderWidth: 1, borderColor: '#e5e0d8', borderStyle: 'dashed' },
  emptyText: { fontSize: 15, fontWeight: '700', color: '#9ca3af' },
  emptyHint: { fontSize: 12, color: '#d1d5db', marginTop: 4 },
});
