"use client"

import { AlertModal } from '@/components/modals/alert-modal'
import { Separator } from "@/components/ui/separator";
import Heading from '@/components/ui/heading'
import { useOrigin } from '@/hooks/use-origin'
import { zodResolver } from '@hookform/resolvers/zod'
import { Subcat } from '@prisma/client'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

interface SubcatFormProps{
    initialData: Subcat | null
}
const formSchema = z.object({
    name: z.string().min(1),
    value: z.string().min(1),
});
type SubcatFormValues = z.infer<typeof formSchema>;

const SubcatForm: React.FC<SubcatFormProps> = 
({
    initialData
}) => {
    const params = useParams();
    const router = useRouter();
    const origin = useOrigin();

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const title = initialData ? "Edit subcat" : "Create subcat";
    const description = initialData ? "Edit a subcat" : "Create a new subcat";
    const toastMessage = initialData ? "Subcat updated." : "Subcat created";
    const action = initialData ? "Save changes" : "Create";

    const form = useForm<SubcatFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: '',
            value: ''
        }
    });

    const onSubmit = async (data: SubcatFormValues) => {
        try {
            setLoading(true)
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/subcat/${params.subcatId}`, data);
            } else {
                await axios.post(`/api/${params.storeId}/subcat`, data);
            }
            router.refresh();
            router.push(`/${params.storeId}/subcat`);
            toast.success(toastMessage)
        } catch (error) {
            toast.error(toastMessage)
        } finally{
            setLoading(false)
        }
    }
    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/subcat/${params.subcatId}`);
            router.refresh();
            router.push(`/${params.storeId}/subcat`);
            toast.success("Subcat deleted.");
        } catch (error) {
            toast.error("Make sure you removed all product using this subcat first.")
        } finally{
            setLoading(false);
            setOpen(false);
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
 <div className="flex items-center justify-between">
        
        <Heading
        title={title}
        description={description}
        />
        {initialData && (
            <Button 
            disabled={loading} 
            variant="destructive" 
            size="icon" 
            onClick={() => setOpen(true)}
            ><Trash className="h-4 w-4"/></Button>

        )}
    </div>
    <Separator/>
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-full'>
        
    <div className='grid grid-cols-3 gap-8'>
        <FormField
        control={form.control}
        name='name'
        render={({field}) => (
            <FormItem>
                <FormLabel>
                    Name
                </FormLabel>
                <FormControl>
                    <Input
                    disabled={loading}
                    placeholder="Name Label" {...field}
                    />
                </FormControl>
                <FormMessage/>
            </FormItem>
        )}
        />
        <FormField
        control={form.control}
        name='value'
        render={({field}) => (
            <FormItem>
                <FormLabel>
                    Value
                </FormLabel>
                <FormControl>
                    <Input
                    disabled={loading}
                    placeholder="Value Label" {...field}
                    />
                </FormControl>
                <FormMessage/>
            </FormItem>
        )}
        />
    </div>
    <Button
    disabled={loading}
    className='ml-auto'
    type='submit'
    >
        {action}
    </Button>
    </form>

    </Form>
    <Separator/>
    </>
  )
}

export default SubcatForm