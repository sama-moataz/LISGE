
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, PlusCircle, Edit, Trash2, ShieldAlert, School2 } from 'lucide-react';
import { getPreCollegeCourses } from '@/lib/firestoreService'; 
import type { PreCollegeCourse } from '@/types';
import { useToast } from "@/hooks/use-toast";
import IconByName from '@/components/IconByName';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { format } from 'date-fns';
import { handleDeletePreCollegeCourseAction } from './actions';

export default function AdminPreCollegeCoursesPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [preCollegeCourses, setPreCollegeCourses] = useState<PreCollegeCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPreCollegeCourses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getPreCollegeCourses();
      setPreCollegeCourses(data);
    } catch (err: any) {
      setError(err.message || "Failed to load pre-college courses.");
      toast({ title: "Error", description: err.message || "Failed to load pre-college courses.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.replace('/auth/login?redirect=/admin/pre-college');
      } else if (!isAdmin) {
        toast({ title: "Access Denied", description: "You do not have permission to view this page.", variant: "destructive" });
        router.replace('/dashboard');
      } else {
        fetchPreCollegeCourses();
      }
    }
  }, [user, isAdmin, authLoading, router, toast]);

  const handleDelete = async (id: string, name: string) => {
    const result = await handleDeletePreCollegeCourseAction(id, name);
    if (result.success) {
      toast({ title: "Success", description: `Pre-College Course "${result.name}" deleted successfully.` });
      fetchPreCollegeCourses(); 
    } else {
      toast({ title: "Error Deleting", description: result.error || `Failed to delete course "${result.name}".`, variant: "destructive" });
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      if (date instanceof Date && !isNaN(date.valueOf())) {
        return format(date, "MMM d, yyyy");
      }
      return 'Invalid Date';
    } catch (e) {
      return 'Invalid Date';
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading pre-college courses management...</p>
      </div>
    );
  }

  if (!isAdmin && !authLoading) {
     return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)] text-center p-4">
        <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold text-destructive mb-2">Access Denied</h1>
        <p className="text-muted-foreground mb-6">You do not have the necessary permissions to access this page.</p>
        <Button onClick={() => router.push('/dashboard')}>Go to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-headline">Manage Pre-College Courses</CardTitle>
            <CardDescription>Add, edit, or delete pre-college courses.</CardDescription>
          </div>
          <Button asChild>
            <Link href="/admin/pre-college/new">
              <PlusCircle className="mr-2 h-5 w-5" /> Add New Course
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {error && <p className="text-destructive mb-4">{error}</p>}
          {preCollegeCourses.length === 0 && !isLoading && !error && (
            <p className="text-center text-muted-foreground py-4">No pre-college courses found. Add one to get started!</p>
          )}
          {preCollegeCourses.length > 0 && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Icon</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Institution</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {preCollegeCourses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell>
                        <IconByName name={course.iconName} className="h-6 w-6 text-accent" fallbackIcon={School2}/>
                      </TableCell>
                      <TableCell className="font-medium">{course.name}</TableCell>
                      <TableCell>{course.institution}</TableCell>
                      <TableCell>{course.location}</TableCell>
                      <TableCell>{formatDate(course.createdAt)}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/pre-college/edit/${course.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the course
                                <span className="font-semibold"> "{course.name}"</span> by <span className="font-semibold">{course.institution}</span>.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(course.id, course.name)}>
                                Yes, delete course
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
