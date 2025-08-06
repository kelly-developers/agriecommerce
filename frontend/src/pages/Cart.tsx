import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCartContext } from '@/contexts/CartContext';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems } = useCartContext();

  if (items.length === 0) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center py-16">
            <ShoppingBag className="w-24 h-24 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Discover our fresh African vegetables and add them to your cart
            </p>
            <Button asChild className="bg-gradient-primary">
              <Link to="/">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Shopping Cart</h1>
          <p className="text-muted-foreground">
            {totalItems} item{totalItems !== 1 ? 's' : ''} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.product.id}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                      {item.product.imageUrl && (
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {item.product.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            KSh {item.product.price.toLocaleString()} per {item.product.unitType}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-12 text-center font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= (item.product.stock || Infinity)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>

                        {/* Item Total */}
                        <div className="text-right">
                          <p className="font-bold text-primary">
                            KSh {(item.product.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Order Summary</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>KSh {totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span>KSh 200</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-primary">
                        KSh {(totalPrice + 200).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button asChild className="w-full bg-gradient-primary" size="lg">
                    <Link to="/checkout">Proceed to Checkout</Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full">
                    <Link to="/">Continue Shopping</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;