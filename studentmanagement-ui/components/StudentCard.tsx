import { Student } from '../types/Student';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from './ui/badge';

interface StudentCardProps {
  student: Student;
}

export function StudentCard({ student }: StudentCardProps) {
  return (
    <Card className="transition-all hover:shadow-lg dark:border-gray-700 dark:bg-card dark:hover:border-gray-600">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold dark:text-white">
          {student.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-3 gap-y-1">
          <div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Email:</span>
            <p className="text-sm text-gray-700 dark:text-gray-200">{student.email}</p>
          </div>
          
          <div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Phone:</span>
            <p className="text-sm text-gray-700 dark:text-gray-200">{student.phoneNumber}</p>
          </div>
          
          <div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Department:</span>
            <br/>
            <Badge variant="default" className="mt-1 dark:bg-primary dark:hover:bg-primary/80">
              {student.department}
            </Badge>
          </div>
          
          <div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Enrollment:</span>
            <p className="text-sm text-gray-700 dark:text-gray-200">{student.enrollmentNumber}</p>
          </div>

          <div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Date of Birth:</span>
            <p className="text-sm text-gray-700 dark:text-gray-200">
              {new Date(student.dob).toLocaleDateString()}
            </p>
          </div>
          
          <div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Joined:</span>
            <p className="text-sm text-gray-700 dark:text-gray-200">
              {new Date(student.joiningDate).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div className="mt-1">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Address:</span>
          <p className="text-sm text-gray-700 dark:text-gray-200">{student.address}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default StudentCard;
