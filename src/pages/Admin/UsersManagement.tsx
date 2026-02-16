import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { User, Search, Edit, Trash2, Plus, X, Shield, CheckCircle, XCircle } from 'lucide-react';

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  user_type: string;
  state: string;
  lga: string;
  address: string;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  email?: string;
}

export default function UsersManagement() {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: '',
    user_type: 'customer',
    state: '',
    lga: '',
    address: ''
  });

  useEffect(() => {
    if (user?.type === 'admin' || user?.type === 'super_admin') {
      loadUsers();
    }
  }, [user, filterType]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('users_profile')
        .select('*')
        .order('created_at', { ascending: false });

      if (filterType !== 'all') {
        query = query.eq('user_type', filterType);
      }

      const { data, error } = await query;

      if (error) throw error;

      const usersWithEmails = await Promise.all(
        (data || []).map(async (profile) => {
          const { data: authUser } = await supabase.auth.admin.getUserById(profile.id);
          return {
            ...profile,
            email: authUser?.user?.email || ''
          };
        })
      );

      setUsers(usersWithEmails);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: formData.email,
        password: formData.password,
        email_confirm: true
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Failed to create user');

      const { error: profileError } = await supabase
        .from('users_profile')
        .insert({
          id: authData.user.id,
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone,
          user_type: formData.user_type,
          state: formData.state,
          lga: formData.lga,
          address: formData.address,
          is_verified: true,
          is_active: true
        });

      if (profileError) throw profileError;

      if (formData.user_type === 'service_provider') {
        await supabase.from('service_providers').insert({
          user_id: authData.user.id,
          bio: '',
          service_categories: [],
          experience_years: 0
        });
      }

      await logAdminAction('create_user', 'user', authData.user.id);

      setShowModal(false);
      resetForm();
      await loadUsers();
      alert('User created successfully!');
    } catch (error: any) {
      alert('Error creating user: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from('users_profile')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone,
          user_type: formData.user_type,
          state: formData.state,
          lga: formData.lga,
          address: formData.address
        })
        .eq('id', editingUser.id);

      if (error) throw error;

      await logAdminAction('update_user', 'user', editingUser.id);

      setShowModal(false);
      setEditingUser(null);
      resetForm();
      await loadUsers();
      alert('User updated successfully!');
    } catch (error: any) {
      alert('Error updating user: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    if (!confirm(`Are you sure you want to ${currentStatus ? 'deactivate' : 'activate'} this user?`)) return;

    try {
      const { error } = await supabase
        .from('users_profile')
        .update({ is_active: !currentStatus })
        .eq('id', userId);

      if (error) throw error;

      await logAdminAction('toggle_user_status', 'user', userId);
      await loadUsers();
    } catch (error: any) {
      alert('Error updating user status: ' + error.message);
    }
  };

  const handleToggleVerification = async (userId: string, currentStatus: boolean) => {
    if (!confirm(`Are you sure you want to ${currentStatus ? 'unverify' : 'verify'} this user?`)) return;

    try {
      const { error } = await supabase
        .from('users_profile')
        .update({ is_verified: !currentStatus })
        .eq('id', userId);

      if (error) throw error;

      await logAdminAction('toggle_user_verification', 'user', userId);
      await loadUsers();
    } catch (error: any) {
      alert('Error updating verification status: ' + error.message);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

    if (user?.type !== 'super_admin') {
      alert('Only super admins can delete users');
      return;
    }

    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);

      if (error) throw error;

      await logAdminAction('delete_user', 'user', userId);
      await loadUsers();
      alert('User deleted successfully!');
    } catch (error: any) {
      alert('Error deleting user: ' + error.message);
    }
  };

  const logAdminAction = async (action: string, targetType: string, targetId: string) => {
    try {
      await supabase.from('admin_logs').insert({
        admin_id: user?.id,
        action,
        target_type: targetType,
        target_id: targetId
      });
    } catch (error) {
      console.error('Error logging admin action:', error);
    }
  };

  const openCreateModal = () => {
    resetForm();
    setEditingUser(null);
    setShowModal(true);
  };

  const openEditModal = (userProfile: UserProfile) => {
    setEditingUser(userProfile);
    setFormData({
      email: userProfile.email || '',
      password: '',
      first_name: userProfile.first_name,
      last_name: userProfile.last_name,
      phone: userProfile.phone,
      user_type: userProfile.user_type,
      state: userProfile.state,
      lga: userProfile.lga,
      address: userProfile.address || ''
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      phone: '',
      user_type: 'customer',
      state: '',
      lga: '',
      address: ''
    });
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch =
      u.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone.includes(searchTerm);

    return matchesSearch;
  });

  const getUserTypeColor = (type: string) => {
    switch (type) {
      case 'super_admin': return 'bg-purple-100 text-purple-700';
      case 'admin': return 'bg-red-100 text-red-700';
      case 'service_provider': return 'bg-blue-100 text-blue-700';
      case 'customer': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (user?.type !== 'admin' && user?.type !== 'super_admin') {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-600 mt-2">Manage all platform users and administrators</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-forest-600 text-white px-4 py-2 rounded-lg hover:bg-forest-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create User
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="customer">Customers</option>
            <option value="service_provider">Service Providers</option>
            <option value="admin">Admins</option>
            <option value="super_admin">Super Admins</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-forest-600"></div>
            <p className="text-gray-600 mt-4">Loading users...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Phone</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Location</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredUsers.map(userProfile => (
                  <tr key={userProfile.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {userProfile.first_name} {userProfile.last_name}
                        </p>
                        <p className="text-xs text-gray-500">ID: {userProfile.id.slice(0, 8)}...</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">{userProfile.email}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{userProfile.phone}</td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUserTypeColor(userProfile.user_type)}`}>
                        {userProfile.user_type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {userProfile.state}, {userProfile.lga}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => handleToggleStatus(userProfile.id, userProfile.is_active)}
                          className={`flex items-center gap-1 text-xs ${userProfile.is_active ? 'text-green-600' : 'text-gray-400'}`}
                        >
                          {userProfile.is_active ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {userProfile.is_active ? 'Active' : 'Inactive'}
                        </button>
                        <button
                          onClick={() => handleToggleVerification(userProfile.id, userProfile.is_verified)}
                          className={`flex items-center gap-1 text-xs ${userProfile.is_verified ? 'text-blue-600' : 'text-gray-400'}`}
                        >
                          {userProfile.is_verified ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {userProfile.is_verified ? 'Verified' : 'Unverified'}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(userProfile)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit user"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {user?.type === 'super_admin' && userProfile.user_type !== 'super_admin' && (
                          <button
                            onClick={() => handleDeleteUser(userProfile.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete user"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No users found</p>
              </div>
            )}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingUser ? 'Edit User' : 'Create New User'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingUser(null);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={editingUser ? handleUpdateUser : handleCreateUser} className="p-6 space-y-4">
              {!editingUser && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                      minLength={6}
                    />
                  </div>
                </>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">User Type *</label>
                <select
                  required
                  value={formData.user_type}
                  onChange={(e) => setFormData({ ...formData, user_type: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                  disabled={user?.type !== 'super_admin' && (formData.user_type === 'admin' || formData.user_type === 'super_admin')}
                >
                  <option value="customer">Customer</option>
                  <option value="service_provider">Service Provider</option>
                  {user?.type === 'super_admin' && (
                    <>
                      <option value="admin">Admin</option>
                      <option value="super_admin">Super Admin</option>
                    </>
                  )}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">LGA *</label>
                  <input
                    type="text"
                    required
                    value={formData.lga}
                    onChange={(e) => setFormData({ ...formData, lga: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-forest-600 text-white py-2 rounded-lg hover:bg-forest-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Processing...' : editingUser ? 'Update User' : 'Create User'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingUser(null);
                    resetForm();
                  }}
                  className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
