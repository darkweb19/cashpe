'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Clock, Coffee, LogIn, LogOut, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface PunchKeypadProps {
  onPunchSuccess?: () => void;
}

export function PunchKeypad({ onPunchSuccess }: PunchKeypadProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNumberClick = (num: string) => {
    if (code.length < 4) {
      setCode(code + num);
    }
  };

  const handleClear = () => {
    setCode('');
  };

  const handlePunch = async (action: string) => {
    if (code.length !== 4) {
      toast.error('Please enter a 4-digit code');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/punch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          punchCode: code,
          action
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`${data.message} - ${data.employee.name}`);
        setCode('');
        onPunchSuccess?.();
      } else {
        toast.error(data.error || 'Punch failed');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Clock className="h-5 w-5" />
          Employee Punch System
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Code Display */}
        <div className="text-center">
          <div className="text-sm text-muted-foreground mb-2">Enter your 4-digit code</div>
          <div className="flex justify-center gap-2 mb-4">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className="w-12 h-12 border-2 border-border rounded-lg flex items-center justify-center text-xl font-mono bg-muted"
              >
                {code[index] ? '●' : ''}
              </div>
            ))}
          </div>
        </div>

        {/* Number Keypad */}
        <div className="grid grid-cols-3 gap-3">
          {numbers.map((num) => (
            <Button
              key={num}
              variant="outline"
              size="lg"
              className="h-12 text-lg font-mono"
              onClick={() => handleNumberClick(num)}
              disabled={loading}
            >
              {num}
            </Button>
          ))}
          <Button
            variant="outline"
            size="lg"
            className="h-12 col-span-3 text-destructive"
            onClick={handleClear}
            disabled={loading}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => handlePunch('punch-in')}
            disabled={loading || code.length !== 4}
            className="h-12"
          >
            <LogIn className="h-4 w-4 mr-2" />
            Punch In
          </Button>
          <Button
            onClick={() => handlePunch('punch-out')}
            disabled={loading || code.length !== 4}
            variant="secondary"
            className="h-12"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Punch Out
          </Button>
          <Button
            onClick={() => handlePunch('break-start')}
            disabled={loading || code.length !== 4}
            variant="outline"
            className="h-12"
          >
            <Coffee className="h-4 w-4 mr-2" />
            Start Break
          </Button>
          <Button
            onClick={() => handlePunch('break-end')}
            disabled={loading || code.length !== 4}
            variant="outline"
            className="h-12"
          >
            <Coffee className="h-4 w-4 mr-2" />
            End Break
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}