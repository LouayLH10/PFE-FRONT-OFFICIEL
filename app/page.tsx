"use client"
import React, { useEffect } from 'react'
import { getUserFromToken } from './features/auth/pages/login/user';
import { useRouter } from 'next/navigation';

function page() {
  const router=useRouter();
  useEffect(() => {
    const user = getUserFromToken();
if(!user){
router.push('/features/auth/pages/login');
}
else{
  router.push('/features/dashboard/pages')
}
  }, []);
  return (
    <div>
      
    </div>
  )
}

export default page
