
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faFolder, 
  faFileLines, 
  faFileAudio, 
  faFilePdf, 
  faImage, 
  faFileWord, 
  faFileExcel, 
  faFileVideo, 
  faFileZipper, 
  faFileAlt, 
  faFileCode, 
  faFileArchive, 
  faFileText,
  faCircleDown,
  faTrash,
  faEllipsisVertical
} from "@fortawesome/free-solid-svg-icons";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "./button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import Link from "next/link";

import { formatFileSize, formatDate } from "@/lib/utils";

import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


function checkIcon(fileType) {
    if (fileType === 'folder') {
        return faFolder;
    } else if (fileType === 'text/plain') {
        return faFileLines; // Text files
    } else if (fileType === 'application/msword' || fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        return faFileWord; // Word documents
    } else if (fileType === 'application/vnd.ms-excel' || fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        return faFileExcel; // Excel documents
    } else if (fileType === 'application/pdf') {
        return faFilePdf; // PDF files
    } else if (fileType === 'audio/mpeg') {
        return faFileAudio; // MP3 audio files
    } else if (fileType === 'video/mp4' || fileType === 'video/mkv' || fileType === 'video/avi') {
        return faFileVideo; // Video files (MP4, MKV, AVI)
    } else if (fileType === 'image/jpeg' || fileType === 'image/png' || fileType === 'image/gif' || fileType === 'image/svg+xml') {
        return faImage; // Image files (JPEG, PNG, GIF, SVG)
    } else if (fileType === 'application/zip' || fileType === 'application/x-tar' || fileType === 'application/x-rar-compressed' || fileType === 'application/gzip') {
        return faFileZipper; // Compressed files (ZIP, TAR, RAR, GZIP)
    } else if (fileType === 'application/json') {
        return faFileAlt; // JSON files
    } else if (fileType === 'application/xml') {
        return faFileCode; // XML files
    } else if (fileType === 'application/javascript') {
        return faFileCode; // JavaScript files
    } else if (fileType === 'application/x-sh') {
        return faFileCode; // Shell script files
    } else if (fileType === 'text/html') {
        return faFileCode; // HTML files
    } else if (fileType === 'text/css') {
        return faFileCode; // CSS files
    } else if (fileType === 'application/octet-stream') {
        return faFileAlt; // Binary files
    } else if (fileType === 'application/msaccess') {
        return faFileExcel; // MS Access files
    } else if (fileType === 'application/vnd.ms-powerpoint') {
        return faFilePowerpoint; // PowerPoint files
    } else if (fileType === 'text/csv') {
        return faFileLines; // CSV files
    } else if (fileType === 'text/markdown') {
        return faFileLines; // Markdown files
    } else if (fileType === 'application/x-www-form-urlencoded') {
        return faFileText; // URL-encoded files
    } else if (fileType === 'application/rtf') {
        return faFileWord; // RTF files
    } else if (fileType === 'application/x-bzip2') {
        return faFileZipper; // Bzip2 compressed files
    } else if (fileType === 'audio/wav') {
        return faFileAudio; // WAV audio files
    } else if (fileType === 'application/vnd.oasis.opendocument.text') {
        return faFileWord; // ODT files
    } else if (fileType === 'application/vnd.oasis.opendocument.spreadsheet') {
        return faFileExcel; // ODS files
    } else if (fileType === 'application/x-7z-compressed') {
        return faFileZipper; // 7z compressed files
    } else {
        return faFileAlt; // Default generic file icon
    }
}

