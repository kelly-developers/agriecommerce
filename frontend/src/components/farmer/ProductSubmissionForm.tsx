import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { farmersAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ImagePlus, Link, X } from 'lucide-react';
import { categories } from '@/data/products';

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().min(0.01, 'Price must be at least 0.01'),
  category: z.string().min(1, 'Category is required'),
  subcategory: z.string().optional(),
  stock: z.number().min(1, 'Stock must be at least 1'),
  origin: z.string().min(1, 'Origin is required'),
  nutritionalInfo: z.string().optional(),
  isOrganic: z.boolean(),
  unitType: z.enum(['kg', 'bunch', 'piece', 'packet', 'kit', 'unit']),
  imageUrl: z.string().url('Please provide a valid image URL').optional(),
  imageFile: z.any().optional()
}).refine(data => data.imageUrl || data.imageFile, {
  message: "Either image URL or file is required",
  path: ["imageUrl"]
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductSubmissionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProductSubmitted: () => void;
}

const unitTypes = [
  { value: 'kg', label: 'Kilogram (kg)' },
  { value: 'bunch', label: 'Bunch' },
  { value: 'piece', label: 'Piece' },
  { value: 'packet', label: 'Packet' },
  { value: 'kit', label: 'Kit' },
  { value: 'unit', label: 'Unit' }
];

export function ProductSubmissionForm({ open, onOpenChange, onProductSubmitted }: ProductSubmissionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      category: '',
      subcategory: '',
      stock: 1,
      origin: '',
      nutritionalInfo: '',
      isOrganic: false,
      unitType: 'kg',
      imageUrl: '',
      imageFile: null
    }
  });

  // Debugging: Log form state changes
  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      console.log('Form field changed:', { name, type, value });
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  const selectedCategory = categories.find(cat => cat.id === form.watch('category'));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('imageFile', file);
      form.setValue('imageUrl', '');
      setShowUrlInput(false);
      form.clearErrors('imageUrl');
      
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    form.setValue('imageFile', null);
    form.setValue('imageUrl', '');
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    form.setError('imageUrl', { type: 'manual', message: 'Either image URL or file is required' });
  };

  const uploadImage = async (file: File) => {
    try {
      console.log('Starting image upload...');
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await farmersAPI.uploadImage(formData);
      console.log('Image upload response:', response);
      return response.imageUrl;
    } catch (error) {
      console.error('Image upload failed:', error);
      toast({
        title: "Image Upload Failed",
        description: "Could not upload the image. Please try again.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    console.log('Form submission initiated with data:', data);
    
    // First validate the form
    const isValid = await form.trigger();
    console.log('Form validation result:', isValid);
    console.log('Form errors:', form.formState.errors);
    
    if (!isValid) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form before submitting.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    console.log('Starting submission process...');

    try {
      let imageUrl = data.imageUrl;
      
      if (data.imageFile) {
        console.log('Processing image file upload...');
        imageUrl = await uploadImage(data.imageFile);
        console.log('Received image URL:', imageUrl);
      }

      const productData = {
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        subcategory: data.subcategory,
        stock: data.stock,
        origin: data.origin,
        nutritionalInfo: data.nutritionalInfo,
        isOrganic: data.isOrganic,
        unitType: data.unitType,
        imageUrl
      };

      console.log('Prepared product data for submission:', productData);
      
      console.log('Calling farmersAPI.submitProduct...');
      const response = await farmersAPI.submitProduct(productData);
      console.log('API response:', response);
      
      toast({
        title: "Success",
        description: "Product submitted for review successfully!"
      });
      
      // Reset form and close dialog
      form.reset();
      setImagePreview(null);
      onProductSubmitted();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Submission error:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        stack: error.stack
      });
      
      let errorMessage = "Failed to submit product";
      if (error.response) {
        errorMessage = error.response.data?.message || error.response.statusText || errorMessage;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
      console.log('Submission process completed');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submit New Product for Review</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form 
            onSubmit={(e) => {
              console.log('Form submit event triggered');
              e.preventDefault(); // Prevent default form submission
              form.handleSubmit(onSubmit)(e).catch(error => {
                console.error('Form submission error:', error);
              });
            }} 
            className="space-y-4"
          >
            {/* Rest of your form fields */}
            {/* ... */}

            <div className="flex justify-end gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  form.reset();
                  setImagePreview(null);
                  onOpenChange(false);
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                onClick={() => console.log('Submit button clicked')}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit for Review
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}