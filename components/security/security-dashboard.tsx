'use client';

import { useState, useEffect } from 'react';
import { Shield, Lock, Eye, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SecurityEvent {
  id: string;
  type: 'login' | 'failed_login' | 'password_change' | 'data_access';
  timestamp: Date;
  ip: string;
  userAgent: string;
  success: boolean;
  details?: string;
}

export function SecurityDashboard() {
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [securityScore, setSecurityScore] = useState(85);

  useEffect(() => {
    // Mock security events - in production, fetch from API
    const mockEvents: SecurityEvent[] = [
      {
        id: '1',
        type: 'login',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        ip: '192.168.1.100',
        userAgent: 'Chrome/120.0.0.0',
        success: true,
      },
      {
        id: '2',
        type: 'failed_login',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        ip: '203.0.113.45',
        userAgent: 'Unknown',
        success: false,
        details: 'Invalid password attempt',
      },
      {
        id: '3',
        type: 'data_access',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        ip: '192.168.1.100',
        userAgent: 'Chrome/120.0.0.0',
        success: true,
        details: 'Exported transaction data',
      },
    ];
    
    setSecurityEvents(mockEvents);
  }, []);

  const getEventIcon = (type: SecurityEvent['type'], success: boolean) => {
    if (!success) return <AlertTriangle className="h-4 w-4 text-red-500" />;
    
    switch (type) {
      case 'login':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'password_change':
        return <Lock className="h-4 w-4 text-blue-500" />;
      case 'data_access':
        return <Eye className="h-4 w-4 text-purple-500" />;
      default:
        return <Shield className="h-4 w-4 text-gray-500" />;
    }
  };

  const getEventTypeLabel = (type: SecurityEvent['type']) => {
    switch (type) {
      case 'login':
        return 'Login';
      case 'failed_login':
        return 'Failed Login';
      case 'password_change':
        return 'Password Change';
      case 'data_access':
        return 'Data Access';
      default:
        return 'Unknown';
    }
  };

  const getSecurityScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Security Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className={`text-3xl font-bold ${getSecurityScoreColor(securityScore)}`}>
                {securityScore}/100
              </div>
              <p className="text-sm text-muted-foreground">
                Your account security rating
              </p>
            </div>
            <div className="text-right">
              <Badge variant={securityScore >= 80 ? 'default' : 'destructive'}>
                {securityScore >= 80 ? 'Good' : 'Needs Improvement'}
              </Badge>
            </div>
          </div>
          
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Strong Password</span>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
            <div className="flex justify-between text-sm">
              <span>Recent Login Activity</span>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
            <div className="flex justify-between text-sm">
              <span>Secure Connection</span>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Security Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Security Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {securityEvents.length > 0 ? (
              securityEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getEventIcon(event.type, event.success)}
                    <div>
                      <p className="font-medium">
                        {getEventTypeLabel(event.type)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {event.timestamp.toLocaleString()} • {event.ip}
                      </p>
                      {event.details && (
                        <p className="text-xs text-muted-foreground">
                          {event.details}
                        </p>
                      )}
                    </div>
                  </div>
                  <Badge variant={event.success ? 'default' : 'destructive'}>
                    {event.success ? 'Success' : 'Failed'}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No security events recorded</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Security Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Security Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center gap-3">
                <Lock className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="font-medium">Enable Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
              </div>
              <Button size="sm" variant="outline">
                Enable
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <div>
                  <p className="font-medium">Regular Password Updates</p>
                  <p className="text-sm text-muted-foreground">
                    Your password was last updated recently
                  </p>
                </div>
              </div>
              <Badge variant="default">Complete</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}