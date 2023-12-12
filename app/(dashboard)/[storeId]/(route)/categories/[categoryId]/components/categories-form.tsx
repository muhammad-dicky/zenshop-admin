"use client"

import { AlertModal } from "@/components/modals/alert-modal";
import { Alert } from "@/components/ui/alert";
import { ApiAlert } from "@/components/ui/api-alert";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Heading from "@/components/ui/heading";
import ImageUpload from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useOrigin } from "@/hooks/use-origin";
import { zodResolver } from "@hookform/resolvers/zod";
import { Billboard, Category, Store } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";



interface CategoryFormProps{
    initialData: Category | null;
}


const formSchema = z.object({
    name: z.string().min(1),
    billboardId: z.string().min(1),
});
type CategoryFormValues = z.infer<typeof formSchema>;



const CategoryForm: React.FC<CategoryFormProps> = ({
    initialData
}) => {
    const params = useParams();
    const router = useRouter();
    const origin = useOrigin();



    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);


    const title = initialData ? "Edit categories" : "Create categories";
    const description = initialData ? "Edit a categories" : "Create a new categories";
    const toastMessage = initialData ? "Categories updated." : "Categories created.";
    const action = initialData ? "Save changes" : "Create";

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: '',
            billboardId: ''
        }
    })

    const onSubmit = async (data: CategoryFormValues) => {
        try {
            setLoading(true);
            if(initialData) {
                await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`, data);
            } else{
                await axios.post(`/api/${params.storeId}/categories`, data);
            }
            
            router.refresh();
            router.push(`/${params.storeId}/categories`)
            toast.success("Store updated.");
        } catch (error) {
            toast.error(toastMessage)
        } finally{
            setLoading(false);
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`);
            router.refresh();
            router.push(`/${params.storeId}/billboards`);
            toast.success("Categoriess deleted.");
        } catch (error) {
            toast.error("Make sure you removed all categoires using this billboard first.");
            console.log(error)
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
        <div className="grid grid-cols-3 gap8">

        </div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
            
                <div className="grid grid-cols-3 gap-8">
                    <FormField 
                    control={form.control}
                    name="name"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input disabled={loading} placeholder="Category name" {...field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                   />
                    <FormField 
                    control={form.control}
                    name="billboardId"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Billboard</FormLabel>
                            <Select
                            disabled={loading}
                            onValueChange={field.onChange}
                            value={field.value}
                            defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue
                                        defaultValue={field.value}
                                        placeholder="Select a billboard"
                                        />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    
                                </SelectContent>
                            </Select>
                            <FormMessage/>
                        </FormItem>
                    )}
                   />
                </div>
                <Button disabled={loading} className="ml-auto" type="submit">
                    {action}
                </Button>
            </form>
        </Form>
        <Separator/>
        {/* <ApiAlert 
        title="NEXT_PUBLIC_API_URL" 
        description={`${origin}/api/${params.storeId}`} 
        variant="public"/> */}
        </>
     );
}


export default CategoryForm;
 