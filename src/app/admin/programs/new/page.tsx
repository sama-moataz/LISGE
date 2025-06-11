
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { Loader2, Save, ShieldAlert, ArrowLeft, UploadCloud } from 'lucide-react';
import type { SummerProgram, LocationFilter, ProgramAgeFilter, ProgramFundingFilter, ProgramFocusAreaFilter, ProgramDurationFilter } from '@/types';
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';
import Image from 'next/image';
import { handleAddSummerProgramAction } from '../actions';
import IconByName from '@/components/IconByName';

const curatedIconNames = [
  'Award', 'Book', 'BookOpen', 'Briefcase', 'Building', 'CalendarDays', 'CheckCircle', 'Code2', 'Plane',
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
  'Youtube', 'Zap', 'Brain', 'Calendar', 'Clock', 'CheckSquare', 'Edit'
];

const locationOptions: { value: SummerProgram['location']; label: string }[] = [
  { value: 'Egypt', label: 'Egypt' },
  { value: 'International', label: 'International' },
  { value: 'Online', label: 'Online' },
];

const ageOptions: { value: ProgramAgeFilter; label: string }[] = [
  { value: 'All', label: 'All Ages/Grades' },
  { value: 'Under 16', label: 'Under 16' },
  { value: '16-18', label: '16-18' },
  { value: '18+', label: '18+' },
];

const fundingOptions: { value: ProgramFundingFilter; label: string }[] = [
  { value: 'All', label: 'All Funding Levels' },
  { value: 'Fully Funded', label: 'Fully Funded' },
  { value: 'Partial Scholarship', label: 'Partial Scholarship' },
  { value: 'Paid Program', label: 'Paid Program' },
  { value: 'Varies', label: 'Varies' },
];

const focusAreaOptions: { value: ProgramFocusAreaFilter; label: string }[] = [
  { value: 'All', label: 'All Focus Areas' },
  { value: 'STEM', label: 'STEM' },
  { value: 'Leadership', label: 'Leadership' },
  { value: 'Arts', label: 'Arts' },
  { value: 'Language', label: 'Language' },
  { value: 'Culture', label: 'Culture' },
  { value: 'Test Prep', label: 'Test Prep' },
  { value: 'College Prep', label: 'College Prep' },
  { value: 'University Experience', label: 'University Experience' },
  { value: 'Tech & Coding', label: 'Tech & Coding' },
  { value: 'Global Leadership', label: 'Global Leadership' },
  { value: 'STEM / Engineering', label: 'STEM / Engineering' },
  { value: 'Community Development', label: 'Community Development'},
  { value: 'Environmental Conservation', label: 'Environmental Conservation'},
  { value: 'Various', label: 'Various/Multi-disciplinary' },
];

const durationOptions: { value: ProgramDurationFilter; label: string }[] = [
  { value: 'All', label: 'All Durations' },
  { value: '1 Week', label: '1 Week' },
  { value: '2-4 Weeks', label: '2-4 Weeks' },
  { value: '1 Month+', label: '1 Month+' },
  { value: 'Academic Year', label: 'Academic Year'},
  { value: 'Varies', label: 'Varies' },
];


const summerProgramSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  eligibility: z.string().min(5, { message: "Eligibility criteria must be at least 5 characters." }),
  websiteUrl: z.string().url({ message: "Please enter a valid URL." }),
  iconName: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  location: z.enum(['Egypt', 'International', 'Online']),
  provider: z.string().optional().nullable(),
  ageRequirement: z.string().optional().nullable(),
  fundingLevel: z.string().optional().nullable(),
  focusArea: z.union([z.string(), z.array(z.string())]).optional().nullable(), // Allow string or array
  programDuration: z.string().optional().nullable(),
  partner: z.string().optional().nullable(),
  coverage: z.string().optional().nullable(),
  deadline: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
});

type SummerProgramFormData = z.infer<typeof summerProgramSchema>;

