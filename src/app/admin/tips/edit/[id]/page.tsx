
"use client";

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
import { Loader2, Save, ShieldAlert, ArrowLeft, AlertTriangle, UploadCloud } from 'lucide-react';
import { getStudyTipById } from '@/lib/firestoreService';
import type { StudyTip } from '@/types';
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';
import Image from 'next/image';
import { handleUpdateStudyTipAction } from '../actions';
import IconByName from '@/components/IconByName';

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
  'Youtube', 'Zap', 'Brain', 'Calendar', 'Clock', 'CheckSquare', 'Edit'
];

const studyTipSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  content: z.string().min(10, { message: "Content must be at least 10 characters." }),
  iconName: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(), // Can be Data URI, existing URL, or null
});

type StudyTipFormData = z.infer<typeof studyTipSchema>;

export default function EditStudyTipPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const tipId = params.id as string;
  const { toast } = useToast();

  const [isLoadingTip, setIsLoadingTip] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tipNotFound, setTipNotFound] = useState(false);
  const [currentImagePreview, setCurrentImagePreview] = useState<string | null>(null);

  const { control, handleSubmit, reset, formState: { errors }, watch, setValue } = useForm<StudyTipFormData>({
    resolver: zodResolver(studyTipSchema),
    defaultValues: {
      title: '',
      content: '',
      iconName: null,
      category: null,
      imageUrl: null,
    },
  });

  const watchedImageUrl = watch('imageUrl');
  useEffect(() => {
    if (watchedImageUrl) {
      setCurrentImagePreview(watchedImageUrl);
    }
  }, [watchedImageUrl]);

  const loadTipData = useCallback(async () => {
    if (!tipId) {
      setTipNotFound(true);
      setIsLoadingTip(false);
      return;
    }
    setIsLoadingTip(true);
    try {
      const tip = await getStudyTipById(tipId);
      if (tip) {
        const formData: StudyTipFormData = {
          title: tip.title || '',
          content: typeof tip.content === 'string' ? tip.content : '', // Ensure content is string
          iconName: tip.iconName || null,
          category: tip.category || null,
          imageUrl: tip.imageUrl || null,
        };
        reset(formData);
        setCurrentImagePreview(tip.imageUrl || null);
        setTipNotFound(false);
      } else {
        setTipNotFound(true);
        toast({ title: "Error", description: "Study tip not found.", variant: "destructive" });
      }
    } catch (err: any) {
      toast({ title: "Error Loading Data", description: err.message || "Failed to load study tip data.", variant: "destructive" });
      setTipNotFound(true);
    } finally {
      setIsLoadingTip(false);
    }
  }, [tipId, reset, toast]);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.replace(`/auth/login?redirect=/admin/tips/edit/${tipId}`);
      } else if (!isAdmin) {
        toast({ title: "Access Denied", description: "You do not have permission to edit study tips.", variant: "destructive" });
        router.replace('/dashboard');
      } else {
        loadTipData();
      }
    }
  }, [user, isAdmin, authLoading, router, toast, tipId, loadTipData]);

  const onSubmit: SubmitHandler<StudyTipFormData> = async (data) => {
    if (!tipId) return;
    setIsSubmitting(true);

    const processedDataForAction: Partial<Omit<StudyTip, 'id' | 'createdAt' | 'updatedAt' | 'icon'>> = {
        ...data,
        iconName: data.iconName === '_none_' ? undefined : data.iconName,
        imageUrl: data.imageUrl || undefined,
        category: data.category || undefined,
        content: typeof data.content === 'string' ? data.content : JSON.stringify(data.content),
    };

    const result = await handleUpdateStudyTipAction(tipId, processedDataForAction);

    if (result.success) {
      toast({ title: "Success", description: `Study Tip "${result.title}" updated successfully.` });
      router.push('/admin/tips');
    } else {
      toast({ title: "Error Updating Tip", description: result.error || "Failed to update study tip.", variant: "destructive" });
    }
    setIsSubmitting(false);
  };

  if (authLoading || isLoadingTip) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" /> <p className="ml-2">Loading tip details...</p>
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

  if (tipNotFound) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)] text-center p-4">
        <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold text-destructive mb-2">Study Tip Not Found</h1>
        <p className="text-muted-foreground mb-6">The study tip you are trying to edit does not exist.</p>
        <Button variant="outline" asChild><Link href="/admin/tips"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Study Tips</Link></Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
       <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/tips">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Study Tips
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Edit Study Tip</CardTitle>
          <CardDescription>Update the details for this study tip.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="title">Title <span className="text-destructive">*</span></Label>
              <Controller
                name="title"
                control={control}
                render={({ field }) => <Input id="title" {...field} />}
              />
              {errors.title && <p className="text-sm text-destructive mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <Label htmlFor="content">Content <span className="text-destructive">*</span></Label>
              <Controller
                name="content"
                control={control}
                render={({ field }) => <Textarea id="content" {...field} rows={5} />}
              />
              {errors.content && <p className="text-sm text-destructive mt-1">{errors.content.message}</p>}
            </div>

            <div>
              <Label htmlFor="imageUrl" className="flex items-center gap-2">
                <UploadCloud className="h-4 w-4 text-muted-foreground" /> Tip Image (Optional)
              </Label>
              <Controller
                name="imageUrl"
                control={control}
                render={({ field: { onChange, onBlur, name, ref, value: RHFValue } }) => (
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
                          onChange(reader.result as string); // Sets Data URI
                        };
                        reader.readAsDataURL(file);
                      } else {
                        // If user deselects file, and an old URL was there, keep old URL.
                        // To clear, user clicks "Remove image" button.
                        // onChange(currentImagePreview); // This might cause loop if currentImagePreview is Data URI
                      }
                    }}
                  />
                )}
              />
              {errors.imageUrl && <p className="text-sm text-destructive mt-1">{errors.imageUrl.message}</p>}
              {currentImagePreview && (
                <div className="mt-4">
                  <Label>Image Preview:</Label>
                  <Image src={currentImagePreview} alt="Current image preview" width={200} height={120} className="rounded-md object-cover border" />
                   <Button variant="link" size="sm" className="text-destructive p-0 h-auto mt-1" onClick={() => {
                      setValue('imageUrl', null); 
                      setCurrentImagePreview(null); 
                      const fileInput = document.getElementById('imageUrl') as HTMLInputElement;
                        if (fileInput) {
                            fileInput.value = '';
                        }
                  }}>
                    Remove image
                  </Button>
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
                              <IconByName name={icon} className="h-4 w-4" />
                              {icon}
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
                <Label htmlFor="category">Category</Label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => <Input id="category" {...field} value={field.value ?? ''} />}
                />
                {errors.category && <p className="text-sm text-destructive mt-1">{errors.category.message}</p>}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting || authLoading || isLoadingTip}>
              {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2 h-5 w-5" />}
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
