import { useState } from 'react';
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

interface ProductFormProps {
  onClose: () => void;
  onSuccess: () => void;
  product?: Product;
}

export function ProductForm({ onClose, onSuccess, product }: ProductFormProps) {
  const { toast } = useToast();
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
    image: product?.image || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, String(value));
      });

      if (product) {
        await productsAPI.update(product.id, submitData);
        toast({
          title: "Success",
          description: "Product updated successfully"
        });
      } else {
        await productsAPI.create(submitData);
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
    }
  };

  const selectedCategory = categories.find(cat => cat.id === formData.category);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        <Label htmlFor="image">Image URL</Label>
        <Input
          id="image"
          type="url"
          value={formData.image}
          onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
          placeholder="https://example.com/image.jpg"
        />
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
        <Button type="submit">
          {product ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
}