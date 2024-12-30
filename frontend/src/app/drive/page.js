"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import FileComponent from "../../components/ui/File";
import { usePathname } from "next/navigation";
import { faCompactDisc } from "@fortawesome/free-solid-svg-icons";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { formatFileSize } from "@/lib/utils";

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

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Progress } from "@/components/ui/progress";

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
import { useRouter } from "next/navigation";
import ProtectedRoute from "../context/ProtectedRoute";
import Link from "next/link";

export default function Drive() {
  const [drives, setDrives] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Dodato stanje za loading
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    console.log(drives);
    const fetchDrives = async () => {
      try {
        setIsLoading(true); // Postavi loading na true dok čekamo podatke
        const response = await axios.get(
          `https://server.minelsalihagic.com/drive`
        );

        // Proveri da li je odgovor validan
        if (response && response.data) {
          setDrives(response.data);
        } else {
          setError("No Drives found in the response.");
        }
      } catch (err) {
        // Ako dođe do greške u mrežnoj komunikaciji
        setError("An error occurred while fetching Drives: " + err.message);
      } finally {
        setIsLoading(false); // Kada je završeno sa fetch-ovanjem, postavi loading na false
      }
    };

    fetchDrives();
  }, []);

  return (
    <ProtectedRoute>
      <div className="relative overflow-x-auto px-4 md:px-16 lg:px-32 py-6">
        <div className="flex w-full justify-between py-6">
          <Link href="/drive" className="font-bold text-xl">My Drive</Link>
        </div>

        {/* Prikazivanje Loading indikatora */}
        {isLoading ? (
          <div className="w-full h-[60vh] flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-300 animate-spin"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
            >
              <path
                d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-900"
              ></path>
            </svg>
          </div>
        ) : (
          <Table>
            <TableCaption></TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead colSpan={2}>Name</TableHead>
                <TableHead>Size</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {drives.map((drive, index) => (
                <TableRow
                  key={index}
                  onClick={() => {
                    router.push(`/drive/${drive.device}`);
                  }}
                  className="border-b border-b-gray-600 hover:cursor-pointer"
                >
                  <TableCell className="p-4">
                    <FontAwesomeIcon className="w-6 h-6" icon={faCompactDisc} />
                  </TableCell>
                  <TableCell>{drive.device}</TableCell>
                  <TableCell className="flex flex-col gap-2">
                    <Progress
                      className="w-full md:w-1/3 lg:w-1/4"
                      value={drive.percent}
                    />
                    <div>
                      {formatFileSize(drive.free) +
                        " free of " +
                        formatFileSize(drive.total)}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </ProtectedRoute>
  );
}
