import React from 'react';
import Link from 'next/link';

const Sidebar: React.FC = () => {
  return (
    <aside className='bg-gray-200 w-64 p-4'>
      <nav>
        <ul className='space-y-2'>
          <li>
            <Link href='/'>
              <div className='text-blue-500'>Home</div>
            </Link>
          </li>
          <li>
            <Link href='/vehicles'>
              <div className='text-blue-500'>Vehicles</div>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
