import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const useAllUserProfile = () => {
    const { refetch, data: userProfiles = [] } = useQuery({
        queryKey: ['userProfiles'],
        queryFn: async () => {
            const res = await axios.get(`https://e-mart-server-one.vercel.app/get-all-user-profile`, {withCredentials: true})
            // console.log(res.data)
            return res.data;
        },
          });
    

    return [userProfiles, refetch]
};

export default useAllUserProfile;