
"use client"; // Keep client for UI interactions, useAuth, etc.

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, PlusCircle, Edit, Trash2, ShieldAlert, ExternalLink } from 'lucide-react';
import { getScholarships } from '@/lib/firestoreService'; // Read uses client SDK
import type { Scholarship } from '@/types';
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
import { handleDeleteScholarshipAction } from './actions'; // Import the Server Action


export default function AdminScholarshipsPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchScholarships = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getScholarships(); // Read uses client SDK
      setScholarships(data);
    } catch (err: any) {
      setError(err.message || "Failed to load scholarships.");
      toast({ title: "Error", description: err.message || "Failed to load scholarships.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.replace('/auth/login?redirect=/admin/scholarships');
      } else if (!isAdmin) {
        toast({ title: "Access Denied", description: "You do not have permission to view this page.", variant: "destructive" });
        router.replace('/dashboard');
      } else {
        fetchScholarships();
      }
    }
  }, [user, isAdmin, authLoading, router, toast]);

  const handleDelete = async (id: string, name: string) => {
    // If you need to pass an ID token for server-side auth:
    // const idToken = await user?.getIdToken();
    // const result = await handleDeleteScholarshipAction(id, name, idToken); 
    // The Server Action 'handleDeleteScholarshipAction' would need to accept and verify this token.
    const result = await handleDeleteScholarshipAction(id, name);
    if (result.success) {
      toast({ title: "Success", description: `Scholarship "${result.name}" deleted successfully.` });
      fetchScholarships(); // Refresh the list
    } else {
      toast({ title: "Error Deleting", description: result.error || `Failed to delete scholarship "${result.name}".`, variant: "destructive" });
    }
  };
  
  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    try {
      const date = timestamp.toDate(); 
      return format(date, "MMM d, yyyy");
    } catch (e) {
      // Fallback for potentially already formatted strings or other date types
      try {
        const parsedDate = new Date(timestamp);
        if (!isNaN(parsedDate.getTime())) {
          return format(parsedDate, "MMM d, yyyy");
        }
      } catch (parseError) {
        // Do nothing, just proceed to return 'Invalid Date'
      }
      return 'Invalid Date';
    }
  };


  if (authLoading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading scholarships management...</p>
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
            <CardTitle className="text-2xl font-headline">Manage Scholarships (Admin SDK)</CardTitle>
            <CardDescription>Add, edit, or delete scholarship listings.</CardDescription>
          </div>
          <Button asChild>
            <Link href="/admin/scholarships/new">
              <PlusCircle className="mr-2 h-5 w-5" /> Add New Scholarship
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {error && <p className="text-destructive mb-4">{error}</p>}
          {scholarships.length === 0 && !isLoading && !error && (
            <p className="text-center text-muted-foreground py-4">No scholarships found. Add one to get started!</p>
          )}
          {scholarships.length > 0 && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Icon</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scholarships.map((scholarship) => (
                    <TableRow key={scholarship.id}>
                      <TableCell>
                        <IconByName name={scholarship.iconName} className="h-6 w-6 text-accent" fallbackIcon={ExternalLink}/>
                      </TableCell>
                      <TableCell className="font-medium">{scholarship.name}</TableCell>
                      <TableCell>{scholarship.category || 'N/A'}</TableCell>
                      <TableCell>{scholarship.location}</TableCell>
                      <TableCell>{formatDate(scholarship.createdAt)}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/scholarships/edit/${scholarship.id}`}>
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
                                This action cannot be undone. This will permanently delete the scholarship
                                <span className="font-semibold"> "{scholarship.name}"</span>.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(scholarship.id, scholarship.name)}>
                                Yes, delete scholarship
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
