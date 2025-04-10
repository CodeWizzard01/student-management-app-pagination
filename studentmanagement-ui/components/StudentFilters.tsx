'use client';

import { useState, useEffect } from 'react';
import { FaSearch, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface SearchParams {
  name?: string;
  email?: string;
  phoneNumber?: string;
  department?: string;
  enrollmentNumber?: string;
}

interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
}

type PaginationType = 'offset' | 'cursor';

interface StudentFiltersProps {
  searchParams: SearchParams;
  sortOption: SortOption | null;
  updateSearchParams: (params: SearchParams) => void;
  updateSort: (field: string, direction: 'asc' | 'desc') => void;
  clearFilters: () => void;
  isFilterOpen: boolean;
  setIsFilterOpen: (isOpen: boolean) => void;
  paginationType: PaginationType;
  switchPaginationType: (type: PaginationType) => void;
}

export function StudentFilters({
  searchParams,
  sortOption,
  updateSearchParams,
  updateSort,
  clearFilters,
  isFilterOpen,
  setIsFilterOpen,
  paginationType,
  switchPaginationType
}: StudentFiltersProps) {
  const [searchForm, setSearchForm] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    department: '',
    enrollmentNumber: '',
  });

  // Reset search form when filters are cleared
  useEffect(() => {
    if (Object.values(searchParams).every(param => !param)) {
      setSearchForm({
        name: '',
        email: '',
        phoneNumber: '',
        department: '',
        enrollmentNumber: '',
      });
    }
  }, [searchParams]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter out empty values
    const filteredParams = Object.fromEntries(
      Object.entries(searchForm).filter(([_, value]) => value.trim() !== '')
    );
    updateSearchParams(filteredParams);
  };

  const handleSortChange = (field: string) => {
    if (sortOption?.field === field) {
      // Toggle direction if same field
      updateSort(field, sortOption.direction === 'asc' ? 'desc' : 'asc');
    } else {
      // Default to ascending for new field
      updateSort(field, 'asc');
    }
  };
  
  const getSortIcon = (field: string) => {
    if (sortOption?.field !== field) return <span className="text-gray-400"><FaSort /></span>;
    return sortOption.direction === 'asc' ? 
      <span className="text-blue-500"><FaSortUp /></span> : 
      <span className="text-blue-500"><FaSortDown /></span>;
  };

  const hasActiveFilters = Object.values(searchParams).some(value => value) || sortOption !== null;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            variant="outline"
            size="sm"
            className="flex items-center"
          >
            <FaSearch className="mr-2" />
            {isFilterOpen ? 'Hide Filters' : 'Search & Filter'}
          </Button>
          
          {hasActiveFilters && (
            <Button 
              onClick={clearFilters}
              variant="destructive"
              size="sm"
            >
              Clear Filters
            </Button>
          )}
          
          {/* Pagination type toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Pagination: {paginationType === 'offset' ? 'Offset' : 'Cursor'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => switchPaginationType('offset')}>
                Offset Pagination
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => switchPaginationType('cursor')}>
                Cursor Pagination
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Search & Sort UI */}
      {isFilterOpen && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <form onSubmit={handleSearchSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={searchForm.name}
                  onChange={handleSearchChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  value={searchForm.email}
                  onChange={handleSearchChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={searchForm.phoneNumber}
                  onChange={handleSearchChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  name="department"
                  value={searchForm.department}
                  onChange={handleSearchChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="enrollmentNumber">Enrollment Number</Label>
                <Input
                  id="enrollmentNumber"
                  name="enrollmentNumber"
                  value={searchForm.enrollmentNumber}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-2">
              {/* Only show sort options for offset pagination */}
              {paginationType === 'offset' ? (
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant={sortOption?.field === 'name' ? "secondary" : "outline"}
                    onClick={() => handleSortChange('name')}
                  >
                    Name {getSortIcon('name')}
                  </Button>
                  
                  <Button
                    type="button"
                    variant={sortOption?.field === 'department' ? "secondary" : "outline"}
                    onClick={() => handleSortChange('department')}
                  >
                    Department {getSortIcon('department')}
                  </Button>
                  
                  <Button
                    type="button"
                    variant={sortOption?.field === 'joiningDate' ? "secondary" : "outline"}
                    onClick={() => handleSortChange('joiningDate')}
                  >
                    Join Date {getSortIcon('joiningDate')}
                  </Button>
                </div>
              ) : (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Note: Sorting is not available with cursor pagination (sorted by ID desc)
                </div>
              )}
              
              <Button type="submit">Search</Button>
            </div>
          </form>
          
          {/* Active filters display */}
          {hasActiveFilters && (
            <div className="mt-4 flex flex-wrap gap-2">
              {Object.entries(searchParams).map(([key, value]) => 
                value ? (
                  <div key={key} className="bg-blue-50 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs px-2 py-1 rounded-full">
                    {key}: {value}
                  </div>
                ) : null
              )}
              
              {sortOption && paginationType === 'offset' && (
                <div className="bg-blue-50 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs px-2 py-1 rounded-full">
                  Sort: {sortOption.field} ({sortOption.direction})
                </div>
              )}
              
              <div className="bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs px-2 py-1 rounded-full">
                Pagination: {paginationType}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default StudentFilters;
