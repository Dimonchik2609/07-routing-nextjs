import { fetchNotes } from '@/lib/api';
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from '@tanstack/react-query';
import NotesClient from '@/app/notes/filter/all/Notes.client';

type NoteDetailsProps = {
  params?: {
    text?: string;
    currentPage?: number;
    tag?: 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';
  };
};

const App = async ({ params }: NoteDetailsProps) => {
  const currentPage = params?.currentPage ?? 1;
  const text = params?.text ?? '';
  const tag = params?.tag ?? undefined;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', currentPage, text, tag],
    queryFn: () => fetchNotes(text, currentPage, 12, tag), // тепер аргументи узгоджені
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient initialPage={currentPage} initialText={text} tag={tag} />
    </HydrationBoundary>
  );
};

export default App;
