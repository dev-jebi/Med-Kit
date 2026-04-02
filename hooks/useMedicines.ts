import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Medicine } from '../types';

export function useMedicines() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchMedicines(); }, []);

  async function fetchMedicines() {
    setLoading(true);
    const { data } = await supabase
      .from('medicines')
      .select('*')
      .order('name', { ascending: true });
    setMedicines(data || []);
    setLoading(false);
  }

  async function addMedicine(
    name: string,
    description?: string,
    default_dose?: string,
    default_qty?: number
  ) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data, error } = await supabase
      .from('medicines')
      .insert({ user_id: user.id, name, description, default_dose, default_qty })
      .select()
      .single();
    if (!error) {
      setMedicines(prev =>
        [...prev, data].sort((a, b) => a.name.localeCompare(b.name))
      );
    }
    return data;
  }

  return { medicines, loading, addMedicine, refetch: fetchMedicines };
}
