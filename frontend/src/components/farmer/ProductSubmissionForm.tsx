import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { categories } from '@/data/products';
import { farmersAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { ImagePlus, Link, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ProductSubmissionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProductSubmitted: () => void;
}

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  category: string;
  subcategory: string;
  stock: string;
  origin: string;
  nutritionalInfo: string;
  isOrganic: boolean;
  unitType: 'kg' | 'bunch' | 'piece' | 'packet' | 'kit' | 'unit';
  imageUrl: string;
}

export function ProductSubmissionForm({ open, onOpenChange, onProductSubmitted }: ProductSubmissionFormProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    category: '',
    subcategory: '',
    stock: '',
    origin: '',
    nutritionalInfo: '',
    isOrganic: false,
    unitType: 'kg',
    imageUrl: ''
  });

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      subcategory: '',
      stock: '',
      origin: '',
      nutritionalInfo: '',
      isOrganic: false,
      unitType: 'kg',
      imageUrl: ''
    });
    setImageFile(null);
    setImagePreview(null);
    setShowUrlInput(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setShowUrlInput(false);
      setFormData(prev => ({ ...prev, imageUrl: '' }));
      
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    try {
      const response = await farmersAPI.uploadImage(file);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let imageUrl = formData.imageUrl;
      
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const productData = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        imageUrl: imageUrl || undefined,
        status: 'pending' as const // Set status to pending for admin review
      };

      await farmersAPI.submitProduct(productData);
      
      toast({
        title: "Success",
        description: "Product submitted for review successfully! It will be visible after admin approval."
      });
      
      onProductSubmitted();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Product submission failed:', error);
      toast({
        title: "Submission Failed",
        description: error.response?.data?.message || "Failed to submit product. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCategory = categories.find(cat => cat.id === formData.category);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submit New Product for Review</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload Section */}
          <div className="space-y-2">
            <Label>Product Image *</Label>
            <div className="flex flex-col gap-4">
              {imagePreview ? (
                <div className="relative group">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-contain rounded-md border bg-muted"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 rounded-full bg-background/80 hover:bg-background"
                    onClick={handleRemoveImage}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full h-48 border-2 border-dashed rounded-md bg-muted/50">
                  <span className="text-muted-foreground">No image selected</span>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImagePlus className="w-4 h-4 mr-2" />
                  Upload Image
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowUrlInput(!showUrlInput);
                    if (imageFile) handleRemoveImage();
                  }}
                >
                  <Link className="w-4 h-4 mr-2" />
                  {showUrlInput ? 'Hide URL' : 'Use URL'}
                </Button>
              </div>

              {showUrlInput && (
                <div className="space-y-1">
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input
                    id="imageUrl"
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Product Details Section */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
                placeholder="Enter product name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Price (KSh) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                required
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              required
              placeholder="Describe your product in detail..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value, subcategory: '' }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subcategory">Subcategory</Label>
              <Select 
                value={formData.subcategory} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, subcategory: value }))}
                disabled={!selectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {selectedCategory?.subcategories.map((subcategory) => (
                    <SelectItem key={subcategory.id} value={subcategory.id}>
                      {subcategory.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stock">Stock *</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                required
                min="0"
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unitType">Unit Type *</Label>
              <Select 
                value={formData.unitType} 
                onValueChange={(value: 'kg' | 'bunch' | 'piece' | 'packet' | 'kit' | 'unit') => setFormData(prev => ({ ...prev, unitType: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">Kilogram</SelectItem>
                  <SelectItem value="bunch">Bunch</SelectItem>
                  <SelectItem value="piece">Piece</SelectItem>
                  <SelectItem value="packet">Packet</SelectItem>
                  <SelectItem value="kit">Kit</SelectItem>
                  <SelectItem value="unit">Unit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="origin">Origin *</Label>
              <Input
                id="origin"
                value={formData.origin}
                onChange={(e) => setFormData(prev => ({ ...prev, origin: e.target.value }))}
                required
                placeholder="e.g., Nyeri, Kenya"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nutritionalInfo">Nutritional Information</Label>
            <Input
              id="nutritionalInfo"
              value={formData.nutritionalInfo}
              onChange={(e) => setFormData(prev => ({ ...prev, nutritionalInfo: e.target.value }))}
              placeholder="Rich in vitamins, minerals..."
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isOrganic"
              checked={formData.isOrganic}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isOrganic: checked }))}
            />
            <Label htmlFor="isOrganic">Organic Product</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit for Review'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}