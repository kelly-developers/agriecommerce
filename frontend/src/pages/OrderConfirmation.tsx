import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Download, Printer, MapPin, User, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

interface OrderData {
  id: string;
  items: any[];
  customerInfo: any;
  deliveryInfo: any;
  subtotal: number;
  deliveryFee: number;
  total: number;
  orderDate: string;
}

const OrderConfirmation = () => {
  const [orderData, setOrderData] = useState<OrderData | null>(null);

  useEffect(() => {
    const storedOrder = localStorage.getItem('currentOrder');
    if (storedOrder) {
      setOrderData(JSON.parse(storedOrder));
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadReceipt = () => {
    if (!orderData) return;
    
    const receiptData = {
      orderNumber: orderData.id,
      date: new Date(orderData.orderDate).toLocaleDateString(),
      customer: orderData.customerInfo,
      delivery: orderData.deliveryInfo,
      items: orderData.items,
      totals: {
        subtotal: orderData.subtotal,
        delivery: orderData.deliveryFee,
        total: orderData.total
      }
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(receiptData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `receipt-${orderData.id}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  if (!orderData) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-foreground mb-2">No order found</h2>
            <p className="text-muted-foreground mb-6">
              We couldn't find your order details
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
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Success Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground">
            Thank you for your order. We'll start preparing it right away.
          </p>
          <Badge className="mt-2 bg-green-100 text-green-800">
            Order #{orderData.id}
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 print:hidden">
          <Button onClick={handlePrint} variant="outline">
            <Printer className="w-4 h-4 mr-2" />
            Print Receipt
          </Button>
          <Button onClick={handleDownloadReceipt} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download Receipt
          </Button>
        </div>

        {/* Order Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="font-medium">
                {orderData.customerInfo.firstName} {orderData.customerInfo.lastName}
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                {orderData.customerInfo.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" />
                {orderData.customerInfo.phone}
              </div>
            </CardContent>
          </Card>

          {/* Delivery Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Delivery Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <p>{orderData.deliveryInfo.address}</p>
              <p>{orderData.deliveryInfo.city}, {orderData.deliveryInfo.county}</p>
              {orderData.deliveryInfo.postalCode && (
                <p>{orderData.deliveryInfo.postalCode}</p>
              )}
              {orderData.deliveryInfo.deliveryNotes && (
                <p className="text-sm text-muted-foreground mt-2">
                  <strong>Notes:</strong> {orderData.deliveryInfo.deliveryNotes}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Items */}
        <Card>
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orderData.items.map((item) => (
                <div key={item.product.id} className="flex items-center gap-4 pb-4 border-b last:border-b-0">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{item.product.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {item.quantity} × KSh {item.product.price.toLocaleString()} per {item.product.unitType}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      KSh {(item.product.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Totals */}
            <div className="border-t pt-4 mt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>KSh {orderData.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>KSh {orderData.deliveryFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total</span>
                <span className="text-primary">KSh {orderData.total.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What's Next */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3">What happens next?</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>1. We'll prepare your fresh vegetables with care</p>
              <p>2. Our delivery team will contact you to confirm delivery time</p>
              <p>3. Your order will be delivered fresh to your doorstep</p>
              <p>4. Payment will be collected upon delivery (Cash on Delivery)</p>
            </div>
            <div className="mt-4 p-3 bg-accent/20 rounded-lg">
              <p className="text-sm">
                <strong>Estimated Delivery:</strong> 1-2 business days
              </p>
              <p className="text-sm mt-1">
                <strong>Payment Method:</strong> Cash on Delivery (COD)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Continue Shopping */}
        <div className="text-center print:hidden">
          <Button asChild className="bg-gradient-primary" size="lg">
            <Link to="/">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default OrderConfirmation;