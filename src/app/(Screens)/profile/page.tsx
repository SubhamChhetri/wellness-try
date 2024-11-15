"use client"
import { signOut } from 'next-auth/react';
import React, { useState } from 'react';
import InputField from '@/components/common/InputField';
import Button from '@/components/common/Button';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

const Profile: React.FC = () => {
    const { data: session } = useSession();
    const [, setEmail] = useState('');
    const [, setName] = useState('');
    // const [password, setPassword] = useState('********');

    return (
        <div className="">
            <div className="flex justify-center mb-6">
                {/* Placeholder for profile picture */}
                <div className="w-32 h-32 rounded-full overflow-hidden">
                    <Image
                        src="https://via.placeholder.com/100"
                        alt="Profile Picture"
                        className="object-cover w-full h-full"
                    />
                </div>
            </div>

            {/* Input fields for Name, Email, and Password */}
            <InputField
                label="Name"
                type="text"
                value={session?.user.username || ''}  /* Fallback to empty string */
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3"
            />

            <InputField
                label="Email"
                type="email"
                value={session?.user.email || ''}  /* Fallback to empty string */
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3"
            />

            {/* Uncomment the following block if you want the password field */}
            {/* 
            <InputField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 "
            />
            */}

            <div className="flex justify-center mt-4"> {/* Add this div for centering */}

                {/* Log Out Button */}
                <Button
                    text="Log Out"
                    onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                    className="w-2/3 p-3 bg-red-400 text-black rounded-lg hover:bg-red-500 transition duration-200"
                />
            </div>
        </div>
    );
};

export default Profile;
