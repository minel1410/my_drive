
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
  faFileText 
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

import Link from "next/link";

function formatFileSize(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`; // Ako je veličina manja od 1 KB, prikazuje u B
  } else if (bytes < 1024 * 1024) {
    const kb = bytes / 1024;
    return `${kb.toFixed(2)} KB`; // Prikazuje u KB sa 2 decimale
  } else if (bytes < 1024 * 1024 * 1024) {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`; // Prikazuje u MB sa 2 decimale
  } else {
    const gb = bytes / (1024 * 1024 * 1024);
    return `${gb.toFixed(2)} GB`; // Prikazuje u GB sa 2 decimale
  }
}

function formatDate(timestamp) {
  const now = new Date();
  const date = new Date(timestamp * 1000); // UNIX timestamp je u sekundama, pa množi sa 1000 za milisekunde

  // Proveri ako je datum danas
  if (now.toDateString() === date.toDateString()) {
    return "Today";
  }

  // Proveri ako je datum juče
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (yesterday.toDateString() === date.toDateString()) {
    return "Yesterday";
  }

  // Proveri ako je datum u ovoj sedmici
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay()); // Prvi dan sedmice
  if (date >= startOfWeek) {
    return "This week";
  }

  // Ako nije ni jedan od prethodnih, formatiraj kao mesec dan, godina
  const options = { year: "numeric", month: "short", day: "numeric" };
  return date.toLocaleDateString("en-US", options); // Ispisuje kao "Sep 18, 2024"
}

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
    const router = useRouter();

    const handleClick = () => {
    
        if(file.type == 'folder')
            router.push(`${file.path}`);
        else{
            window.open(`http://37.205.26.74:8000${file.path}`);
        }
    };

     return (
        
       <TableRow className="border-b border-b-gray-600 hover:cursor-pointer" onClick={handleClick}>
           <TableCell className="p-4">
             <FontAwesomeIcon className="w-6 h-6" icon={checkIcon(file.type)} />
           </TableCell>
           <TableCell>{file.name}</TableCell>
           <TableCell>{formatFileSize(file.size)}</TableCell>
           <TableCell>{formatDate(file.created)}</TableCell>
           <TableCell>{formatDate(file.modified)}</TableCell>
       </TableRow>
     );
}

export default FileComponent;