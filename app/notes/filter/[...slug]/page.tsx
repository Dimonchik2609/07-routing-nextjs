import { fetchNotes } from '@/lib/api';
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from '@tanstack/react-query';
import NotesClient from './Notes.client';

type PageProps = {
  params: {
    slug: string[]; // catch-all параметр
  };
};

const Page = async ({ params }: PageProps) => {
  const currentPage = 1; // можна додати логіку для сторінки з URL, якщо потрібно
  const text = '';       // пошуковий текст за замовчуванням
  const tag = params.slug?.[0] as
    | 'Todo'
    | 'Work'
    | 'Personal'
    | 'Meeting'
    | 'Shopping'
    | undefined;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', currentPage, text, tag],
    queryFn: () => fetchNotes(text, currentPage, 12, tag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient initialPage={currentPage} initialText={text} tag={tag} />
    </HydrationBoundary>
  );
};

export default Page;
