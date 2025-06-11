
"use client"; // Keep client for form interactions, useAuth, etc.

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Save, ShieldAlert, ArrowLeft, AlertTriangle } from 'lucide-react';
import { getScholarshipById } from '@/lib/firestoreService'; // Read uses client SDK
import type { Scholarship, LocationFilter, ScholarshipAgeFilter, ScholarshipFundingFilter, ScholarshipRegionFilter, ScholarshipLevelFilter, FundingCountryFilter } from '@/types';
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';
// Import the Server Action
import { handleUpdateScholarshipAction } from '../actions';


const curatedIconNames = [
  'Award', 'Book', 'BookOpen', 'Briefcase', 'Building', 'CalendarDays', 'CheckCircle', 
  'ClipboardList', 'Coins', 'Compass', 'DollarSign', 'Edit3', 'ExternalLink', 'Feather', 'FileText',
  'Filter', 'Flag', 'FolderOpen', 'Gift', 'Globe', 'GraduationCap', 'HeartHandshake', 'HelpCircle', 'Home', 
  'Image', 'Info', 'Landmark', 'Languages', 'Laptop', 'LayoutDashboard', 'Library', 'LifeBuoy', 'Lightbulb', 
  'Link', 'ListChecks', 'Loader2', 'LockKeyhole', 'LogIn', 'LogOut', 'Mail', 'Map', 'MapPin', 'Medal', 'Menu', 
  'MessageSquare', 'Mic2', 'Moon', 'MoreHorizontal', 'MousePointerSquare', 'Move', 'Music2', 'Newspaper', 
  'Package', 'Paperclip', 'PenLine', 'Percent', 'PersonStanding', 'Phone', 'PieChart', 'Pin', 'PlayCircle', 
  'Plus', 'PlusCircle', 'Pocket', 'Printer', 'Puzzle', 'RefreshCcw', 'RefreshCw', 'Rocket', 'Save', 
  'School', 'ScreenShare', 'Search', 'Send', 'Settings', 'Settings2', 'Share2', 'Sheet', 'ShieldCheck', 
  'ShoppingBag', 'ShoppingCart', 'SlidersHorizontal', 'Smile', 'Sparkles', 'Speaker', 'Star', 'StickyNote', 'Sun', 
  'Table', 'Tablet', 'Tag', 'Target', 'Tent', 'ThumbsUp', 'Timer', 'ToggleLeft', 'ToggleRight', 'Tool', 
  'Trash2', 'TrendingUp', 'Trophy', 'Truck', 'Tv2', 'University', 'UploadCloud', 'User', 'UserCheck', 
  'UserCog', 'UserPlus', 'Users', 'Video', 'Voicemail', 'WalletCards', 'Waypoints', 'Wifi', 'Wind', 'Workflow', 
  'Youtube', 'Zap'
];

const locationOptions: { value: Scholarship['location']; label: string }[] = [
  { value: 'Egypt', label: 'Egypt' },
  { value: 'International', label: 'International' },
  { value: 'Global', label: 'Global' },
  { value: 'Online', label: 'Online' },
];

const ageOptions: { value: ScholarshipAgeFilter; label: string }[] = [
  { value: 'All', label: 'All Ages/Grades' },
  { value: 'Under 16', label: 'Under 16' },
  { value: '16-18', label: '16-18' },
  { value: '18+', label: '18+' },
];

const fundingOptions: { value: ScholarshipFundingFilter; label: string }[] = [
  { value: 'All', label: 'All Funding Levels' },
  { value: 'Fully Funded', label: 'Fully Funded' },
  { value: 'Partial Scholarship', label: 'Partial Scholarship' },
  { value: 'No Funding', label: 'No Funding' },
  { value: 'Varies', label: 'Varies' },
];

const regionOptions: { value: ScholarshipRegionFilter; label: string }[] = [
  { value: 'All', label: 'All Destinations' },
  { value: 'Egypt/MENA', label: 'Egypt/MENA' },
  { value: 'USA', label: 'USA' },
  { value: 'Europe', label: 'Europe' },
  { value: 'UK', label: 'UK'},
  { value: 'Canada', label: 'Canada'},
  { value: 'Asia', label: 'Asia' },
  { value: 'Global', label: 'Global (Multiple/Any)' },
  { value: 'Other', label: 'Other' },
];

