import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";


interface SettingsProps {
    params: {
        storeId: string;
    }
}

const SettingsPage: React.FC<SettingsProps> =async ({
    params
}) => {
    const {userId} = auth();

    if(!userId){
        redirect("/sign-in");
    }
    const store = await prismadb.store.findFirst({
        where: {
            id: params.storeId,
            userId: userId
        },
    })
    if(!store){
        redirect("/");
    }

    return (  
        <div>
            ini nih settings
        </div> 
    );
}
 
export default SettingsPage;