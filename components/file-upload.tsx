import { UploadDropzone } from "@/lib/uploadThing";
import toast from "react-hot-toast";
import { ourFileRouter } from "@/app/api/uploadthing/core";

interface FileUploadProps{
    onChange:(url?:string)=>void;
    endpoint:keyof typeof ourFileRouter;
};

export const FileUpload =({
    onChange,
    endpoint
}:FileUploadProps)=>{
    return (
        <UploadDropzone
        endpoint={endpoint}
        onClientUploadComplete={(res)=>{
            console.log("------------------------------");
            console.log(res);
            onChange(res?.[0].url);
        }}
        onUploadError={(error:Error)=>{
            toast.error(`${error?.message}`);
        }}
        />
    )
}