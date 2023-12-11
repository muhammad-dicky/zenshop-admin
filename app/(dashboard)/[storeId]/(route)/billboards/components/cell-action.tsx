"use client"

import { Button } from '@/components/ui/button'
import React from 'react'
import { BillboardColumn } from './columns'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Copy, Edit, MoreHorizontal, Trash } from 'lucide-react';

interface cellActionProps {
    data: BillboardColumn;
}

export const CellAction: React.FC<cellActionProps> = ({
    data
}) => {
  return (
    <DropdownMenu>
        <DropdownMenuTrigger>
            <Button variant={"ghost"} className='h-8 w-8 p-0'>
                <span className='sr-only'>Open menu</span>
                <MoreHorizontal className='h-4 w-4'/>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
            <DropdownMenuLabel>
                Actions
            </DropdownMenuLabel>
            <DropdownMenuItem>
                <Copy className='w-4 h-4 mr-2'/>
                Copy Id
            </DropdownMenuItem>
            <DropdownMenuItem>
                <Edit className='w-4 h-4 mr-2'/>
                Update
            </DropdownMenuItem>
            <DropdownMenuItem>
                <Trash className='w-4 h-4 mr-2'/>
                Delete
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
  )
}
