import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';
import { Task, TaskService } from '../types';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn(
    '[Supabase] Variáveis não definidas. Copie .env.example para .env, ' +
      'preencha as chaves e reinicie com: npx expo start -c'
  );
}

// Os fallbacks evitam que o app quebre no import antes de você configurar o .env.
export const supabase = createClient(
  SUPABASE_URL || 'https://configure-o-env.supabase.co',
  SUPABASE_ANON_KEY || 'chave-nao-configurada',
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);

export const supabaseTaskService: TaskService = {
  async list() {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data ?? []).map((row) => ({
      id: row.id,
      title: row.title,
      done: row.done,
      createdAt: row.created_at,
    })) as Task[];
  },

  async add(title) {
    const { error } = await supabase.from('tasks').insert({ title, done: false });
    if (error) throw error;
  },

  async toggle(id, done) {
    const { error } = await supabase.from('tasks').update({ done }).eq('id', id);
    if (error) throw error;
  },

  async remove(id) {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) throw error;
  },
};