const levelOptions: { value: ScholarshipLevelFilter; label: string }[] = [
  { value: 'All', label: 'All Levels/Types' },
  { value: 'High School', label: 'High School Program' },
  { value: 'Undergraduate', label: 'Undergraduate Degree' },
  { value: 'Postgraduate', label: 'Postgraduate Degree' },
  { value: 'Language', label: 'Language Course' },
  { value: 'Exchange', label: 'Exchange Program' },
  { value: 'Research', label: 'Research Grant/Fellowship'},
  { value: 'Youth', label: 'Youth Program'},
  { value: 'Varies', label: 'Varies/Other' },
];

const fundingCountryOptions: { value: FundingCountryFilter; label: string }[] = [
  { value: 'All', label: 'All Funding Countries' },
  { value: 'Egypt', label: 'Egypt' },
  { value: 'USA', label: 'USA' },
  { value: 'Germany', label: 'Germany' },
  { value: 'UK', label: 'UK' },
  { value: 'Canada', label: 'Canada' },
  { value: 'China', label: 'China' },
  { value: 'South Korea', label: 'South Korea' },
  { value: 'Other', label: 'Other' },
];

const scholarshipSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  eligibility: z.string().min(10, { message: "Eligibility criteria must be at least 10 characters." }),
  websiteUrl: z.string().url({ message: "Please enter a valid URL." }),
  iconName: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  location: z.enum(['Egypt', 'International', 'Global', 'Online']),
  ageRequirement: z.string().optional().nullable(),
  fundingLevel: z.string().optional().nullable(),
  destinationRegion: z.string().optional().nullable(),
  targetLevel: z.string().optional().nullable(),
  fundingCountry: z.string().optional().nullable(),
  partner: z.string().optional().nullable(),
  coverage: z.string().optional().nullable(),
  deadline: z.string().optional().nullable(),
  imageUrl: z.string().url({ message: "Please enter a valid image URL." })
    .or(z.literal('')) 
    .optional()
    .nullable(), 
});

type ScholarshipFormData = z.infer<typeof scholarshipSchema>;

// Inline Server Action removed