export default function NewSummerProgramPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { control, handleSubmit, formState: { errors }, watch, setValue } = useForm<SummerProgramFormData>({
    resolver: zodResolver(summerProgramSchema),
    defaultValues: {
      name: '', description: '', eligibility: '', websiteUrl: '',
      iconName: null, category: null, location: 'International', provider: null,
      ageRequirement: null, fundingLevel: null, focusArea: null, programDuration: null,
      partner: null, coverage: null, deadline: null, imageUrl: null,
    },
  });

  const watchedImageUrl = watch('imageUrl');
  useEffect(() => {
    if (watchedImageUrl && watchedImageUrl.startsWith('data:image')) {
      setImagePreview(watchedImageUrl);
    } else {
      setImagePreview(null);
    }
  }, [watchedImageUrl]);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.replace('/auth/login?redirect=/admin/programs/new');
      } else if (!isAdmin) {
        toast({ title: "Access Denied", description: "You do not have permission to add summer programs.", variant: "destructive" });
        router.replace('/dashboard');
      }
    }
  }, [user, isAdmin, authLoading, router, toast]);

  const onSubmit: SubmitHandler<SummerProgramFormData> = async (data) => {
    setIsSubmitting(true);
    
    const processedDataForAction: Omit<SummerProgram, 'id' | 'createdAt' | 'updatedAt' | 'icon'> = {
        ...data,
        iconName: data.iconName === '_none_' ? undefined : data.iconName,
        imageUrl: data.imageUrl || undefined,
        category: data.category || undefined,
        provider: data.provider || undefined,
        ageRequirement: data.ageRequirement === '_none_' ? undefined : (data.ageRequirement || undefined),
        fundingLevel: data.fundingLevel === '_none_' ? undefined : (data.fundingLevel || undefined),
        focusArea: data.focusArea || undefined,
        programDuration: data.programDuration === '_none_' ? undefined : (data.programDuration || undefined),
        partner: data.partner || undefined,
        coverage: data.coverage || undefined,
        deadline: data.deadline || undefined,
    };

    const result = await handleAddSummerProgramAction(processedDataForAction);

    if (result.success) {
      toast({ title: "Success", description: `Summer Program "${result.name}" added successfully.` });
      router.push('/admin/programs');
    } else {
      toast({ title: "Error Adding Program", description: result.error || "Failed to add summer program.", variant: "destructive" });
    }
    setIsSubmitting(false);
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
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

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/programs">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Summer Programs
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Add New Summer Program</CardTitle>
          <CardDescription>Fill in the details for the new summer program.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="name">Program Name <span className="text-destructive">*</span></Label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => <Input id="name" {...field} placeholder="E.g., Tech Innovators Summer Camp" />}
              />
              {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <Label htmlFor="description">Description <span className="text-destructive">*</span></Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => <Textarea id="description" {...field} rows={3} placeholder="Detailed description of the program..." />}
              />
              {errors.description && <p className="text-sm text-destructive mt-1">{errors.description.message}</p>}
            </div>
            
            <div>
              <Label htmlFor="eligibility">Eligibility <span className="text-destructive">*</span></Label>
              <Controller
                name="eligibility"
                control={control}
                render={({ field }) => <Textarea id="eligibility" {...field} rows={2} placeholder="E.g., High school students aged 15-17" />}
              />
              {errors.eligibility && <p className="text-sm text-destructive mt-1">{errors.eligibility.message}</p>}
            </div>

            <div>
              <Label htmlFor="websiteUrl">Website URL <span className="text-destructive">*</span></Label>
              <Controller
                name="websiteUrl"
                control={control}
                render={({ field }) => <Input id="websiteUrl" {...field} placeholder="https://example.com/program" />}
              />
              {errors.websiteUrl && <p className="text-sm text-destructive mt-1">{errors.websiteUrl.message}</p>}
            </div>

            <div>
              <Label htmlFor="imageUrl" className="flex items-center gap-2">
                <UploadCloud className="h-4 w-4 text-muted-foreground" /> Program Image (Optional)
              </Label>
              <Controller
                name="imageUrl"
                control={control}
                render={({ field: { onChange, onBlur, name, ref } }) => (
                  <Input
                    id="imageUrl"
                    type="file"
                    accept="image/*"
                    onBlur={onBlur}
                    name={name}
                    ref={ref}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          onChange(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      } else {
                        onChange(null);
                      }
                    }}
                  />
                )}
              />
              {errors.imageUrl && <p className="text-sm text-destructive mt-1">{errors.imageUrl.message}</p>}
              {imagePreview && (
                <div className="mt-4">
                  <Label>Image Preview:</Label>
                  <Image src={imagePreview} alt="Selected image preview" width={200} height={120} className="rounded-md object-cover border" />
                </div>
              )}
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
                        <div className="flex items-center gap-2">
                          {field.value && field.value !== '_none_' && <IconByName name={field.value} className="h-4 w-4" />}
                          <SelectValue placeholder="Select an icon (optional)" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="_none_">None</SelectItem>
                        {curatedIconNames.map(icon => (
                          <SelectItem key={icon} value={icon}>
                            <div className="flex items-center gap-2">
                              <IconByName name={icon} className="h-4 w-4" />{icon}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                 {errors.iconName && <p className="text-sm text-destructive mt-1">{errors.iconName.message}</p>}
              </div>

              <div>
                <Label htmlFor="category">Category/Type</Label>
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
                    <Label htmlFor="provider">Provider/Institution</Label>
                    <Controller
                        name="provider"
                        control={control}
                        render={({ field }) => <Input id="provider" {...field} value={field.value ?? ''} placeholder="E.g., University Name, Organization" />}
                    />
                    {errors.provider && <p className="text-sm text-destructive mt-1">{errors.provider.message}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="focusArea">Focus Area(s)</Label>
                 <Controller
                  name="focusArea"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value as string ?? undefined} defaultValue={field.value as string ?? undefined}>
                      <SelectTrigger id="focusArea">
                        <SelectValue placeholder="Select focus area" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="_none_">N/A or Not Specified</SelectItem>
                        {focusAreaOptions.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )}
                />
                 {errors.focusArea && <p className="text-sm text-destructive mt-1">{errors.focusArea.message}</p>}
              </div>
              <div>
                <Label htmlFor="programDuration">Program Duration</Label>
                 <Controller
                  name="programDuration"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value ?? undefined} defaultValue={field.value ?? undefined}>
                      <SelectTrigger id="programDuration">
                        <SelectValue placeholder="Select program duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="_none_">N/A or Not Specified</SelectItem>
                        {durationOptions.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.programDuration && <p className="text-sm text-destructive mt-1">{errors.programDuration.message}</p>}
              </div>
            </div>
            
            <div>
              <Label htmlFor="partner">Main Partner (if any)</Label>
              <Controller
                name="partner"
                control={control}
                render={({ field }) => <Input id="partner" {...field} value={field.value ?? ''} placeholder="E.g., Tech Company, NGO" />}
              />
              {errors.partner && <p className="text-sm text-destructive mt-1">{errors.partner.message}</p>}
            </div>

            <div>
              <Label htmlFor="coverage">What's Covered?</Label>
              <Controller
                name="coverage"
                control={control}
                render={({ field }) => <Textarea id="coverage" {...field} value={field.value ?? ''} placeholder="E.g., Tuition, meals, accommodation, materials" />}
              />
              {errors.coverage && <p className="text-sm text-destructive mt-1">{errors.coverage.message}</p>}
            </div>

            <div>
              <Label htmlFor="deadline">Application Deadline</Label>
              <Controller
                name="deadline"
                control={control}
                render={({ field }) => <Input id="deadline" {...field} value={field.value ?? ''} placeholder="E.g., March 15th, Rolling Basis" />}
              />
              {errors.deadline && <p className="text-sm text-destructive mt-1">{errors.deadline.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting || authLoading}>
              {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2 h-5 w-5" />}
              Add Summer Program
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

    