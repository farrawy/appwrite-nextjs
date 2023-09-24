'use client';
import appwriteService from '@/appwrite/config';
import { Models } from 'appwrite';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Avatar from './Avatar';

const ProfileCard = () => {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
    null,
  );

  const [email, setEmail] = useState({
    newEmail: '',
    newPassword: '',
  });

  const isEmailVerified = user?.emailVerification;

  useEffect(() => {
    (async () => {
      const userData = await appwriteService.getCurrentUser();
      if (userData) {
        setUser(userData);
      }
    })();
  }, []);

  const sendVerificationEmail = async () => {
    try {
      await appwriteService.sendVerificationEmail();
      alert('Verification email sent successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to send verification email.');
    }
  };

  return (
    user && (
      <>
        <div className="flex gap-y-6 flex-wrap">
          <div className="flex w-full gap-x-4 items-center">
            <div className="shrink-0 w-20">
              <Avatar img="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" />
            </div>
            <div className="relative">
              <p className="font-bold text-xl w-full mb-1">{user.name}</p>
              <div className="text-[12px] p-0.5 inline-block rounded-md bg-gradient-to-tr from-primary to-secondary">
                <button className="px-2 rounded-md font-bold bg-black">
                  FREE
                </button>
              </div>
            </div>
          </div>
          <div className="bg-gray-200/70 rounded-xl px-8 py-8 w-full flex gap-y-4 flex-wrap">
            <div className="relative w-full">
              <p className="text-sm text-gray-700">Display Name</p>
              <p className="font-semibold">{user.name}</p>
            </div>
            <div className="relative w-full">
              <p className="text-sm text-gray-700">Email Id</p>
              <p className="font-semibold">{user.email}</p>
              <input
                className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                type="email"
                value={email.newEmail}
                onChange={(e) => {
                  setEmail({
                    ...email,
                    newEmail: e.target.value,
                  });
                }}
              />
              <input
                className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                type="password"
                value={email.newPassword}
                onChange={(e) => {
                  setEmail({
                    ...email,
                    newPassword: e.target.value,
                  });
                }}
              />
              <button
                onClick={async () => {
                  try {
                    const res = await appwriteService.updateEmail(
                      email.newEmail,
                      email.newPassword,
                    );
                    // Update the user state with the new email.
                    setUser((prevUser) => {
                      if (prevUser) {
                        return {
                          ...prevUser,
                          email: email.newEmail,
                        };
                      }
                      return prevUser;
                    });
                    setEmail({
                      newEmail: '',
                      newPassword: '',
                    });
                  } catch (error) {
                    console.error(error);
                    // Inform the user about the error.
                    alert('Failed to update email.');
                  }
                }}
              >
                Update Email
              </button>
              {!isEmailVerified && (
                <button onClick={sendVerificationEmail}>
                  Send Verification Email
                </button>
              )}
            </div>
            <div className="relative w-full">
              <p className="text-sm text-gray-700">Phone Number</p>
              <p className="font-semibold">999-888-7777</p>
            </div>
            <div className="relative w-full">
              <p className="text-sm text-gray-700">Password</p>
              <p className="font-semibold">********</p>
            </div>
          </div>
          <div className="w-full flex justify-center">
            <Link
              href={'/logout'}
              className="bg-gray-200/70 rounded-xl px-6 py-3 inline-block hover:bg-gray-100 duration-150"
            >
              Logout
            </Link>
          </div>
        </div>
      </>
    )
  );
};

export default ProfileCard;
