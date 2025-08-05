import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Smartphone } from 'lucide-react';
import { mpesaAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface MpesaPaymentProps {
  amount: number;
  onPaymentSuccess: (paymentReference: string) => void;
  onCancel: () => void;
}

const MpesaPayment = ({ amount, onPaymentSuccess, onCancel }: MpesaPaymentProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutRequestId, setCheckoutRequestId] = useState<string | null>(null);
  const { toast } = useToast();

  const initiatePayment = async () => {
    if (!phoneNumber) {
      toast({
        title: "Phone Number Required",
        description: "Please enter your M-Pesa phone number",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      const response = await mpesaAPI.initiate({
        amount,
        phoneNumber,
        accountReference: `ORDER-${Date.now()}`,
        transactionDesc: `Payment for AI Alliance Agriculture order`,
      });

      setCheckoutRequestId(response.checkoutRequestId);
      
      toast({
        title: "Payment Initiated",
        description: "Please check your phone for the M-Pesa prompt",
      });

      // Poll for payment status
      const pollInterval = setInterval(async () => {
        try {
          const statusResponse = await mpesaAPI.checkStatus(response.checkoutRequestId);
          
          if (statusResponse.status === 'SUCCESS') {
            clearInterval(pollInterval);
            setIsProcessing(false);
            onPaymentSuccess(statusResponse.transactionId);
            
            toast({
              title: "Payment Successful",
              description: "Your payment has been processed successfully!",
            });
          } else if (statusResponse.status === 'FAILED') {
            clearInterval(pollInterval);
            setIsProcessing(false);
            
            toast({
              title: "Payment Failed",
              description: "Your payment could not be processed. Please try again.",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error('Error checking payment status:', error);
        }
      }, 3000);

      // Stop polling after 2 minutes
      setTimeout(() => {
        clearInterval(pollInterval);
        if (isProcessing) {
          setIsProcessing(false);
          toast({
            title: "Payment Timeout",
            description: "Payment verification timed out. Please contact support if payment was deducted.",
            variant: "destructive",
          });
        }
      }, 120000);

    } catch (error: any) {
      setIsProcessing(false);
      toast({
        title: "Payment Error",
        description: error.response?.data?.message || "Failed to initiate payment",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-green-600" />
          M-Pesa Payment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">
            KSh {amount.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">Total Amount</p>
        </div>

        <div>
          <Label htmlFor="phoneNumber">M-Pesa Phone Number</Label>
          <Input
            id="phoneNumber"
            type="tel"
            placeholder="254XXXXXXXXX"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            disabled={isProcessing}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Enter your phone number without the + sign (e.g., 254712345678)
          </p>
        </div>

        {isProcessing && (
          <div className="text-center p-4 bg-muted rounded-lg">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
            <p className="text-sm">
              {checkoutRequestId 
                ? "Please check your phone and enter your M-Pesa PIN..."
                : "Initiating payment..."}
            </p>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={initiatePayment}
            disabled={isProcessing}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            {isProcessing ? 'Processing...' : 'Pay with M-Pesa'}
          </Button>
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isProcessing}
          >
            Cancel
          </Button>
        </div>

        <div className="text-xs text-center text-muted-foreground">
          <p>Powered by Safaricom M-Pesa</p>
          <p>Your payment is secure and encrypted</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MpesaPayment;