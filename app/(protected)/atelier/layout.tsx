import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function ProtectedAtelierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get('kinform_prod_auth')?.value === 'true';

  if (!isAuthenticated) {
    redirect('/atelier/login');
  }

  return <>{children}</>;
}
