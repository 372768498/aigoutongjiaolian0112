import { redirect } from 'next/navigation';

export default function RootPage() {
  // 默认跳转到主页
  redirect('/home');
}