import React, { createContext, useContext, useState } from 'react';
import { AuthContext } from './AuthProvider';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const ProfileContext = createContext();

const ProfileProvider = ({children}) => {
    const {user, loading} = useContext(AuthContext);
    const { isLoading: profileLoading, isError, data : profile, error } = useQuery({
        queryKey: ['profileData', user],
        enabled: !loading,
        queryFn: async () => {
    
            const res = await axios.get(
                `${import.meta.env.VITE_SERVER_ADDRESS}/get-profile/${user?.email}`,
                { withCredentials: true }
              );
          return res?.data;
        },
      })
     const data = {profileLoading, profile}
    return (
        <ProfileContext.Provider value={data}>
            {children}
        </ProfileContext.Provider>
    );
};

export default ProfileProvider;