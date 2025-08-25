import { Product } from '@/types/product';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  // Ensure image URL is properly formatted
  const getImageUrl = (url: string) => {
    if (!url) return '/placeholder-image.jpg';
    if (url.startsWith('http')) return url;
    // If it's a relative path, make sure it's properly formatted
    return url.startsWith('/') ? url : `/${url}`;
  };

  return (
    <Card className="group hover:shadow-md transition-all duration-200 overflow-hidden border border-border/50 hover:border-primary/20 w-full max-w-[180px] sm:max-w-[200px]">
      <Link to={`/product/${product.id}`}>
        <div className="aspect-square overflow-hidden bg-gradient-to-br from-muted/30 to-muted/10">
          <img
            src={getImageUrl(product.imageUrl)}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            onError={(e) => {
              // Fallback if image fails to load
              (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
            }}
          />
        </div>
      </Link>
      
      <CardContent className="p-2">
        <div className="mb-2">
          <Link to={`/product/${product.id}`}>
            <h3 className="font-medium text-xs sm:text-sm text-foreground line-clamp-2 mb-1 group-hover:text-primary transition-colors leading-tight">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-center gap-1 flex-wrap">
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5 hidden sm:inline-flex">
              {product.category}
            </Badge>
            {product.isOrganic && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5 bg-green-100 text-green-700">
                <Leaf className="w-2.5 h-2.5 mr-0.5" />
                <span className="hidden sm:inline">Organic</span>
                <span className="sm:hidden">Org</span>
              </Badge>
            )}
          </div>
        </div>
        
        <div className="space-y-1.5">
          <div className="text-center">
            <span className="text-sm font-bold text-primary block">
              KSh {product.price.toLocaleString()}
            </span>
            <span className="text-[10px] text-muted-foreground">
              /{product.unitType || 'kg'}
            </span>
          </div>
          
          <Button
            onClick={() => onAddToCart(product)}
            size="sm"
            className="w-full bg-gradient-primary hover:shadow-md transition-all duration-200 h-7 px-2 text-[10px] sm:text-xs"
            disabled={product.stock === 0}
          >
            <ShoppingCart className="w-3 h-3 mr-1" />
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}