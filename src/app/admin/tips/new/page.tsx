
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
import { Loader2, Save, ShieldAlert, ArrowLeft, UploadCloud, Lightbulb } from 'lucide-react';
import type { StudyTip } from '@/types';
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';
import Image from 'next/image';
import { handleAddStudyTipAction } from '../actions';
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
  imageUrl: z.string().optional().nullable(),
});

type StudyTipFormData = z.infer<typeof studyTipSchema>;

export default function NewStudyTipPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { control, handleSubmit, formState: { errors }, watch, setValue } = useForm<StudyTipFormData>({
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
    if (watchedImageUrl && watchedImageUrl.startsWith('data:image')) {
      setImagePreview(watchedImageUrl);
    } else {
      setImagePreview(null);
    }
  }, [watchedImageUrl]);


  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.replace('/auth/login?redirect=/admin/tips/new');
      } else if (!isAdmin) {
        toast({ title: "Access Denied", description: "You do not have permission to add study tips.", variant: "destructive" });
        router.replace('/dashboard');
      }
    }
  }, [user, isAdmin, authLoading, router, toast]);

  const onSubmit: SubmitHandler<StudyTipFormData> = async (data) => {
    setIsSubmitting(true);
    
    const processedDataForAction: Omit<StudyTip, 'id' | 'createdAt' | 'updatedAt' | 'icon'> = {
        ...data,
        iconName: data.iconName === '_none_' ? undefined : data.iconName,
        imageUrl: data.imageUrl || undefined, // Will be Data URI or null
        category: data.category || undefined,
        // content is already a string from Textarea
    };

    const result = await handleAddStudyTipAction(processedDataForAction);

    if (result.success) {
      toast({ title: "Success", description: `Study Tip "${result.title}" added successfully.` });
      router.push('/admin/tips');
    } else {
      toast({ title: "Error Adding Tip", description: result.error || "Failed to add study tip.", variant: "destructive" });
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
          <Link href="/admin/tips">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Study Tips
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Add New Study Tip</CardTitle>
          <CardDescription>Fill in the details for the new study tip.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="title">Title <span className="text-destructive">*</span></Label>
              <Controller
                name="title"
                control={control}
                render={({ field }) => <Input id="title" {...field} placeholder="E.g., Effective Note-Taking" />}
              />
              {errors.title && <p className="text-sm text-destructive mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <Label htmlFor="content">Content <span className="text-destructive">*</span></Label>
              <Controller
                name="content"
                control={control}
                render={({ field }) => <Textarea id="content" {...field} rows={5} placeholder="Detailed explanation of the study tip..." />}
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
                  render={({ field }) => <Input id="category" {...field} value={field.value ?? ''} placeholder="E.g., Time Management, Exam Prep" />}
                />
                {errors.category && <p className="text-sm text-destructive mt-1">{errors.category.message}</p>}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting || authLoading}>
              {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2 h-5 w-5" />}
              Add Study Tip
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
