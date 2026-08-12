import Link from 'next/link';
import css from './SidebarNotes.module.css';

export const TAGS = ['Work', 'Personal', 'Todo', 'Shopping', 'Meeting'];

const NotesSidebar = async () => {
  return (
    <div className={css.container}>
      <ul className={css.menuList}>
        <li className={css.menuItem}>
          <Link href={`/notes/filter/all`} className={css.menuLink}>
            All notes
          </Link>
        </li>
        {TAGS.map((category: string, index) => (
          <li key={`${category}-${index}`} className={css.menuItem}>
            <Link href={`/notes/filter/${category}`} className={css.menuLink}>
              {category}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotesSidebar;
