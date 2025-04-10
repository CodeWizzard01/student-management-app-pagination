'use client';

import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useStudents } from '../hooks/useStudents';
import StudentCard from './StudentCard';
import StudentFilters from './StudentFilters';

// Skeleton component for loading state
const StudentSkeleton = () => (
  <div className="p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700">
    <div className="flex items-center space-x-4">
      <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
      <div className="flex-1">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2 animate-pulse"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse"></div>
      </div>
    </div>
    <div className="mt-4 space-y-3">
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-pulse"></div>
    </div>
    <div className="mt-4 flex justify-end">
      <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
    </div>
  </div>
);

export function StudentList() {
  const { 
    students,
    loading, 
    error, 
    hasMore, 
    pageInfo, 
    fetchStudents,
    searchParams,
    sortOption,
    updateSearchParams,
    updateSort,
    clearFilters,
    paginationType,
    switchPaginationType
  } = useStudents();
  const { ref, inView } = useInView();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Initial load
  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load more when scrolled to bottom
  useEffect(() => {
    if (inView && hasMore && !loading) {
      fetchStudents();
    }
  }, [inView, hasMore, loading, fetchStudents]);

  if (error) {
    return (
      <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Students Directory
        </h2>
      </div>

      <StudentFilters 
        searchParams={searchParams}
        sortOption={sortOption}
        updateSearchParams={updateSearchParams}
        updateSort={updateSort}
        clearFilters={clearFilters}
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
        paginationType={paginationType}
        switchPaginationType={switchPaginationType}
      />

      {pageInfo.totalElements > 0 && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing {students.length} of {paginationType === 'offset' ? pageInfo.totalElements : 'many'} students
        </p>
      )}

      {/* Show skeletons during initial loading */}
      {loading && students.length === 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {[...Array(5)].map((_, index) => (
            <StudentSkeleton key={index} />
          ))}
        </div>
      ) : students.length === 0 && !loading ? (
        <div className="text-center py-10">
          <p className="text-gray-500 dark:text-gray-400">No students found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {students.map((student) => (
            <StudentCard key={student.id} student={student} />
          ))}
        </div>
      )}

      {/* Loading indicator and end of list message */}
      <div ref={ref} className="py-4">
        {loading && students.length > 0 && (
          <div className="grid grid-cols-1 gap-4">
            {[...Array(2)].map((_, index) => (
              <StudentSkeleton key={`scroll-skeleton-${index}`} />
            ))}
          </div>
        )}
        {!hasMore && students.length > 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400">
            You&apos;ve reached the end of the list
          </p>
        )}
      </div>
    </div>
  );
}

export default StudentList;
