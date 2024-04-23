"use client"

import * as React from 'react';
import NotFoundPage from '@/components/site_info/not_found';

declare global {
  interface Window {
    tc: any; // whatever type you want to give. (any,number,float etc)
  }
}

export default function UsersPage() {
  return (
    <>
      <NotFoundPage />
    </>
  )
}