const FileComponent = ({file}) => {

    const { toast } = useToast();
    

    const router = useRouter();

    const handleClick = () => {
    
        if(file.type == 'folder')
            router.push(`${file.path}`);
        else{
            window.open(`https://server.minelsalihagic.com${file.path}`);
        }
    };


    const handleDelete = async () => {
      try {
        const response = await axios.delete(
          `https://server.minelsalihagic.com/delete${file.path.replace("/drive", "")}`
        );

        toast({
          title: "Success.",
          description: "File or directory deleted successfully.",
        });
      } catch (error) {
        // Provera da li je greška došla sa servera
        if (
          error.response &&
          error.response.data &&
          error.response.data.detail
        ) {
          toast({
            title: "Error.",
            description: error.response.data.detail, // Detaljna poruka o grešci sa servera
          });
        } else {
          // Generalna greška ako ne postoji detaljan odgovor
          toast({
            title: "Uh oh! Something went wrong.",
            description: "There was a problem with your request.",
          });
        }
      }
    };

  const handleDownload = async () => {
    try {
      // Posaljite zahtev za preuzimanje fajla
      const response = await axios.get(
        `https://server.minelsalihagic.com/download${file.path.replace("/drive", "")}`,
        {
          responseType: "blob", // Važno za preuzimanje fajla kao blob
        }
      );

      // Kreiranje URL-a za preuzeti fajl
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Kreirajte link za preuzimanje i kliknite na njega
      const link = document.createElement("a");
      link.href = url;

      // Ako je preuzimanje direktorijuma, dodeljujemo ZIP ekstenziju
      const filename = file.name.endsWith(".zip")
        ? file.name
        : `${file.name}.zip`;
      link.setAttribute("download", filename); // Koristite ime fajla za preuzimanje
      document.body.appendChild(link);
      link.click(); // Aktivirajte preuzimanje

      // Očistite URL nakon preuzimanja
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success.",
        description: "Download started successfully",
      });
    } catch (error) {
      toast({
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    }
  };

     return (
       <TableRow className="border-b border-b-gray-600 hover:cursor-pointer">
         {/* Ikona tipa fajla */}
         <TableCell className="p-4" onClick={handleClick}>
           <FontAwesomeIcon className="w-6 h-6" icon={checkIcon(file.type)} />
         </TableCell>

         {/* Naziv fajla */}
         <TableCell className="max-w-[200px] break-words" onClick={handleClick}>
           {file.name}
         </TableCell>

         {/* Ostale kolone (vidljive samo na većim ekranima) */}
         <TableCell className="hidden lg:table-cell" onClick={handleClick}>
           {formatFileSize(file.size)}
         </TableCell>
         <TableCell className="hidden lg:table-cell" onClick={handleClick}>
           {formatDate(file.created)}
         </TableCell>
         <TableCell className="hidden lg:table-cell" onClick={handleClick}>
           {formatDate(file.modified)}
         </TableCell>

         {/* Ikona za preuzimanje */}
         <TableCell className="hidden lg:table-cell">
           <FontAwesomeIcon
             className="w-6 h-6"
             icon={faCircleDown}
             onClick={handleDownload} // Pozivanje funkcije za preuzimanje
           />
         </TableCell>

         {/* Ikona za brisanje */}
         <TableCell className="hidden lg:table-cell">
           <Dialog>
             <DialogTrigger asChild>
               <FontAwesomeIcon
                 className="w-6 h-6 text-red-700"
                 icon={faTrash}
               />
             </DialogTrigger>
             <DialogContent className="sm:max-w-[425px]">
               <DialogHeader>
                 <DialogTitle>Are you sure</DialogTitle>
                 <DialogDescription>
                   Deleting this file is an irreversible action!
                 </DialogDescription>
                 <div className="h-6"></div>
               </DialogHeader>
               <DialogFooter>
                 <Button
                   type="submit"
                   variant="destructive"
                   onClick={handleDelete}
                 >
                   Yes, I am sure
                 </Button>
               </DialogFooter>
             </DialogContent>
           </Dialog>
         </TableCell>

         {/* Dugme za opcije */}
         <TableCell className="lg:hidden">
           <DropdownMenu>
             <DropdownMenuTrigger asChild>
               <FontAwesomeIcon icon={faEllipsisVertical} className="w-6 h-6" />
             </DropdownMenuTrigger>

             <DropdownMenuContent className="">
               <DropdownMenuLabel>File information</DropdownMenuLabel>

               <DropdownMenuItem>
                 Size: <b>{formatFileSize(file.size)}</b>
               </DropdownMenuItem>
               <DropdownMenuItem>
                 Created at: <b>{formatDate(file.created)}</b>
               </DropdownMenuItem>
               <DropdownMenuItem>
                 Modified at: <b>{formatDate(file.modified)}</b>
               </DropdownMenuItem>

               <DropdownMenuSeparator />
               <DropdownMenuLabel>File actions</DropdownMenuLabel>

               {/* Download button */}
               <DropdownMenuItem>
                 <p onClick={(e) => handleDownload(e)}>Download</p>
               </DropdownMenuItem>

               {/* Delete button with Dialog */}
               <DropdownMenuItem
                 onClick={(e) => {
                   e.stopPropagation(); // Sprečava zatvaranje DropdownMenu
                 }}
               >
                 <Dialog>
                   <DialogTrigger asChild>
                     <p>Delete</p>
                   </DialogTrigger>
                   <DialogContent className="sm:max-w-[425px]">
                     <DialogHeader>
                       <DialogTitle>Are you sure</DialogTitle>
                       <DialogDescription>
                         Deleting this file is an irreversible action!
                       </DialogDescription>
                       <div className="h-6"></div>
                     </DialogHeader>
                     <DialogFooter>
                       <Button
                         type="submit"
                         variant="destructive"
                         onClick={handleDelete}
                       >
                         Yes, I am sure
                       </Button>
                     </DialogFooter>
                   </DialogContent>
                 </Dialog>
               </DropdownMenuItem>
             </DropdownMenuContent>
           </DropdownMenu>
         </TableCell>
       </TableRow>
     );
}

export default FileComponent;


 