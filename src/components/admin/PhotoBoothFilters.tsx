
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Search } from 'lucide-react';

interface PhotoBoothFiltersProps {
  filters: {
    status: string;
    dateFrom: string;
    dateTo: string;
    searchTerm: string;
  };
  onFiltersChange: (filters: any) => void;
}

const PhotoBoothFilters: React.FC<PhotoBoothFiltersProps> = ({ filters, onFiltersChange }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label>Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search captions or names..."
                className="pl-10"
                value={filters.searchTerm}
                onChange={(e) => onFiltersChange(prev => ({ ...prev, searchTerm: e.target.value }))}
              />
            </div>
          </div>
          
          <div>
            <Label>Status</Label>
            <Select value={filters.status} onValueChange={(value) => onFiltersChange(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="featured">Featured</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>From Date</Label>
            <Input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => onFiltersChange(prev => ({ ...prev, dateFrom: e.target.value }))}
            />
          </div>
          
          <div>
            <Label>To Date</Label>
            <Input
              type="date"
              value={filters.dateTo}
              onChange={(e) => onFiltersChange(prev => ({ ...prev, dateTo: e.target.value }))}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PhotoBoothFilters;
