
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
import { deleteScholarshipAdmin } from '@/lib/firestoreAdminService'; // Delete uses Admin SDK
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


// Server Action for deletion, defined in the page
async function handleDeleteScholarship(id: string, name: string) {
  'use server';
  console.log(`[Server Action - handleDeleteScholarship] Attempting to delete ID ${id}, Name: ${name}`);

  // CRITICAL: AUTHORIZATION CHECK (Placeholder - see new/page.tsx for detailed comments)
  // You MUST verify the user is an admin here before proceeding.
  // This involves verifying an ID token and checking the user's role.
  // For this example, we'll proceed, assuming authorization is handled.
  // if (!isCallerAdmin(idToken)) { return { success: false, error: 'Unauthorized' }; }

  try {
    await deleteScholarshipAdmin(id);
    console.log(`[Server Action - handleDeleteScholarship] Scholarship deleted for ID: ${id}`);
    return { success: true, name };
  } catch (err: any) {
    console.error(`[Server Action - handleDeleteScholarship] Error calling deleteScholarshipAdmin for ID ${id}:`, err);
    return { success: false, error: err.message || "Failed to delete scholarship via Admin SDK.", name };
  }
}


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

  const handleDeleteAction = async (id: string, name: string) => {
    const result = await handleDeleteScholarship(id, name);
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
                              <AlertDialogAction onClick={() => handleDeleteAction(scholarship.id, scholarship.name)}>
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
