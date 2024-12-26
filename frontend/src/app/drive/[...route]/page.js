"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import FileComponent from "../../../components/ui/File";
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

export default function Drive() {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const pathname = usePathname();

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

  return (
    <div className="relative overflow-x-auto lg:p-16">
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
  );
}
