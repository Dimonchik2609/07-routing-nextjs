'use client';

import { useEffect, useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';

import NoteList from '@/components/NoteList/NoteList';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import { fetchNotes, type TagType } from '@/lib/api';
import css from './NotesPage.module.css';

type NotesClientProps = {
  initialPage: number;
  initialText: string;
  tag?: TagType;
};

export default function NotesClient({
  initialPage,
  initialText,
  tag,
}: NotesClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [text, setText] = useState(initialText);
  const [searchQuery, setSearchQuery] = useState(initialText);

  useEffect(() => {
    setCurrentPage(1);
    setText('');
    setSearchQuery('');
  }, [tag]);

  const { data, isError, error } = useQuery({
    queryKey: ['notes', currentPage, searchQuery, tag],
    queryFn: () => fetchNotes(searchQuery, currentPage, 12, tag),
    placeholderData: keepPreviousData,
  });

  const totalPages = data?.totalPages ?? 0;

  const handleChange = useDebouncedCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, 1000);

  return (
    <>
      <div className={css.app}>
        <header className={css.toolbar}>
          <SearchBox
            value={text}
            onSearchChange={(value: string) => {
              setText(value);
              handleChange(value);
            }}
          />

          {totalPages > 0 && (
            <Pagination
              pageCount={totalPages}
              currentPage={currentPage - 1}
              onPageChange={(selectedItem: { selected: number }) =>
                setCurrentPage(selectedItem.selected + 1)
              }
            />
          )}

          <button
            onClick={() => setIsModalOpen(true)}
            className={css.button}
          >
            Create note +
          </button>
        </header>
      </div>

      {isError && <p>Could not fetch the list of notes. {error.message}</p>}
      {data?.notes && <NoteList notes={data.notes} />}

      {isModalOpen && (
        <Modal closeWindow={() => setIsModalOpen(false)}>
          <NoteForm onCancel={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </>
  );
}
