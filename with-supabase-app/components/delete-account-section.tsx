'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export function DeleteAccountSection() {
  const [showDialog, setShowDialog] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleDeleteAccount = async () => {
    if (!email) {
      setError('请输入邮箱地址');
      return;
    }
    if (!password) {
      setError('请输入密码');
      return;
    }

    setIsDeleting(true);
    setError('');

    try {
      const response = await fetch('/api/account/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setEmail('');
        setPassword('');
      } else {
        setError(data.error || '注销失败，请稍后重试');
      }
    } catch {
      setError('注销失败，请稍后重试');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    setShowDialog(false);
    setEmail('');
    setPassword('');
    setError('');
    setSuccess(false);
  };

  return (
    <>
      <div className="mt-8 text-center animate-fade-in-up delay-200">
        <button
          onClick={() => setShowDialog(true)}
          className="text-xs text-muted-foreground/60 hover:text-destructive transition-colors duration-300"
        >
          注销账号
        </button>
      </div>

      <AlertDialog open={showDialog} onOpenChange={handleClose}>
        <AlertDialogContent className="border-destructive/30">
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/20">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <AlertDialogTitle>注销账号</AlertDialogTitle>
            </div>
            <AlertDialogDescription asChild>
              <div className="pt-4 space-y-3 text-sm text-muted-foreground">
                <p className="text-destructive font-medium">
                  警告：此操作不可逆！
                </p>
                <p>
                  注销账号后，您将无法再使用该邮箱登录，所有数据将被永久删除：
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>所有项目及生成的文档</li>
                  <li>购买的点数余额</li>
                  <li>账户信息</li>
                </ul>
                <p className="text-destructive">
                  如需再次使用，请重新注册。
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>

          {success ? (
            <div className="py-4 text-center text-green-500">
              账号已成功注销，该邮箱已无法登录
            </div>
          ) : (
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="delete-email">邮箱地址</Label>
                <Input
                  id="delete-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-destructive/30 focus:border-destructive"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="delete-password">登录密码</Label>
                <Input
                  id="delete-password"
                  type="password"
                  placeholder="请输入您的登录密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-destructive/30 focus:border-destructive"
                />
              </div>
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              {success ? '关闭' : '取消'}
            </AlertDialogCancel>
            {!success && (
              <AlertDialogAction
                onClick={handleDeleteAccount}
                disabled={isDeleting || !email || !password}
                className="bg-destructive hover:bg-destructive/90"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {isDeleting ? '注销中...' : '确认注销'}
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
