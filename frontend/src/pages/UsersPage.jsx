import React, { useState, useEffect } from 'react';
import { Users as UsersIcon, Plus, UserCheck, Shield, AlertTriangle, RefreshCw } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import GlassCard from '../components/common/GlassCard';
import GlassTable from '../components/common/GlassTable';
import GlassBadge from '../components/common/GlassBadge';
import GlassButton from '../components/common/GlassButton';
import GlassModal from '../components/common/GlassModal';
import GlassInput from '../components/common/GlassInput';
import GlassSelect from '../components/common/GlassSelect';
import ErrorState from '../components/common/ErrorState';

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const { addToast } = useToast();

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('staff');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/users');
      setUsers(data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          'Failed to load user accounts. Please check your backend connection.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleActive = async (targetUser) => {
    if (targetUser.id === currentUser?.id) {
      addToast({
        type: 'warning',
        title: 'Action Prohibited',
        message: 'You cannot deactivate your own account.',
      });
      return;
    }

    try {
      const { data } = await api.patch(`/users/${targetUser.id}/toggle-active`);
      setUsers((prev) => prev.map((u) => (u.id === data.id ? data : u)));
      addToast({
        type: 'success',
        title: 'User Status Updated',
        message: `${data.full_name} is now ${data.is_active ? 'Active' : 'Inactive'}.`,
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Update Failed',
        message: err.response?.data?.detail || 'Unable to update user status.',
      });
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!fullName || !email || !password) {
      setFormError('All fields are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await api.post('/users', {
        full_name: fullName,
        email,
        password,
        role,
        is_active: true,
      });

      setUsers((prev) => [data, ...prev]);
      setIsModalOpen(false);
      setFullName('');
      setEmail('');
      setPassword('');
      setRole('staff');

      addToast({
        type: 'success',
        title: 'User Created',
        message: `Account for ${data.full_name} has been added.`,
      });
    } catch (err) {
      setFormError(err.response?.data?.detail || 'Failed to create user account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) {
    return <ErrorState message={error} onRetry={fetchUsers} />;
  }

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-espresso-900 dark:text-cream-50">
            Staff & Access Control
          </h2>
          <p className="text-sm text-espresso-900/60 dark:text-cream-200/60">
            Manage system administrators, barista staff, and account statuses.
          </p>
        </div>

        <GlassButton
          variant="primary"
          onClick={() => setIsModalOpen(true)}
          className="gap-2 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add Team Member</span>
        </GlassButton>
      </div>

      {/* Users Table */}
      <GlassTable
        headers={['Name & Email', 'Role', 'Status', 'Created', 'Actions']}
      >
        {isLoading ? (
          <tr>
            <td colSpan={5} className="px-4 py-8 text-center text-sm text-espresso-900/60 dark:text-cream-200/60">
              <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-caramel-500" />
              Loading staff accounts...
            </td>
          </tr>
        ) : users.length === 0 ? (
          <tr>
            <td colSpan={5} className="px-4 py-8 text-center text-sm text-espresso-900/60 dark:text-cream-200/60">
              No users registered yet.
            </td>
          </tr>
        ) : (
          users.map((u) => (
            <tr
              key={u.id}
              className="hover:bg-white/30 dark:hover:bg-white/5 transition-colors"
            >
              <td className="px-4 py-3.5">
                <div className="font-semibold text-espresso-900 dark:text-cream-50">
                  {u.full_name}
                </div>
                <div className="text-xs text-espresso-900/60 dark:text-cream-200/60 font-mono">
                  {u.email}
                </div>
              </td>
              <td className="px-4 py-3.5">
                <GlassBadge variant={u.role === 'admin' ? 'admin' : 'staff'}>
                  {u.role}
                </GlassBadge>
              </td>
              <td className="px-4 py-3.5">
                <GlassBadge variant={u.is_active ? 'sage' : 'danger'}>
                  {u.is_active ? 'Active' : 'Inactive'}
                </GlassBadge>
              </td>
              <td className="px-4 py-3.5 text-xs text-espresso-900/70 dark:text-cream-200/70">
                {new Date(u.created_at).toLocaleDateString()}
              </td>
              <td className="px-4 py-3.5">
                <GlassButton
                  size="sm"
                  variant={u.is_active ? 'ghost' : 'sage'}
                  disabled={u.id === currentUser?.id}
                  onClick={() => handleToggleActive(u)}
                >
                  {u.is_active ? 'Deactivate' : 'Reactivate'}
                </GlassButton>
              </td>
            </tr>
          ))
        )}
      </GlassTable>

      {/* Add User Modal */}
      <GlassModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Team Member"
        subtitle="Create credentials for a cafe manager or barista"
      >
        <form onSubmit={handleCreateUser} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-600 dark:text-red-400 text-xs font-medium">
              {formError}
            </div>
          )}

          <GlassInput
            label="Full Name"
            placeholder="e.g. Alex Morgan"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <GlassInput
            label="Email Address"
            type="email"
            placeholder="alex@cafepulse.demo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <GlassInput
            label="Initial Password"
            type="password"
            placeholder="Minimum 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <GlassSelect
            label="System Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            options={[
              { value: 'staff', label: 'Staff (POS & Orders Only)' },
              { value: 'admin', label: 'Admin (Full System Control)' },
            ]}
          />

          <div className="flex items-center justify-end gap-2.5 pt-4">
            <GlassButton
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </GlassButton>
            <GlassButton
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
            >
              Create Account
            </GlassButton>
          </div>
        </form>
      </GlassModal>
    </div>
  );
}
