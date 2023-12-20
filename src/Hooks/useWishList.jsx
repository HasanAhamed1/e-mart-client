import { useQuery } from '@tanstack/react-query'
import { useContext } from 'react';
import { AuthContext } from '../Contexts/AuthProvider';
import axios from 'axios';
// import useAxiosSecure from './useAxiosSecure';
// import axios from 'axios';
const useWishList = () => {
    const { user, loading } = useContext(AuthContext);
    const { refetch, data: wishList = [] } = useQuery({
        queryKey: ['wishLists', user?.email],
        enabled: !loading,
        queryFn: async () => {
          
            const res = await axios.get(`${import.meta.env.VITE_SERVER_ADDRESS}/get-wish-list?email=${user?.email}`, { withCredentials: true })
            // console.log(res.data?.cart);
            return res?.data?.wishList;
        },
    });


    return [wishList, refetch]
};

export default useWishList;