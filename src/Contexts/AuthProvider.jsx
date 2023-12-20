import React, { createContext, useEffect, useState } from 'react';
import {createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile} from 'firebase/auth';
import app from '../firebase/firebase.config';
import axios from 'axios';
import Cookies from 'js-cookie';
import Loading from '../Pages/Shared/Loading/Loading';

export const AuthContext = createContext();
const auth = getAuth(app)

const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    }
    const logIn = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    }
    const logOut = () => {
        
        setLoading(true);
        return signOut(auth);
    }

    const updateUserProfile = (name) => {
        return updateProfile(auth.currentUser, {
            displayName: name 
        });
    }

    // useEffect( () => {
    //     const unsubscribe = onAuthStateChanged(auth, currenUser => {
    //         setUser(currenUser);

    //         if(currenUser){
    //             axios.post('${import.meta.env.VITE_SERVER_ADDRESS}/jwt', {email: currenUser.email})
    //             .then(data => {
    //                 localStorage.setItem('access-token', data.data.token)
    //             })
    //         }
    //         else{
    //             localStorage.removeItem('access-token')
    //         }
    //         setLoading(false);
    //     });
    //     return () => unsubscribe();
    // }, [])

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
          
    
          if (currentUser) {
            const email = {email:currentUser.email}
            axios.post(`${import.meta.env.VITE_SERVER_ADDRESS}/jwt`, email , { withCredentials: true } )
              .then((response) => {
                const token = response.data.token;
                console.log(token, "token")
                Cookies.set("_at", token, { secure: true, sameSite: 'none' });
              })
              .catch((error) => {
                console.error('Error fetching token:', error);
              }).finally(()=>{
                setLoading(false);
              });
              
          } 
          else{
            console.log('ewfergetg')
            axios.delete(`${import.meta.env.VITE_SERVER_ADDRESS}/jwt`, { withCredentials: true } )
              .then((response) => {
                // console.log('habijabi')
                Cookies.remove("_at");
                setLoading(false);
              })
              .catch((e) => {
                console.log(e)
                console.error(e?.response?.data?.message);
              });
            
          }
          
        });
    
        return () => unsubscribe();
      }, []);

    const authInfo = {
        createUser,
        logIn,
        logOut,
        updateUserProfile,
        user,
        loading,
        setLoading
        
    }

    if(loading){
      return <Loading></Loading>
      // return <><p className='text-red-600 text-4xl'><span className="loading loading-infinity loading-lg"></span>Loading...</p></>
    }
    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;