import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { categories } from '@/data/products';
import { Product } from '@/types/product';
import { productsAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { ImagePlus, Link, X } from 'lucide-react';

interface ProductFormProps {
  onClose: () => void;
  onSuccess: () => void;
  product?: Product;
}

export function ProductForm({ onClose, onSuccess, product }: ProductFormProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    category: product?.category || '',
    subcategory: product?.subcategory || '',
    stock: product?.stock || '',
    origin: product?.origin || '',
    nutritionalInfo: product?.nutritionalInfo || '',
    isOrganic: product?.isOrganic || false,
    unitType: (product?.unitType || 'kg') as 'kg' | 'bunch' | 'piece' | 'packet' | 'kit' | 'unit',
    imageUrl: product?.imageUrl || ''
  });

  useEffect(() => {
    if (product?.imageUrl) {
      setImagePreview(product.imageUrl);
    }
  }, [product]);

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

  const uploadImage = async (file: File) => {
    try {
      const response = await productsAPI.uploadImage(file);
      return response.imageUrl; // Assuming your API returns { imageUrl: string }
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
    setIsUploading(true);
    
    try {
      let imageUrl = formData.imageUrl;
      
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const productData = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        imageUrl: imageUrl || undefined
      };

      if (product) {
        await productsAPI.update(product.id, productData);
        toast({
          title: "Success",
          description: "Product updated successfully"
        });
      } else {
        await productsAPI.create(productData);
        toast({
          title: "Success", 
          description: "Product created successfully"
        });
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${product ? 'update' : 'create'} product`,
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const selectedCategory = categories.find(cat => cat.id === formData.category);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Image Upload Section */}
      <div className="space-y-2">
        <Label>Product Image</Label>
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
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="price">Price (KSh)</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
            required
            min="0"
            step="0.01"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value, subcategory: '' }))}>
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
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
            required
            min="0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="unitType">Unit Type</Label>
          <Select value={formData.unitType} onValueChange={(value: 'kg' | 'bunch' | 'piece' | 'packet' | 'kit' | 'unit') => setFormData(prev => ({ ...prev, unitType: value }))}>
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
          <Label htmlFor="origin">Origin</Label>
          <Input
            id="origin"
            value={formData.origin}
            onChange={(e) => setFormData(prev => ({ ...prev, origin: e.target.value }))}
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

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isUploading}>
          {isUploading ? 'Processing...' : product ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
}