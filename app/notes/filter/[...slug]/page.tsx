import { fetchNotes } from '@/lib/api';
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from '@tanstack/react-query';
import NotesClient from './Notes.client';
import type { TagType } from '@/lib/api';

type PageProps = {
  params: Promise<{
    slug: string[];
  }>;
};

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const currentPage = 1;
  const text = '';
  const tag = slug[0] === 'all' ? undefined : (slug[0] as TagType);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', currentPage, text, tag],
    queryFn: () => fetchNotes(text, currentPage, 12, tag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient
        initialPage={currentPage}
        initialText={text}
        tag={tag}
      />
    </HydrationBoundary>
  );
}
