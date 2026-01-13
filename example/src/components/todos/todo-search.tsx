'use client';

import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { Input } from '@/components/ui/input';

type TodoSearchProps = {
  onSearchChange: (query: string) => void;
  placeholder?: string;
};

export function TodoSearch({
  onSearchChange,
  placeholder = 'Search todos...',
}: TodoSearchProps) {
  const [value, setValue] = useState('');

  const debouncedSearch = useDebouncedCallback((query: string) => {
    onSearchChange(query);
  }, 300);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    debouncedSearch(newValue);
  };

  // Clear search when component unmounts
  useEffect(
    () => () => {
      onSearchChange('');
    },
    [onSearchChange]
  );

  return (
    <div className="relative">
      <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        className="pl-9"
        onChange={handleChange}
        placeholder={placeholder}
        type="search"
        value={value}
      />
    </div>
  );
}
