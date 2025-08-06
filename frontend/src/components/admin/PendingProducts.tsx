import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { CheckCircle, XCircle, Eye, Search, Clock } from 'lucide-react';
import { adminAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface ProductSubmission {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  subcategory?: string;
  stock: number;
  origin: string;
  nutritionalInfo?: string;
  isOrganic: boolean;
  unitType: 'kg' | 'bunch' | 'piece' | 'packet' | 'kit' | 'unit';
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
  farmerName: string;
  farmerEmail: string;
}

export function PendingProducts() {
  const [products, setProducts] = useState<ProductSubmission[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<ProductSubmission | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');
  const [rejectionReason, setRejectionReason] = useState('');
  const { toast } = useToast();

  const loadPendingProducts = async () => {
    try {
      const response = await adminAPI.getPendingProducts();
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load pending products",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPendingProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.farmerName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const handleApproveProduct = async (productId: string) => {
    try {
      await adminAPI.approveProduct(productId);
      toast({
        title: "Success",
        description: "Product approved successfully"
      });
      loadPendingProducts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to approve product",
        variant: "destructive"
      });
    }
  };

  const handleRejectProduct = async (productId: string, reason: string) => {
    try {
      await adminAPI.rejectProduct(productId, { reason });
      toast({
        title: "Success",
        description: "Product rejected successfully"
      });
      loadPendingProducts();
      setRejectionReason('');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to reject product",
        variant: "destructive"
      });
    }
  };

  const openActionDialog = (product: ProductSubmission, action: 'approve' | 'reject') => {
    setSelectedProduct(product);
    setActionType(action);
    setActionDialogOpen(true);
  };

  const handleActionConfirm = () => {
    if (!selectedProduct) return;

    if (actionType === 'approve') {
      handleApproveProduct(selectedProduct.id);
    } else {
      if (!rejectionReason.trim()) {
        toast({
          title: "Error",
          description: "Please provide a reason for rejection",
          variant: "destructive"
        });
        return;
      }
      handleRejectProduct(selectedProduct.id, rejectionReason);
    }
    setActionDialogOpen(false);
    setSelectedProduct(null);
  };

  const viewProduct = (product: ProductSubmission) => {
    setSelectedProduct(product);
    setViewDialogOpen(true);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading pending products...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-500" />
              Pending Product Approvals ({filteredProducts.length})
            </CardTitle>
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-lg font-medium text-muted-foreground">No pending products</p>
              <p className="text-sm text-muted-foreground">All products have been reviewed!</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Farmer</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-md cursor-pointer"
                        onClick={() => viewProduct(product)}
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground truncate max-w-xs">
                          {product.description}
                        </p>
                        {product.isOrganic && (
                          <Badge variant="secondary" className="text-xs mt-1">
                            Organic
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{product.farmerName}</p>
                        <p className="text-sm text-muted-foreground">{product.farmerEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{product.category}</p>
                        {product.subcategory && (
                          <p className="text-sm text-muted-foreground">{product.subcategory}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">KSH {product.price.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">per {product.unitType}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">
                        {format(new Date(product.submittedAt), 'MMM dd, yyyy')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(product.submittedAt), 'HH:mm')}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => viewProduct(product)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openActionDialog(product, 'approve')}
                          className="text-green-600 border-green-600 hover:bg-green-50"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openActionDialog(product, 'reject')}
                          className="text-red-600 border-red-600 hover:bg-red-50"
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Product Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              <div className="flex gap-4">
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.name}
                  className="w-32 h-32 object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{selectedProduct.name}</h3>
                  <p className="text-lg text-primary font-semibold">KSH {selectedProduct.price.toFixed(2)} per {selectedProduct.unitType}</p>
                  <p className="text-muted-foreground">Stock: {selectedProduct.stock} {selectedProduct.unitType}s</p>
                  <p className="text-muted-foreground">Origin: {selectedProduct.origin}</p>
                  {selectedProduct.isOrganic && (
                    <Badge variant="secondary" className="mt-2">Organic</Badge>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-muted-foreground">{selectedProduct.description}</p>
              </div>

              {selectedProduct.nutritionalInfo && (
                <div>
                  <h4 className="font-semibold mb-2">Nutritional Information</h4>
                  <p className="text-muted-foreground">{selectedProduct.nutritionalInfo}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold">Category:</span> {selectedProduct.category}
                </div>
                {selectedProduct.subcategory && (
                  <div>
                    <span className="font-semibold">Subcategory:</span> {selectedProduct.subcategory}
                  </div>
                )}
                <div>
                  <span className="font-semibold">Farmer:</span> {selectedProduct.farmerName}
                </div>
                <div>
                  <span className="font-semibold">Email:</span> {selectedProduct.farmerEmail}
                </div>
                <div>
                  <span className="font-semibold">Submitted:</span> {format(new Date(selectedProduct.submittedAt), 'MMM dd, yyyy HH:mm')}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Action Confirmation Dialog */}
      <AlertDialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === 'approve' ? 'Approve Product' : 'Reject Product'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === 'approve' 
                ? `Are you sure you want to approve "${selectedProduct?.name}"? This will make it visible to customers.`
                : `Are you sure you want to reject "${selectedProduct?.name}"? Please provide a reason.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          {actionType === 'reject' && (
            <div className="my-4">
              <label className="text-sm font-medium">Rejection Reason</label>
              <Textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Please provide a detailed reason for rejection..."
                className="mt-2"
              />
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleActionConfirm}
              className={actionType === 'approve' 
                ? "bg-green-600 hover:bg-green-700" 
                : "bg-red-600 hover:bg-red-700"
              }
            >
              {actionType === 'approve' ? 'Approve' : 'Reject'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}