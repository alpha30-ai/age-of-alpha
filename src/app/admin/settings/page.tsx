import { redirect } from 'next/navigation';

export default function OldSettingsRedirect() {
  redirect('/settings');
}
