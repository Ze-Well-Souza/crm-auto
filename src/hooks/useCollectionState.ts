import { useState, useEffect, useMemo } from 'react';
import { logger } from '@/lib/logger';

interface UseCollectionStateOptions {
  storageKey: string;
  itemsPerPage?: number;
}

export const useCollectionState = <T extends { id: string }>({
  storageKey,
  itemsPerPage = 10,
}: UseCollectionStateOptions) => {
  const [items, setItems] = useState<T[]>([]);
  const [filteredItems, setFilteredItems] = useState<T[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        setItems(parsed);
        setFilteredItems(parsed);
      }
    } catch (err) {
      logger.error('Error loading from localStorage:', err);
    }
  }, [storageKey]);

  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(items));
    }
  }, [items, storageKey]);

  useEffect(() => {
    if (searchTerm) {
      const lowercaseSearch = searchTerm.toLowerCase();
      const filtered = items.filter((item) =>
        JSON.stringify(item).toLowerCase().includes(lowercaseSearch)
      );
      setFilteredItems(filtered);
      setCurrentPage(1);
    } else {
      setFilteredItems(items);
    }
  }, [searchTerm, items]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredItems, currentPage, itemsPerPage]);

  const addItem = (item: T) => { setItems(prev => [...prev, item]); setFilteredItems(prev => [...prev, item]); };
  const updateItem = (id: string, updates: Partial<T>) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
    setFilteredItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };
  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    setFilteredItems(prev => prev.filter(item => item.id !== id));
  };

  return {
    items, filteredItems, paginatedItems, isLoading, error, searchTerm, setSearchTerm,
    currentPage, setCurrentPage, itemsPerPage, totalPages, addItem, updateItem, deleteItem,
    setItems, setFilteredItems,
  };
};