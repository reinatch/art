"use client";
import { useTranslations } from "next-intl";

interface SearchFormProps {
  query: string;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ query, onSearch, onSubmit }) => {
  const t = useTranslations("Search");

  return (
    <div className="flex flex-end">
      <form className="w-11/12" onSubmit={onSubmit} action="">
        <input
          name="query"
          type="text"
          value={query}
          onChange={onSearch}
          placeholder=""
          className="border-b border-black outline-none w-full px-10 py-2 focus:outline-none focus:ring-none focus:border-blue-700"
        />
      </form>
      <button className="w-1/12" type="submit">
        {t("submit")}
      </button>
    </div>
  );
};

export default SearchForm;
