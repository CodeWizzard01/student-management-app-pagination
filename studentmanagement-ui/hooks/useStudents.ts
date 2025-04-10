import { useState, useCallback, useEffect } from 'react';
import { Student, PaginatedResponse } from '../types/Student';

type SearchParams = {
  name?: string;
  email?: string;
  phoneNumber?: string;
  department?: string;
  enrollmentNumber?: string;
};

type SortOption = {
  field: string;
  direction: 'asc' | 'desc';
};

type PaginationType = 'offset' | 'cursor';

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [pageInfo, setPageInfo] = useState<{
    totalElements: number;
    totalPages: number;
    currentPage: number;
  }>({
    totalElements: 0,
    totalPages: 0,
    currentPage: 0,
  });
  const [searchParams, setSearchParams] = useState<SearchParams>({});
  const [sortOption, setSortOption] = useState<SortOption | null>(null);
  
  // New states for cursor pagination
  const [paginationType, setPaginationType] = useState<PaginationType>('offset');
  const [cursor, setCursor] = useState<number | null>(null);

  // Reset pagination when search, sort or pagination type changes
  useEffect(() => {
    resetStudents();
  }, [searchParams, sortOption, paginationType]);

  const buildQueryParams = useCallback(() => {
    const params = new URLSearchParams();
    
    if (paginationType === 'offset') {
      // Offset pagination params
      params.append('page', page.toString());
      params.append('size', '4');
      
      // Add sort param if it exists
      if (sortOption) {
        params.append('sort', `${sortOption.field},${sortOption.direction}`);
      }
    } else {
      // Cursor pagination params
      if (cursor) {
        params.append('cursor', cursor.toString());
      }
      params.append('size', '4');
    }
    
    // Add search params if they exist (used by both pagination types)
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    
    return params.toString();
  }, [page, searchParams, sortOption, paginationType, cursor]);

  const fetchStudents = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const queryString = buildQueryParams();
      const endpoint = paginationType === 'offset' 
        ? `http://localhost:8080/api/students?${queryString}`
        : `http://localhost:8080/api/students/cursor?${queryString}`;
      
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      if (paginationType === 'offset') {
        // Handle offset pagination response
        const data: PaginatedResponse<Student> = await response.json();
        
        setStudents(prevStudents => page === 0 ? data.content : [...prevStudents, ...data.content]);
        setPageInfo({
          totalElements: data.totalElements,
          totalPages: data.totalPages,
          currentPage: data.number,
        });
        
        setPage(prevPage => prevPage + 1);
        setHasMore(!data.last);
      } else {
        // Handle cursor pagination response
        const data: Student[] = await response.json();
        
        setStudents(prevStudents => cursor === null ? data : [...prevStudents, ...data]);
        
        // Set cursor to the ID of the last item for the next fetch
        if (data.length > 0) {
          const lastStudent = data[data.length - 1];
          setCursor(lastStudent.id);
          setHasMore(data.length >= 4); // Assuming 4 is our page size
        } else {
          setHasMore(false);
        }
        
        // For cursor pagination, we don't have exact totalElements/totalPages info
        if (cursor === null) {
          setPageInfo({
            totalElements: data.length,
            totalPages: data.length > 0 ? 1 : 0,
            currentPage: 0,
          });
        } else {
          setPageInfo(prev => ({
            ...prev,
            totalElements: prev.totalElements + data.length,
            currentPage: prev.currentPage + 1,
          }));
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, buildQueryParams, paginationType, cursor]);

  const resetStudents = useCallback(() => {
    setStudents([]);
    setPage(0);
    setCursor(null);
    setHasMore(true);
    setError(null);
  }, []);

  const updateSearchParams = useCallback((params: SearchParams) => {
    setSearchParams(params);
  }, []);

  const updateSort = useCallback((field: string, direction: 'asc' | 'desc') => {
    setSortOption({ field, direction });
  }, []);

  const clearFilters = useCallback(() => {
    setSearchParams({});
    setSortOption(null);
  }, []);
  
  const switchPaginationType = useCallback((type: PaginationType) => {
    if (type !== paginationType) {
      setPaginationType(type);
      // Reset data when switching pagination type
      resetStudents();
    }
  }, [paginationType, resetStudents]);

  return {
    students,
    loading,
    error,
    hasMore,
    pageInfo,
    searchParams,
    sortOption,
    paginationType,
    fetchStudents,
    resetStudents,
    updateSearchParams,
    updateSort,
    clearFilters,
    switchPaginationType
  };
}
