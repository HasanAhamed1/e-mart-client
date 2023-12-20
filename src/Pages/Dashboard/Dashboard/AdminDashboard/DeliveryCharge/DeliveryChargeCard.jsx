import axios from 'axios';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const DeliveryChargeCard = ({ disctrict, count }) => {


    const [DefaultdeliveryCharge, setDefaultdeliveryCharge] = useState(0);
    const [DiscountedDeliveryCharge, setDiscountedDeliveryCharge] = useState(0);
    const [minimumOrderLimit, setminimumOrderLimit] = useState(0);
    const [name, setname] = useState(0);

    useEffect(() => {
        setDefaultdeliveryCharge(disctrict?.DefaultdeliveryCharge)
        setDiscountedDeliveryCharge(disctrict?.DiscountedDeliveryCharge)
        setminimumOrderLimit(disctrict.minimumOrderLimit)
        setname(disctrict?.name)
    }, [disctrict])

    const [editable, setEditable] = useState(false);




    const handleSumit = () =>{
       const data =  {
          
            "name":name,
            "DefaultdeliveryCharge" : DefaultdeliveryCharge,
            "minimumOrderLimit" : minimumOrderLimit,
            "DiscountedDeliveryCharge" : DiscountedDeliveryCharge
        }
        // console.log(data)
        axios.post(`${import.meta.env.VITE_SERVER_ADDRESS}/delivery-charge`,data,{
            withCredentials:true,
        }).then(data=>{
            // console.log(data.data);
            toast.success('Successfully updated')
            setEditable(false);
        }).catch(e=>{
            console.error(e);
            toast.error('error occured');
        })
    }




    return (
        <div className='flex flex-wrap justify-center items-center gap-x-2 px-2  py-2 hover:bg-slate-100 border-b'>
            <div className='flex flex-col items-start justify-center gap-y-1'>
                <p className='text-xs p-0  m-0'>City Name</p>
                <input type="text" className='input input-bordered read-only:cursor-not-allowed rounded-md' defaultValue={disctrict?.name} readOnly />
            </div>
            <div className='flex flex-col items-start justify-center gap-y-1'>
                <p className='text-xs p-0  m-0'>Default charge</p>
                <input type='number' className='input input-bordered read-only:cursor-not-allowed rounded-md max-w-[105px]' defaultValue={disctrict?.DefaultdeliveryCharge} readOnly={!editable} onChange={(event) => setDefaultdeliveryCharge(parseFloat(event.target.value || 100000))} />
            </div>
            <div className='flex flex-col items-start justify-center gap-y-1'>
                <p className='text-xs p-0  m-0'>Min order Ammount </p>
                <input type='number' className='input input-bordered read-only:cursor-not-allowed  rounded-md  max-w-[120px]' defaultValue={disctrict?.minimumOrderLimit} readOnly={!editable} onChange={(event) => setminimumOrderLimit(parseFloat(event.target.value || 100000))} />
            </div>
            <div className='flex flex-col items-start justify-center gap-y-1'>
                <p className='text-xs p-0  m-0'>Discounted charge</p>
                <input type='number' className='input input-bordered read-only:cursor-not-allowed rounded-md  max-w-[105px]' defaultValue={disctrict?.DiscountedDeliveryCharge} readOnly={!editable} onChange={(event) => setDiscountedDeliveryCharge(parseFloat(event.target.value || 100000))} />
            </div>
            <div className=' w-12 h-full relative'>
                {
                    editable ?
                        <button onClick={handleSumit} className=" absolute -top-1 text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:bg-green-800   font-medium rounded-full text-sm px-3 py-1 text-center ">Save</button>
                        :
                        <button onClick={() => { setEditable(!editable) }} className=" absolute -top-1 text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-3 py-1 text-center ">Edit</button>

                }
            </div>

        </div>
    );
};

export default DeliveryChargeCard;