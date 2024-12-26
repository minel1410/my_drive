"use client"

import React, { useState, useEffect } from "react";
import axios from "axios";
import FileComponent from "../../components/ui/File";
import { usePathname } from "next/navigation";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";




export default function Drive() {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    console.log(pathname)
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

  return (
    <ContextMenu>
      <ContextMenuTrigger className="">
        <div className="relative overflow-x-auto lg:p-16">
          <div className="flex w-full justify-between py-6">
            <h1 className="font-bold text-xl">My Drive</h1>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Upload a file</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Upload a file</DialogTitle>
                  <DialogDescription>
                    Select or drag and drope a file to upload
                  </DialogDescription>
                </DialogHeader>

                <div className="">
                  <Input id="picture" type="file" className="" />
                </div>

                <DialogFooter>
                  <Button type="submit" className="mt-4">
                    Upload the file
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Table>
            <TableCaption></TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead colSpan={2} className="">
                  Name
                </TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Created at</TableHead>
                <TableHead>Modified at</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {files.map((file, index) => {
                return <FileComponent key={index} file={file} />;
              })}
            </TableBody>
          </Table>
        </div>
      </ContextMenuTrigger>

      <ContextMenuContent className="w-64">
        <ContextMenuItem inset>
          Back
          <ContextMenuShortcut>⌘[</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem inset disabled>
          Forward
          <ContextMenuShortcut>⌘]</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem inset>
          Reload
          <ContextMenuShortcut>⌘R</ContextMenuShortcut>
        </ContextMenuItem>
        
      </ContextMenuContent>
    </ContextMenu>
  );
}

  
{/* <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-16 bg-[#1B1B1B]">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="border-b">
            <th colSpan={2} className="py-4">
              Name
            </th>
            <th>Size</th>
            <th>Created at</th>
            <th>Modified at</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file, index) => {
            return <FileComponent key={index} file={file} />;
          })}
        </tbody>
      </table>
    </div> */}