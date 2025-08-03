import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCartContext } from '@/contexts/CartContext';
import { CustomerInfo, DeliveryInfo } from '@/types/product';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { ordersAPI } from '@/services/api';
import MpesaPayment from '@/components/MpesaPayment';

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCartContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [showPayment, setShowPayment] = useState(false);
  
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo>({
    address: '',
    city: '',
    county: '',
    postalCode: '',
    deliveryNotes: ''
  });

  const deliveryFee = 200;
  const finalTotal = totalPrice + deliveryFee;

  const handleCustomerInfoChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleDeliveryInfoChange = (field: keyof DeliveryInfo, value: string) => {
    setDeliveryInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredCustomerFields = ['firstName', 'lastName', 'email', 'phone'];
    const requiredDeliveryFields = ['address', 'city', 'county'];
    
    const missingCustomerFields = requiredCustomerFields.filter(
      field => !customerInfo[field as keyof CustomerInfo]
    );
    const missingDeliveryFields = requiredDeliveryFields.filter(
      field => !deliveryInfo[field as keyof DeliveryInfo]
    );

    if (missingCustomerFields.length > 0 || missingDeliveryFields.length > 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to place an order.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    // Show payment modal
    setShowPayment(true);
  };

  const handlePaymentSuccess = async (paymentReference: string) => {
    try {
      // Create order via API
      const orderData = await ordersAPI.create({
        customerInfo,
        deliveryInfo,
        paymentReference,
      });

      // Store order data for confirmation page
      localStorage.setItem('currentOrder', JSON.stringify(orderData));
      
      // Clear cart and navigate to confirmation
      clearCart();
      navigate('/order-confirmation');
      
      toast({
        title: "Order Placed Successfully!",
        description: "Your order has been confirmed and will be processed shortly.",
      });
    } catch (error: any) {
      toast({
        title: "Order Creation Failed",
        description: error.response?.data?.message || "Failed to create order",
        variant: "destructive"
      });
    }
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-foreground mb-2">No items to checkout</h2>
            <p className="text-muted-foreground mb-6">
              Add some products to your cart before proceeding to checkout
            </p>
            <Button asChild className="bg-gradient-primary">
              <a href="/">Continue Shopping</a>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Checkout</h1>
          <p className="text-muted-foreground">
            Complete your order by providing your details below
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Customer Information */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={customerInfo.firstName}
                        onChange={(e) => handleCustomerInfoChange('firstName', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={customerInfo.lastName}
                        onChange={(e) => handleCustomerInfoChange('lastName', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => handleCustomerInfoChange('email', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => handleCustomerInfoChange('phone', e.target.value)}
                      placeholder="+254 XXX XXX XXX"
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Delivery Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="address">Delivery Address *</Label>
                    <Input
                      id="address"
                      value={deliveryInfo.address}
                      onChange={(e) => handleDeliveryInfoChange('address', e.target.value)}
                      placeholder="House number, street name"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City/Town *</Label>
                      <Input
                        id="city"
                        value={deliveryInfo.city}
                        onChange={(e) => handleDeliveryInfoChange('city', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="county">County *</Label>
                      <Input
                        id="county"
                        value={deliveryInfo.county}
                        onChange={(e) => handleDeliveryInfoChange('county', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      value={deliveryInfo.postalCode}
                      onChange={(e) => handleDeliveryInfoChange('postalCode', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="deliveryNotes">Delivery Notes</Label>
                    <Textarea
                      id="deliveryNotes"
                      value={deliveryInfo.deliveryNotes}
                      onChange={(e) => handleDeliveryInfoChange('deliveryNotes', e.target.value)}
                      placeholder="Any special instructions for delivery"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium text-sm">{item.product.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.quantity} × KSh {item.product.price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <span className="font-medium">
                        KSh {(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                  
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>KSh {totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>KSh {deliveryFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Total</span>
                      <span className="text-primary">KSh {finalTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button type="submit" className="w-full bg-gradient-primary" size="lg">
                Proceed to Payment
              </Button>
            </div>
          </div>
        </form>

        {/* M-Pesa Payment Modal */}
        {showPayment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <MpesaPayment
              amount={finalTotal}
              onPaymentSuccess={handlePaymentSuccess}
              onCancel={() => setShowPayment(false)}
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Checkout;