"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    // 使用 window.location 强制刷新确保状态清除
    window.location.href = "/auth/login";
  };

  return <Button onClick={logout}>退出登录</Button>;
}
