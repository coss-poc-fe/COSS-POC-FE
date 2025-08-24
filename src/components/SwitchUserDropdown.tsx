import { DropdownMenu } from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';

export default function SwitchUserDropdown() {
  const router = useRouter();

  return (
    <DropdownMenu
      triggerLabel="Switch User"
      items={[
        { label: 'Customer 1', onClick: () => router.push('/customer1') },
        { label: 'Customer 2', onClick: () => router.push('/customer2') },
        { label: 'Admin', onClick: () => router.push('/admin') },
      ]}
    />
  );
}
