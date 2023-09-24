'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import appwriteService from '@/appwrite/config';
import { useRouter } from 'next/navigation';

const Verify = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  const secret = searchParams.get('secret');
  const router = useRouter();

  useEffect(() => {
    if (userId && secret) {
      appwriteService
        .updateVerificationEmail(userId, secret)
        .then((isVerified) => {
          if (isVerified) {
            router.push('/profile');
          }
        });
    }
  }, [userId, secret]);

  return <div>Verifying...</div>;
};

export default Verify;
