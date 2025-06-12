
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
import { Loader2, Save, ShieldAlert, ArrowLeft, UploadCloud, HeartHandshake } from 'lucide-react';
import type { VolunteerOpportunity, LocationFilter } from '@/types';
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';
import Image from 'next/image';
import { handleAddVolunteerOpportunityAction } from '../actions';
import IconByName from '@/components/IconByName';

const curatedIconNames = [
  'Award', 'Book', 'BookOpen', 'Briefcase', 'Building', 'CalendarDays', 'CheckCircle', 'Code2', 'Plane',
  'ClipboardList', 'Coins', 'Compass', 'DollarSign', 'Edit3', 'ExternalLink', 'Feather', 'FileText',
  'Filter', 'Flag', 'FolderOpen', 'Gift', 'Globe', 'Globe2', 'GraduationCap', 'HeartHandshake', 'HelpCircle', 'Home',
  'Image', 'Info', 'Landmark', 'Languages', 'Laptop', 'LayoutDashboard', 'Library', 'LifeBuoy', 'Lightbulb',
  'Link', 'ListChecks', 'Loader2', 'LockKeyhole', 'LogIn', 'LogOut', 'Mail', 'Map', 'MapPin', 'Medal', 'Menu',
  'MessageSquare', 'Mic2', 'Moon', 'MoreHorizontal', 'MousePointerSquare', 'Move', 'Music2', 'Newspaper',
  'Package', 'Paperclip', 'PenLine', 'Percent', 'PersonStanding', 'Phone', 'PieChart', 'Pin', 'PlayCircle',
  'Plus', 'PlusCircle', 'Pocket', 'Printer', 'Puzzle', 'RefreshCcw', 'RefreshCw', 'Rocket', 'Save',
  'School', 'School2', 'ScreenShare', 'Search', 'Send', 'Settings', 'Settings2', 'Share2', 'Sheet', 'ShieldCheck',
  'ShoppingBag', 'ShoppingCart', 'SlidersHorizontal', 'Smile', 'Sparkles', 'Speaker', 'Star', 'StickyNote', 'Sun',
  'Table', 'Tablet', 'Tag', 'Target', 'Tent', 'ThumbsUp', 'Timer', 'ToggleLeft', 'ToggleRight', 'Tool',
  'Trash2', 'TrendingUp', 'Trophy', 'Truck', 'Tv2', 'University', 'UploadCloud', 'User', 'UserCheck',
  'UserCog', 'UserPlus', 'Users', 'Video', 'Voicemail', 'WalletCards', 'Waypoints', 'Wifi', 'Wind', 'Workflow',
  'Youtube', 'Zap', 'Brain', 'Calendar', 'Clock', 'CheckSquare', 'Edit', 'Leaf'
];

const locationOptions: { value: VolunteerOpportunity['location']; label: string }[] = [
  { value: 'Egypt', label: 'Egypt' },
  { value: 'International', label: 'International' },
  { value: 'Online', label: 'Online' },
];

const volunteerOpportunitySchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
  organization: z.string().min(2, { message: "Organization name must be at least 2 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  websiteUrl: z.string().url({ message: "Please enter a valid URL." }),
  iconName: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  location: z.enum(['Egypt', 'International', 'Online']),
  eligibility: z.string().optional().nullable(),
  duration: z.string().optional().nullable(),
  cost: z.string().optional().nullable(),
  sdgFocus: z.string().optional().nullable(),
  partner: z.string().optional().nullable(),
  coverage: z.string().optional().nullable(),
  deadline: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
});

type VolunteerOpportunityFormData = z.infer<typeof volunteerOpportunitySchema>;

export default function NewVolunteerOpportunityPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { control, handleSubmit, formState: { errors }, watch, setValue } = useForm<VolunteerOpportunityFormData>({
    resolver: zodResolver(volunteerOpportunitySchema),
    defaultValues: {
      name: '', organization: '', description: '', websiteUrl: '',
      iconName: null, category: null, location: 'Egypt', eligibility: null,
      duration: null, cost: null, sdgFocus: null, partner: null,
      coverage: null, deadline: null, imageUrl: null,
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
        router.replace('/auth/login?redirect=/admin/volunteer/new');
      } else if (!isAdmin) {
        toast({ title: "Access Denied", description: "You do not have permission to add volunteer opportunities.", variant: "destructive" });
        router.replace('/dashboard');
      }
    }
  }, [user, isAdmin, authLoading, router, toast]);

  const onSubmit: SubmitHandler<VolunteerOpportunityFormData> = async (data) => {
    setIsSubmitting(true);
    
    const processedDataForAction: Omit<VolunteerOpportunity, 'id' | 'createdAt' | 'updatedAt' | 'icon'> = {
        ...data,
        iconName: data.iconName === '_none_' ? undefined : data.iconName,
        imageUrl: data.imageUrl || undefined,
        category: data.category || undefined,
        eligibility: data.eligibility || undefined,
        duration: data.duration || undefined,
        cost: data.cost || undefined,
        sdgFocus: data.sdgFocus || undefined,
        partner: data.partner || undefined,
        coverage: data.coverage || undefined,
        deadline: data.deadline || undefined,
    };

    const result = await handleAddVolunteerOpportunityAction(processedDataForAction);

    if (result.success) {
      toast({ title: "Success", description: `Volunteer Opportunity "${result.name}" added successfully.` });
      router.push('/admin/volunteer');
    } else {
      toast({ title: "Error Adding Opportunity", description: result.error || "Failed to add volunteer opportunity.", variant: "destructive" });
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
          <Link href="/admin/volunteer">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Volunteer Opportunities
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Add New Volunteer Opportunity</CardTitle>
          <CardDescription>Fill in the details for the new volunteer opportunity.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="name">Opportunity Name <span className="text-destructive">*</span></Label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => <Input id="name" {...field} placeholder="E.g., Community Garden Volunteer" />}
              />
              {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <Label htmlFor="organization">Organization <span className="text-destructive">*</span></Label>
              <Controller
                name="organization"
                control={control}
                render={({ field }) => <Input id="organization" {...field} placeholder="E.g., Green Earth Initiative" />}
              />
              {errors.organization && <p className="text-sm text-destructive mt-1">{errors.organization.message}</p>}
            </div>

            <div>
              <Label htmlFor="description">Description <span className="text-destructive">*</span></Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => <Textarea id="description" {...field} rows={3} placeholder="Detailed description of the opportunity..." />}
              />
              {errors.description && <p className="text-sm text-destructive mt-1">{errors.description.message}</p>}
            </div>
            
            <div>
              <Label htmlFor="websiteUrl">Website URL <span className="text-destructive">*</span></Label>
              <Controller
                name="websiteUrl"
                control={control}
                render={({ field }) => <Input id="websiteUrl" {...field} placeholder="https://example.com/volunteer-opp" />}
              />
              {errors.websiteUrl && <p className="text-sm text-destructive mt-1">{errors.websiteUrl.message}</p>}
            </div>

            <div>
              <Label htmlFor="imageUrl" className="flex items-center gap-2">
                <UploadCloud className="h-4 w-4 text-muted-foreground" /> Opportunity Image (Optional)
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
                  render={({ field }) => <Input id="category" {...field} value={field.value ?? ''} placeholder="E.g., Environmental, Education, Healthcare" />}
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
                  <Label htmlFor="eligibility">Eligibility Criteria</Label>
                  <Controller
                    name="eligibility"
                    control={control}
                    render={({ field }) => <Input id="eligibility" {...field} value={field.value ?? ''} placeholder="E.g., 18+, Specific skills" />}
                  />
                  {errors.eligibility && <p className="text-sm text-destructive mt-1">{errors.eligibility.message}</p>}
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="duration">Duration</Label>
                 <Controller
                  name="duration"
                  control={control}
                  render={({ field }) => <Input id="duration" {...field} value={field.value ?? ''} placeholder="E.g., 2 weeks, Ongoing, Specific dates" />}
                />
                {errors.duration && <p className="text-sm text-destructive mt-1">{errors.duration.message}</p>}
              </div>
              <div>
                <Label htmlFor="cost">Cost/Fees</Label>
                 <Controller
                  name="cost"
                  control={control}
                  render={({ field }) => <Input id="cost" {...field} value={field.value ?? ''} placeholder="E.g., Free, $50 application fee, Covers accommodation" />}
                />
                {errors.cost && <p className="text-sm text-destructive mt-1">{errors.cost.message}</p>}
              </div>
            </div>

            <div>
                <Label htmlFor="sdgFocus">SDG Focus (if applicable)</Label>
                 <Controller
                  name="sdgFocus"
                  control={control}
                  render={({ field }) => <Input id="sdgFocus" {...field} value={field.value ?? ''} placeholder="E.g., SDG 4: Quality Education, SDG 13: Climate Action" />}
                />
                {errors.sdgFocus && <p className="text-sm text-destructive mt-1">{errors.sdgFocus.message}</p>}
            </div>
            
            <div>
              <Label htmlFor="partner">Main Partner/Sponsor (if any)</Label>
              <Controller
                name="partner"
                control={control}
                render={({ field }) => <Input id="partner" {...field} value={field.value ?? ''} placeholder="E.g., Local NGO, International Organization" />}
              />
              {errors.partner && <p className="text-sm text-destructive mt-1">{errors.partner.message}</p>}
            </div>

            <div>
              <Label htmlFor="coverage">What's Covered? (if applicable)</Label>
              <Controller
                name="coverage"
                control={control}
                render={({ field }) => <Textarea id="coverage" {...field} value={field.value ?? ''} rows={2} placeholder="E.g., Meals, accommodation, local transport" />}
              />
              {errors.coverage && <p className="text-sm text-destructive mt-1">{errors.coverage.message}</p>}
            </div>

            <div>
              <Label htmlFor="deadline">Application Deadline</Label>
              <Controller
                name="deadline"
                control={control}
                render={({ field }) => <Input id="deadline" {...field} value={field.value ?? ''} placeholder="E.g., March 15th, Rolling Basis, ASAP" />}
              />
              {errors.deadline && <p className="text-sm text-destructive mt-1">{errors.deadline.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting || authLoading}>
              {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2 h-5 w-5" />}
              Add Volunteer Opportunity
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

    