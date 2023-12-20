import  {  useEffect } from 'react';
import { useLocation } from 'react-router-dom';


function AutoBackToTop() {
  const path = useLocation();
  useEffect(()=>{
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

  },[path])
  

  return null;
}

export default AutoBackToTop;