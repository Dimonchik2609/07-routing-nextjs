'use client';
import NoteList from '@/components/NoteList/NoteList';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import { fetchNotes } from '@/lib/api';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import { useState } from 'react';
import css from '@/app/notes/filter/all/NotesPage.module.css';

type NotesClientProps = {
  initialPage: number;
  initialText: string;
  tag?: 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';
};

function NotesClient({ initialPage, initialText, tag }: NotesClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [text, setText] = useState(initialText);
  const [searchQuery, setSearchQuery] = useState(initialText);

  const { data, isError, error } = useQuery({
    queryKey: ['notes', currentPage, searchQuery, tag],
    queryFn: () => fetchNotes(searchQuery, currentPage, 12, tag), // порядок аргументів виправлений
    placeholderData: keepPreviousData,
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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

          <button onClick={openModal} className={css.button}>
            Create note +
          </button>
        </header>
      </div>

      {isError && <p>Could not fetch the list of notes. {error.message}</p>}
      {data?.notes && <NoteList notes={data.notes} />}

      {isModalOpen && (
        <Modal closeWindow={closeModal}>
          <NoteForm onCancel={closeModal} />
        </Modal>
      )}
    </>
  );
}

export default NotesClient;