export default function EditScholarshipPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const scholarshipId = params.id as string;
  const { toast } = useToast();
  
  const [isLoadingScholarship, setIsLoadingScholarship] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scholarshipNotFound, setScholarshipNotFound] = useState(false);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<ScholarshipFormData>({
    resolver: zodResolver(scholarshipSchema),
    defaultValues: { 
      name: '', description: '', eligibility: '', websiteUrl: '',
      iconName: null, category: null, location: 'International',
      ageRequirement: null, fundingLevel: null, destinationRegion: null,
      targetLevel: null, fundingCountry: null, partner: null,
      coverage: null, deadline: null, imageUrl: null,
    },
  });
  
  const loadScholarshipData = useCallback(async () => {
    if (!scholarshipId) {
      setScholarshipNotFound(true);
      setIsLoadingScholarship(false);
      return;
    }
    setIsLoadingScholarship(true);
    try {
      const scholarship = await getScholarshipById(scholarshipId); // Read uses client SDK
      if (scholarship) {
        const formData: ScholarshipFormData = {
          name: scholarship.name || '',
          description: scholarship.description || '',
          eligibility: scholarship.eligibility || '',
          websiteUrl: scholarship.websiteUrl || '',
          iconName: scholarship.iconName || null,
          category: scholarship.category || null,
          location: scholarship.location || 'International',
          ageRequirement: scholarship.ageRequirement || null,
          fundingLevel: scholarship.fundingLevel || null,
          destinationRegion: scholarship.destinationRegion || null,
          targetLevel: scholarship.targetLevel || null,
          fundingCountry: scholarship.fundingCountry || null,
          partner: scholarship.partner || null,
          coverage: scholarship.coverage || null,
          deadline: scholarship.deadline || null,
          imageUrl: scholarship.imageUrl || null,
        };
        reset(formData); 
        setScholarshipNotFound(false);
      } else {
        setScholarshipNotFound(true);
        toast({ title: "Error", description: "Scholarship not found.", variant: "destructive" });
      }
    } catch (err: any) {
      toast({ title: "Error Loading Data", description: err.message || "Failed to load scholarship data.", variant: "destructive" });
      setScholarshipNotFound(true); 
    } finally {
      setIsLoadingScholarship(false);
    }
  }, [scholarshipId, reset, toast]);


  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.replace(`/auth/login?redirect=/admin/scholarships/edit/${scholarshipId}`);
      } else if (!isAdmin) {
        toast({ title: "Access Denied", description: "You do not have permission to edit scholarships.", variant: "destructive" });
        router.replace('/dashboard');
      } else {
         loadScholarshipData();
      }
    }
  }, [user, isAdmin, authLoading, router, toast, scholarshipId, loadScholarshipData]);


  const onSubmit: SubmitHandler<ScholarshipFormData> = async (data) => {
    if (!scholarshipId) return;
    setIsSubmitting(true);
    console.log("[EditScholarshipPage Client] Submitting form data for ID " + scholarshipId + ":", data);
    
    const processedDataForAction: Partial<Omit<Scholarship, 'id' | 'createdAt'>> = {
        ...data,
        iconName: data.iconName === '_none_' ? null : data.iconName,
        ageRequirement: data.ageRequirement === '_none_' ? null : (data.ageRequirement || null),
        fundingLevel: data.fundingLevel === '_none_' ? null : (data.fundingLevel || null),
        destinationRegion: data.destinationRegion === '_none_' ? null : (data.destinationRegion || null),
        targetLevel: data.targetLevel === '_none_' ? null : (data.targetLevel || null),
        fundingCountry: data.fundingCountry === '_none_' ? null : (data.fundingCountry || null),
        imageUrl: data.imageUrl === '' ? null : data.imageUrl,
        // Ensure all optional fields that are not required by Omit<> but might be empty strings are null
        category: data.category || null,
        partner: data.partner || null,
        coverage: data.coverage || null,
        deadline: data.deadline || null,
    };

    // If your Server Action needs an ID token for auth (recommended)
    // const idToken = await user?.getIdToken();
    // const result = await handleUpdateScholarshipAction(scholarshipId, { ...processedDataForAction, idToken });
    // Server Action would need to be adapted to receive and verify this.

    const result = await handleUpdateScholarshipAction(scholarshipId, processedDataForAction);

    if (result.success) {
      toast({ title: "Success", description: `Scholarship "${result.name}" updated successfully.` });
      router.push('/admin/scholarships');
    } else {
      toast({ title: "Error Updating Scholarship", description: result.error || "Failed to update scholarship. Check console for details.", variant: "destructive" });
      console.error("[EditScholarshipPage Client] Error from Server Action:", result.error);
    }
    setIsSubmitting(false);
  };

  if (authLoading || isLoadingScholarship) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-2">Loading scholarship details...</p>
      </div>
    );
  }

  if (!isAdmin && !authLoading) { 
     return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)] text-center p-4">
        <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold text-destructive mb-2">Access Denied</h1>
        <p className="text-muted-foreground mb-6">You do not have permission to perform this action.</p>
        <Button onClick={() => router.push('/dashboard')}>Go to Dashboard</Button>
      </div>
    );
  }
  
  if (scholarshipNotFound) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)] text-center p-4">
        <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold text-destructive mb-2">Scholarship Not Found</h1>
        <p className="text-muted-foreground mb-6">The scholarship you are trying to edit does not exist or could not be loaded.</p>
        <Button variant="outline" asChild>
            <Link href="/admin/scholarships"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Scholarships</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/scholarships">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Scholarships
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Edit Scholarship (Admin SDK)</CardTitle>
          <CardDescription>Update the details for this scholarship listing.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            <div>
              <Label htmlFor="name">Scholarship Name <span className="text-destructive">*</span></Label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => <Input id="name" {...field} placeholder="E.g., Future Leaders Scholarship" />}
              />
              {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <Label htmlFor="description">Description <span className="text-destructive">*</span></Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => <Textarea id="description" {...field} placeholder="Detailed description of the scholarship..." />}
              />
              {errors.description && <p className="text-sm text-destructive mt-1">{errors.description.message}</p>}
            </div>

            <div>
              <Label htmlFor="eligibility">Eligibility Criteria <span className="text-destructive">*</span></Label>
              <Controller
                name="eligibility"
                control={control}
                render={({ field }) => <Textarea id="eligibility" {...field} placeholder="Who is eligible for this scholarship?" />}
              />
              {errors.eligibility && <p className="text-sm text-destructive mt-1">{errors.eligibility.message}</p>}
            </div>

            <div>
              <Label htmlFor="websiteUrl">Website URL <span className="text-destructive">*</span></Label>
              <Controller
                name="websiteUrl"
                control={control}
                render={({ field }) => <Input id="websiteUrl" {...field} placeholder="https://example.com/scholarship" />}
              />
              {errors.websiteUrl && <p className="text-sm text-destructive mt-1">{errors.websiteUrl.message}</p>}
            </div>

            <div>
              <Label htmlFor="imageUrl">Image URL</Label>
              <Controller
                name="imageUrl"
                control={control}
                render={({ field }) => <Input id="imageUrl" {...field} value={field.value ?? ''} placeholder="https://example.com/image.jpg" />}
              />
              {errors.imageUrl && <p className="text-sm text-destructive mt-1">{errors.imageUrl.message}</p>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="iconName">Icon Name (Lucide)</Label>
                <Controller
                  name="iconName"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value ?? undefined} defaultValue={field.value ?? undefined}>
                      <SelectTrigger id="iconName">
                        <SelectValue placeholder="Select an icon (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="_none_">None</SelectItem>
                        {curatedIconNames.map(icon => <SelectItem key={icon} value={icon}>{icon}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )}
                />
                 {errors.iconName && <p className="text-sm text-destructive mt-1">{errors.iconName.message}</p>}
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => <Input id="category" {...field} value={field.value ?? ''} placeholder="E.g., STEM, Arts, Leadership" />}
                />
                {errors.category && <p className="text-sm text-destructive mt-1">{errors.category.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="location">Location <span className="text-destructive">*</span></Label>
                <Controller
                  name="location"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                      <SelectTrigger id="location">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {locationOptions.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.location && <p className="text-sm text-destructive mt-1">{errors.location.message}</p>}
              </div>
              <div>
                <Label htmlFor="ageRequirement">Age/Grade Requirement</Label>
                 <Controller
                  name="ageRequirement"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value ?? undefined} defaultValue={field.value ?? undefined}>
                      <SelectTrigger id="ageRequirement">
                        <SelectValue placeholder="Select age/grade" />
                      </SelectTrigger>
                      <SelectContent>
                         <SelectItem value="_none_">N/A or Not Specified</SelectItem>
                        {ageOptions.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.ageRequirement && <p className="text-sm text-destructive mt-1">{errors.ageRequirement.message}</p>}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="fundingLevel">Funding Level</Label>
                 <Controller
                  name="fundingLevel"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value ?? undefined} defaultValue={field.value ?? undefined}>
                      <SelectTrigger id="fundingLevel">
                        <SelectValue placeholder="Select funding level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="_none_">N/A or Not Specified</SelectItem>
                        {fundingOptions.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.fundingLevel && <p className="text-sm text-destructive mt-1">{errors.fundingLevel.message}</p>}
              </div>
              <div>
                <Label htmlFor="destinationRegion">Destination Region</Label>
                 <Controller
                  name="destinationRegion"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value ?? undefined} defaultValue={field.value ?? undefined}>
                      <SelectTrigger id="destinationRegion">
                        <SelectValue placeholder="Select destination region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="_none_">N/A or Not Specified</SelectItem>
                        {regionOptions.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.destinationRegion && <p className="text-sm text-destructive mt-1">{errors.destinationRegion.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="targetLevel">Target Level/Type</Label>
                 <Controller
                  name="targetLevel"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value ?? undefined} defaultValue={field.value ?? undefined}>
                      <SelectTrigger id="targetLevel">
                        <SelectValue placeholder="Select target level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="_none_">N/A or Not Specified</SelectItem>
                        {levelOptions.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )}
                />
                 {errors.targetLevel && <p className="text-sm text-destructive mt-1">{errors.targetLevel.message}</p>}
              </div>
              <div>
                <Label htmlFor="fundingCountry">Funding Country</Label>
                 <Controller
                  name="fundingCountry"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value ?? undefined} defaultValue={field.value ?? undefined}>
                      <SelectTrigger id="fundingCountry">
                        <SelectValue placeholder="Select funding country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="_none_">N/A or Not Specified</SelectItem>
                        {fundingCountryOptions.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.fundingCountry && <p className="text-sm text-destructive mt-1">{errors.fundingCountry.message}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="partner">Partner/Provider</Label>
              <Controller
                name="partner"
                control={control}
                render={({ field }) => <Input id="partner" {...field} value={field.value ?? ''} placeholder="E.g., University Name, Organization" />}
              />
              {errors.partner && <p className="text-sm text-destructive mt-1">{errors.partner.message}</p>}
            </div>

            <div>
              <Label htmlFor="coverage">Coverage Details</Label>
              <Controller
                name="coverage"
                control={control}
                render={({ field }) => <Textarea id="coverage" {...field} value={field.value ?? ''} placeholder="What does the scholarship cover? (Tuition, accommodation, etc.)" />}
              />
              {errors.coverage && <p className="text-sm text-destructive mt-1">{errors.coverage.message}</p>}
            </div>
            
            <div>
              <Label htmlFor="deadline">Application Deadline</Label>
              <Controller
                name="deadline"
                control={control}
                render={({ field }) => <Input id="deadline" {...field} value={field.value ?? ''} placeholder="E.g., December 31st, Rolling Basis" />}
              />
              {errors.deadline && <p className="text-sm text-destructive mt-1">{errors.deadline.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting || authLoading || isLoadingScholarship}>
              {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2 h-5 w-5" />}
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
