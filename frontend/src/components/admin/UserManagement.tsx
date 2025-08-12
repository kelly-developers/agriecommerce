import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Eye, Mail, Ban, Search, UserCheck, UserX, Loader2 } from 'lucide-react';
import { usersAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: 'ACTIVE' | 'INACTIVE' | 'BANNED';
  createdAt: string;
  ordersCount?: number;
}

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await usersAPI.getAllAdmin();
      setUsers(Array.isArray(data) ? data : data?.content || []);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (userId: string, currentStatus: string) => {
    try {
      setUpdatingStatus(userId);
      const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      await usersAPI.updateUserStatus(userId, newStatus);
      await loadUsers();
      toast({
        title: "Success",
        description: `User ${newStatus.toLowerCase()} successfully`
      });
    } catch (error) {
      console.error('Error updating user status:', error);
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive"
      });
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleBanUser = async (userId: string) => {
    try {
      setUpdatingStatus(userId);
      await usersAPI.updateUserStatus(userId, 'BANNED');
      await loadUsers();
      toast({
        title: "Success",
        description: "User banned successfully"
      });
    } catch (error) {
      console.error('Error banning user:', error);
      toast({
        title: "Error",
        description: "Failed to ban user",
        variant: "destructive"
      });
    } finally {
      setUpdatingStatus(null);
    }
  };

  const filteredUsers = users.filter(user =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin': return 'destructive';
      case 'customer': return 'default';
      case 'farmer': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'default';
      case 'INACTIVE': return 'secondary';
      case 'BANNED': return 'destructive';
      default: return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>User Management</CardTitle>
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users by name, email or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Orders</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.firstName} {user.lastName}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {user.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getRoleColor(user.role)}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(user.status)}>
                        {user.status.charAt(0) + user.status.slice(1).toLowerCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {user.ordersCount || 0}
                    </TableCell>
                    <TableCell>
                      {format(new Date(user.createdAt), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={updatingStatus === user.id}
                          onClick={() => handleStatusUpdate(user.id, user.status)}
                        >
                          {updatingStatus === user.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : user.status === 'ACTIVE' ? (
                            <>
                              <UserX className="h-4 w-4 mr-2" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <UserCheck className="h-4 w-4 mr-2" />
                              Activate
                            </>
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          disabled={updatingStatus === user.id || user.status === 'BANNED'}
                          onClick={() => handleBanUser(user.id)}
                        >
                          <Ban className="h-4 w-4 mr-2" />
                          Ban
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-24">
                    {users.length === 0 ? 'No users found' : 'No matching users found'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}