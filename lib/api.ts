import axios from 'axios';
import { Note } from '@/types/note';

// Токен з .env.local
const apiKey = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

export interface NoteHttpResp {
  notes: Note[];
  totalPages: number;
}

// Отримати список нотаток
export async function fetchNotes(
  search: string,
  page: number = 1,
  perPage: number = 12,
  tag?: string
): Promise<NoteHttpResp> {
  const { data } = await axios.get<NoteHttpResp>(
    'https://notehub-public.goit.study/api/notes',
    {
      params: {
        search,
        page,
        perPage,
        tag, // тепер тег теж передається
      },
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    }
  );
  return data;
}

// Типи для створення нотатки
export interface NoteTag {
  title: string;
  content: string;
  tag: TagType;
}
export type TagType = 'Todo' | 'Work' | 'Shopping' | 'Personal' | 'Meeting';

// Створити нову нотатку
export const createNote = async (noteData: NoteTag): Promise<Note> => {
  const { data } = await axios.post<Note>(
    'https://notehub-public.goit.study/api/notes',
    noteData,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    }
  );
  return data;
};

// Видалити нотатку
export const deleteNote = async (NoteId: string): Promise<Note> => {
  const { data } = await axios.delete<Note>(
    `https://notehub-public.goit.study/api/notes/${NoteId}`,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    }
  );
  return data;
};

// Отримати нотатку за ID
export const getSingleNote = async (NoteId: string): Promise<Note> => {
  const { data } = await axios.get<Note>(
    `https://notehub-public.goit.study/api/notes/${NoteId}`,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    }
  );
  return data;
};
