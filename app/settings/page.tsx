'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Settings as SettingsIcon, 
  User, 
  Shield, 
  Palette,
  Download,
  Trash2,
  Save,
  Camera,
  Bell,
  Smartphone
} from 'lucide-react';
import { usePushNotifications } from '@/lib/push-notifications';
import { SecurityDashboard } from '@/components/security/security-dashboard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Modal } from '@/components/ui/modal';
import { UserAvatar } from '@/components/ui/user-avatar';
import { AvatarSelector } from '@/components/ui/avatar-selector';
import { ProfessionalLayout } from '@/components/layout/professional-layout';
import { useAuth } from '@/hooks/useAuth';
import { userUpdateSchema, type UserUpdateInput } from '@/lib/validations';

export default function SettingsPage() {
  const { user, accessToken, updateUser, logout } = useAuth();
  const { requestPermission, subscribe, unsubscribe, isSupported } = usePushNotifications();
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [pushSubscribed, setPushSubscribed] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserUpdateInput>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      name: user?.name || '',
      preferences: {
        currency: user?.preferences?.currency || 'USD',
        dateFormat: user?.preferences?.dateFormat || 'MM/dd/yyyy',
        theme: user?.preferences?.theme || 'system',
      },
    },
  });

  // Check notification permission on mount
  useEffect(() => {
    if (isSupported) {
      setNotificationPermission(Notification.permission);
    }
  }, [isSupported]);

  const onSubmit = async (data: UserUpdateInput) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update profile');
      }

      // Update local user state
      updateUser(result.data);
      alert('Profile updated successfully');
    } catch (error: any) {
      alert(`Error: ${error.message || 'Failed to update profile'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarSelect = async (avatarId: string) => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ avatar: avatarId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update avatar');
      }

      // Update local user state
      updateUser(result.data);
      alert('Avatar updated successfully');
    } catch (error: any) {
      alert(`Error: ${error.message || 'Failed to update avatar'}`);
    }
  };

  const handleExportData = async () => {
    try {
      const response = await fetch('/api/export/user-data', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `finflow-data-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        alert('Data exported successfully');
      }
    } catch (error) {
      alert('Failed to export data');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        logout();
        alert('Account deleted successfully');
        window.location.href = '/login';
      }
    } catch (error: any) {
      alert(`Error: ${error.message || 'Failed to delete account'}`);
    }
  };

  const handleNotificationToggle = async () => {
    if (notificationPermission === 'granted') {
      // Unsubscribe from notifications
      const success = await unsubscribe();
      if (success) {
        setPushSubscribed(false);
        alert('Notifications disabled successfully');
      }
    } else {
      // Request permission and subscribe
      const granted = await requestPermission();
      if (granted) {
        setNotificationPermission('granted');
        const subscribed = await subscribe();
        if (subscribed) {
          setPushSubscribed(true);
          alert('Notifications enabled successfully');
        }
      } else {
        alert('Notification permission denied');
      }
    }
  };

  return (
    <ProfessionalLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <SettingsIcon className="w-8 h-8" />
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Section */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Security Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security & Privacy
                </CardTitle>
                <CardDescription>
                  Monitor your account security and manage privacy settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SecurityDashboard />
              </CardContent>
            </Card>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Profile Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="relative">
                        <UserAvatar user={user} size="lg" />
                        <Button
                          size="sm"
                          variant="outline"
                          className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full p-0"
                          onClick={() => setShowAvatarSelector(true)}
                        >
                          <Camera className="w-3 h-3" />
                        </Button>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{user?.name}</h3>
                        <p className="text-muted-foreground">{user?.email}</p>
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => setShowAvatarSelector(true)}
                          className="p-0 h-auto text-xs"
                        >
                          Change Avatar
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Full Name
                      </label>
                      <Input
                        id="name"
                        {...register('name')}
                        className={errors.name ? 'border-destructive' : ''}
                      />
                      {errors.name && (
                        <p className="text-sm text-destructive">{errors.name.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="currency" className="text-sm font-medium">
                        Currency
                      </label>
                      <select
                        id="currency"
                        {...register('preferences.currency')}
                        className="w-full px-3 py-2 border border-input bg-background rounded-md"
                      >
                        <option value="USD">USD - US Dollar ($)</option>
                        <option value="EUR">EUR - Euro (€)</option>
                        <option value="GBP">GBP - British Pound (£)</option>
                        <option value="JPY">JPY - Japanese Yen (¥)</option>
                        <option value="CAD">CAD - Canadian Dollar (C$)</option>
                        <option value="AUD">AUD - Australian Dollar (A$)</option>
                        <option value="INR">INR - Indian Rupee (₹)</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="dateFormat" className="text-sm font-medium">
                        Date Format
                      </label>
                      <select
                        id="dateFormat"
                        {...register('preferences.dateFormat')}
                        className="w-full px-3 py-2 border border-input bg-background rounded-md"
                      >
                        <option value="MM/dd/yyyy">MM/dd/yyyy</option>
                        <option value="dd/MM/yyyy">dd/MM/yyyy</option>
                        <option value="yyyy-MM-dd">yyyy-MM-dd</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="theme" className="text-sm font-medium">
                        Theme
                      </label>
                      <select
                        id="theme"
                        {...register('preferences.theme')}
                        className="w-full px-3 py-2 border border-input bg-background rounded-md"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="system">System</option>
                      </select>
                    </div>

                    <Button type="submit" disabled={isLoading} className="w-full">
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          <span>Saving...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Save className="w-4 h-4" />
                          <span>Save Changes</span>
                        </div>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Actions Section */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-5 h-5" />
                    <span>Account Actions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    variant="outline"
                    onClick={handleExportData}
                    className="w-full justify-start"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>

                  <Button
                    variant="destructive"
                    onClick={() => setShowDeleteModal(true)}
                    className="w-full justify-start"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="w-5 h-5" />
                    <span>Notifications</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isSupported ? (
                    <>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Smartphone className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Push Notifications</p>
                            <p className="text-xs text-muted-foreground">
                              Get notified about budget alerts and recurring transactions
                            </p>
                          </div>
                        </div>
                        <Button
                          variant={notificationPermission === 'granted' ? 'destructive' : 'default'}
                          size="sm"
                          onClick={handleNotificationToggle}
                        >
                          {notificationPermission === 'granted' ? 'Disable' : 'Enable'}
                        </Button>
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        Status: {notificationPermission === 'granted' ? 'Enabled' : 
                                notificationPermission === 'denied' ? 'Blocked' : 'Not enabled'}
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Push notifications are not supported in this browser.
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Palette className="w-5 h-5" />
                    <span>Appearance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Theme settings are applied automatically based on your preference selection above.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Delete Account Modal */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete Account"
        >
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete your account? This action cannot be undone.
              All your data will be permanently removed.
            </p>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                className="flex-1"
              >
                Delete Account
              </Button>
            </div>
          </div>
        </Modal>

        {/* Avatar Selector Modal */}
        <AvatarSelector
          isOpen={showAvatarSelector}
          onClose={() => setShowAvatarSelector(false)}
          onSelect={handleAvatarSelect}
          currentAvatarId={user?.avatar}
        />
      </div>
    </ProfessionalLayout>
  );
}