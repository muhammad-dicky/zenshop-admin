"use client"

import { AlertModal } from '@/components/modals/alert-modal'
import { Separator } from "@/components/ui/separator";
import Heading from '@/components/ui/heading'
import { useOrigin } from '@/hooks/use-origin'
import { zodResolver } from '@hookform/resolvers/zod'
import { Size } from '@prisma/client'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { Form, useForm } from 'react-hook-form'
import * as z from 'zod'

interface SizeFormProps{
    initialData: Size | null
}
const formSchema = z.object({
    name: z.string().min(1),
    value: z.string().min(1),
});
type SizeFormValues = z.infer<typeof formSchema>;

const SizeForm: React.FC<SizeFormProps> = ({
    initialData
}) => {
    const params = useParams();
    const router = useRouter();
    const origin = useOrigin();

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const title = initialData ? "Edit size" : "Create size";
    const description = initialData ? "Edit a size" : "Create a new size";
    const toastMessage = initialData ? "Size updated." : "Size created";
    const action = initialData ? "Save changes" : "Create";

    const form = useForm<SizeFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: '',
            value: ''
        }
    });

    const onSubmit = (data:any) => {
        console.log(data)
    }
    const onDelete = () => {
        console.log("hapus")
    }

  return (
    <>
    <AlertModal
    isOpen={open}
    onClose={() => setOpen(false)}
    onConfirm={onDelete}
    loading={loading}
    />

    <Separator/>
    <Form {...form}>
        <form>

        </form>
    </Form>
    <div>
        halo cuy
    </div>
    </>
  )
}

export default SizeForm