"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import FileComponent from "../../../components/ui/File";
import { usePathname } from "next/navigation";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ProtectedRoute from "@/app/context/ProtectedRoute";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function Drive() {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    console.log(pathname);
    const fetchFiles = async () => {
      try {
        const response = await axios.get(`http://37.205.26.74:8000${pathname}`);

        // Proveri da li je odgovor validan
        if (response && response.data && response.data.items) {
          setFiles(response.data.items);
        } else {
          setError("No files found in the response.");
        }
      } catch (err) {
        // Ako dođe do greške u mrežnoj komunikaciji
        setError("An error occurred while fetching files: " + err.message);
      }
    };

    fetchFiles();
  }, []);

  const handleUpload = async () => {
    try {
      // Dohvati fajl iz inputa
      const fileInput = document.getElementById("fileInput");
      const file = fileInput?.files[0];
      if (!file) {
        alert("Please select a file to upload.");
        return;
      }

      // Kreiraj FormData objekat za slanje fajla
      const formData = new FormData();
      formData.append("file", file);

      // Pošaljite POST zahtev ka FastAPI backendu
      const response = await axios.post(
        `http://37.205.26.74:8000/upload/${pathname.replace("/drive/", "")}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast({
        title: "Success.",
        description: response.data.message,
      });
    } catch (error) {
      console.error(error);
      toast(
        {
          title: error.response?.data?.detail,
          description: "An error occurred while uploading the file."
        }
      );
    }
  };

  const [folderName, setFolderName] = useState("")

  const handleCreateFolder = async () => {
    try {
      
      const response = await axios.post(
        `http://37.205.26.74:8000/create-folder/`,
        {
          file_path: pathname.replace("/drive/", ""),
          folder_name: folderName

        }
      );

      toast({
        title: "Success.",
        description: response.data.message,
      });
    } catch (error) {
      console.error(error);
      toast(
        {
          title: error.response?.data?.detail,
          description: "An error occurred while uploading the file."
        }
      );
    }
  };

  return (
    <ProtectedRoute>
      <div className="relative overflow-x-auto px-4 md:px-16 lg:px-32 py-6">
        <div className="py-4 flex justify-between items-center">
          <p>My Drive</p>
          <div className="flex items-center gap-5">
            <FontAwesomeIcon
              icon={faArrowLeft}
              className="w-8 h-8 hover:cursor-pointer"
              onClick={() => {
                router.back();
              }}
            />

            <Dialog>
              <DialogTrigger asChild>
                <Button>Upload a file</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Upload a file</DialogTitle>
                  <DialogDescription>
                    Select or drag and drop a file to upload
                  </DialogDescription>
                </DialogHeader>

                <div>
                  <Input id="fileInput" type="file" className="" />
                </div>

                <DialogFooter>
                  <Button
                    type="submit"
                    className="mt-4"
                    onClick={() => handleUpload()}
                  >
                    Upload the file
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <FontAwesomeIcon icon={faPlus} />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create a folder</DialogTitle>
                  <DialogDescription>
                    Insert a name for the folder
                  </DialogDescription>
                </DialogHeader>

                <div>
                  <Input
                    id="folder_name"
                    type="text"
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)} // Ovdje ažurirate folderName
                  />
                </div>

                <DialogFooter>
                  <Button
                    type="submit"
                    className="mt-4"
                    onClick={() => handleCreateFolder()}
                  >
                    Create folder
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <Table>
          <TableCaption></TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead colSpan={2} className="">
                Name
              </TableHead>
              <TableHead className="hidden lg:table-cell">Size</TableHead>
              <TableHead className="hidden lg:table-cell">Created at</TableHead>
              <TableHead className="hidden lg:table-cell">
                Modified at
              </TableHead>
              <TableHead className="hidden lg:table-cell">Download</TableHead>
              <TableHead className="hidden lg:table-cell">Delete</TableHead>
              <TableHead className="lg:hidden">Options</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {files.map((file, index) => {
              return <FileComponent key={index} file={file} />;
            })}
          </TableBody>
        </Table>
      </div>
    </ProtectedRoute>
  );
}
