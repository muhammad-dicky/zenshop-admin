"use client"

import { useParams, useRouter } from "next/navigation";
import { SizeColumn } from "./column"
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { AlertModal } from "@/components/modals/alert-modal";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";

interface cellActionProps {
    data: SizeColumn;
}

export const CellAction: React.FC<cellActionProps> = ({
    data
}) => {
    const router = useRouter();
    const params = useParams();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);


    const onCopy = (id:string) => {
        navigator.clipboard.writeText(id);
        toast.success("Size Id copied to clipboard.");
    }

    const onDelete = async () => {
        try {
            setLoading(true)
            await axios.delete(`/api/${params.storeId}/sizes/${data.id}`);
            router.refresh();
            toast.success("Size deleted.");
        } catch (error) {
            toast.error("Make sure you remoed all products using this size")
        }finally{
            setLoading(false)
            setOpen(false)
        }
    }



    return (
        <>
        <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
        />
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
            <DropdownMenuItem
            onClick={() => onCopy(data.id)}
            >
                <Copy className='w-4 h-4 mr-2'/>
                Copy Id
            </DropdownMenuItem>
            <DropdownMenuItem
            onClick={() => router.push(`/${params.storeId}/sizes/${data.id}`)}
            >
                <Edit className='w-4 h-4 mr-2'/>
                Update
            </DropdownMenuItem>
            <DropdownMenuItem
            onClick={() => setOpen(true)}
            >
                <Trash className='w-4 h-4 mr-2'/>
                Delete
            </DropdownMenuItem>
        </DropdownMenuContent>
        </DropdownMenu>
        </>
    )
}