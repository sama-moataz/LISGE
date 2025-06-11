
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, PlusCircle, Edit, Trash2, ShieldAlert, Briefcase } from 'lucide-react';
import { getSummerPrograms } from '@/lib/firestoreService'; 
import type { SummerProgram } from '@/types';
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
import { format, isValid } from 'date-fns';
import { handleDeleteSummerProgramAction } from './actions'; 

export default function AdminSummerProgramsPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [summerPrograms, setSummerPrograms] = useState<SummerProgram[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummerPrograms = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getSummerPrograms();
      setSummerPrograms(data);
    } catch (err: any) {
      setError(err.message || "Failed to load summer programs.");
      toast({ title: "Error", description: err.message || "Failed to load summer programs.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.replace('/auth/login?redirect=/admin/programs');
      } else if (!isAdmin) {
        toast({ title: "Access Denied", description: "You do not have permission to view this page.", variant: "destructive" });
        router.replace('/dashboard');
      } else {
        fetchSummerPrograms();
      }
    }
  }, [user, isAdmin, authLoading, router, toast]);

  const handleDelete = async (id: string, name: string) => {
    const result = await handleDeleteSummerProgramAction(id, name);
    if (result.success) {
      toast({ title: "Success", description: `Summer Program "${result.name}" deleted successfully.` });
      fetchSummerPrograms(); 
    } else {
      toast({ title: "Error Deleting", description: result.error || `Failed to delete summer program "${result.name}".`, variant: "destructive" });
    }
  };
  
  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : (timestamp instanceof Date ? timestamp : new Date(timestamp));
      if (date instanceof Date && isValid(date)) {
        return format(date, "MMM d, yyyy");
      }
      return 'Invalid Date';
    } catch (e) {
      console.error("Error formatting date:", e, "Timestamp was:", timestamp);
      return 'Invalid Date';
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading summer programs management...</p>
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
            <CardTitle className="text-2xl font-headline">Manage Summer Programs</CardTitle>
            <CardDescription>Add, edit, or delete summer programs.</CardDescription>
          </div>
          <Button asChild>
            <Link href="/admin/programs/new">
              <PlusCircle className="mr-2 h-5 w-5" /> Add New Summer Program
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {error && <p className="text-destructive mb-4">{error}</p>}
          {summerPrograms.length === 0 && !isLoading && !error && (
            <p className="text-center text-muted-foreground py-4">No summer programs found. Add one to get started!</p>
          )}
          {summerPrograms.length > 0 && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Icon</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Focus Area</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {summerPrograms.map((program) => (
                    <TableRow key={program.id}>
                      <TableCell>
                        <IconByName name={program.iconName} className="h-6 w-6 text-accent" fallbackIcon={Briefcase}/>
                      </TableCell>
                      <TableCell className="font-medium">{program.name}</TableCell>
                      <TableCell>{program.location}</TableCell>
                      <TableCell>{Array.isArray(program.focusArea) ? program.focusArea.join(', ') : program.focusArea || 'N/A'}</TableCell>
                      <TableCell>{formatDate(program.createdAt)}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/programs/edit/${program.id}`}>
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
                                This action cannot be undone. This will permanently delete the summer program
                                <span className="font-semibold"> "{program.name}"</span>.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(program.id, program.name)}>
                                Yes, delete program
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
