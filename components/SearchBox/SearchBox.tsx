import css from "./SearchBox.module.css";
import { useState } from "react";

interface SearchBoxProps {
  value: string; // тепер компонент приймає value ззовні
  onSearchChange: (search: string) => void;
}

export default function SearchBox({ value, onSearchChange }: SearchBoxProps) {
  const [valueInput, setValueInput] = useState(value);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearch = event.target.value;
    setValueInput(newSearch);
    onSearchChange(newSearch);
  };

  return (
    <input
      className={css.input}
      type="text"
      placeholder="Search notes"
      onChange={handleChange}
      value={valueInput}
    />
  );
}
