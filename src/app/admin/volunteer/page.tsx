
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, PlusCircle, Edit, Trash2, ShieldAlert, HeartHandshake } from 'lucide-react';
import { getVolunteerOpportunities } from '@/lib/firestoreService'; 
import type { VolunteerOpportunity } from '@/types';
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
import { handleDeleteVolunteerOpportunityAction } from './actions'; 

export default function AdminVolunteerOppsPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [volunteerOpps, setVolunteerOpps] = useState<VolunteerOpportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVolunteerOpps = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getVolunteerOpportunities();
      setVolunteerOpps(data);
    } catch (err: any) {
      setError(err.message || "Failed to load volunteer opportunities.");
      toast({ title: "Error", description: err.message || "Failed to load volunteer opportunities.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.replace('/auth/login?redirect=/admin/volunteer');
      } else if (!isAdmin) {
        toast({ title: "Access Denied", description: "You do not have permission to view this page.", variant: "destructive" });
        router.replace('/dashboard');
      } else {
        fetchVolunteerOpps();
      }
    }
  }, [user, isAdmin, authLoading, router, toast]);

  const handleDelete = async (id: string, name: string) => {
    const result = await handleDeleteVolunteerOpportunityAction(id, name);
    if (result.success) {
      toast({ title: "Success", description: `Volunteer Opportunity "${result.name}" deleted successfully.` });
      fetchVolunteerOpps(); 
    } else {
      toast({ title: "Error Deleting", description: result.error || `Failed to delete opportunity "${result.name}".`, variant: "destructive" });
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
        <p className="ml-4 text-lg">Loading volunteer opportunities...</p>
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
            <CardTitle className="text-2xl font-headline">Manage Volunteer Opportunities</CardTitle>
            <CardDescription>Add, edit, or delete volunteer opportunities.</CardDescription>
          </div>
          <Button asChild>
            <Link href="/admin/volunteer/new">
              <PlusCircle className="mr-2 h-5 w-5" /> Add New Opportunity
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {error && <p className="text-destructive mb-4">{error}</p>}
          {volunteerOpps.length === 0 && !isLoading && !error && (
            <p className="text-center text-muted-foreground py-4">No volunteer opportunities found. Add one to get started!</p>
          )}
          {volunteerOpps.length > 0 && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Icon</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Organization</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {volunteerOpps.map((opp) => (
                    <TableRow key={opp.id}>
                      <TableCell>
                        <IconByName name={opp.iconName} className="h-6 w-6 text-accent" fallbackIcon={HeartHandshake}/>
                      </TableCell>
                      <TableCell className="font-medium">{opp.name}</TableCell>
                      <TableCell>{opp.organization}</TableCell>
                      <TableCell>{opp.location}</TableCell>
                      <TableCell>{formatDate(opp.createdAt)}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/volunteer/edit/${opp.id}`}>
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
                                This action cannot be undone. This will permanently delete the opportunity
                                <span className="font-semibold"> "{opp.name}"</span> by <span className="font-semibold">{opp.organization}</span>.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(opp.id, opp.name)}>
                                Yes, delete opportunity
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
