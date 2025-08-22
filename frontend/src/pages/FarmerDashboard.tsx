import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import { ProductForm } from '@/components/admin/ProductForm'; // This is what you actually have
import { MyProducts } from '@/components/farmer/MyProducts';
import { useAuth } from '@/contexts/AuthContext';
import { farmersAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

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
}

const FarmerDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [products, setProducts] = useState<ProductSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0
  });

  const loadProducts = async () => {
    try {
      const response = await farmersAPI.getMyProducts();
      console.log('API Products Response:', response.data);

      let productsData: ProductSubmission[] = [];

      if (Array.isArray(response.data)) {
        productsData = response.data;
      } else if (Array.isArray(response.data?.products)) {
        productsData = response.data.products;
      }

      // Ensure it's always an array
      if (!Array.isArray(productsData)) {
        productsData = [];
      }

      setProducts(productsData);

      const pending = productsData.filter(p => p.status === 'pending').length;
      const approved = productsData.filter(p => p.status === 'approved').length;
      const rejected = productsData.filter(p => p.status === 'rejected').length;

      setStats({
        pending,
        approved,
        rejected,
        total: productsData.length
      });

    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to load your products",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleProductSubmitted = () => {
    setShowForm(false);
    loadProducts();
    toast({
      title: "Success",
      description: "Product submitted for review successfully!"
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-6 flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Farmer Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.firstName}! Manage your product listings
            </p>
          </div>
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Submit New Product
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Products ({stats.total})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
            <TabsTrigger value="approved">Approved ({stats.approved})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected ({stats.rejected})</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <MyProducts products={products || []} onProductUpdate={loadProducts} />
          </TabsContent>

          <TabsContent value="pending">
            <MyProducts
              products={(products || []).filter(p => p.status === 'pending')}
              onProductUpdate={loadProducts}
            />
          </TabsContent>

          <TabsContent value="approved">
            <MyProducts
              products={(products || []).filter(p => p.status === 'approved')}
              onProductUpdate={loadProducts}
            />
          </TabsContent>

          <TabsContent value="rejected">
            <MyProducts
              products={(products || []).filter(p => p.status === 'rejected')}
              onProductUpdate={loadProducts}
            />
          </TabsContent>
        </Tabs>

        {/* FIXED: Changed ProductSubmissionForm to ProductForm */}
        {showForm && (
          <ProductForm
            onClose={() => setShowForm(false)}
            onSuccess={handleProductSubmitted}
          />
        )}
      </div>
    </Layout>
  );
};

export default FarmerDashboard;