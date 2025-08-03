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
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden border border-border/50 hover:border-primary/20 h-fit">
      <Link to={`/product/${product.id}`}>
        <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-muted/30 to-muted/10">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>
      
      <CardContent className="p-3">
        <div className="mb-2">
          <Link to={`/product/${product.id}`}>
            <h3 className="font-medium text-sm text-foreground line-clamp-1 mb-1 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs px-2 py-0.5">
              {product.category}
            </Badge>
            {product.isOrganic && (
              <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-green-100 text-green-700">
                <Leaf className="w-3 h-3 mr-1" />
                Organic
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-primary">
              KSh {product.price.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground">
              per {product.unitType || 'kg'}
            </span>
          </div>
          
          <Button
            onClick={() => onAddToCart(product)}
            size="sm"
            className="bg-gradient-primary hover:shadow-md transition-all duration-200 h-8 px-3 text-xs"
            disabled={product.stock === 0}
          >
            <ShoppingCart className="w-3 h-3 mr-1" />
            {product.stock === 0 ? 'Out' : 'Add'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}