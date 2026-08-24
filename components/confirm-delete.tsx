"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmDeleteProps {
  onConfirm: () => void;
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export function ConfirmDelete({
  onConfirm,
  children,
  title = "Delete this record?",
  description = "This action cannot be undone.",
}: ConfirmDeleteProps) {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    console.log("Dialog open state changing to:", newOpen);
    setOpen(newOpen);
  };

  const handleConfirm = () => {
    console.log("Confirm clicked, calling onConfirm");
    setOpen(false);
    onConfirm();
  };

  const handleCancel = () => {
    console.log("Cancel clicked, closing dialog");
    setOpen(false);
  };

  const handleTriggerClick = (e: React.MouseEvent) => {
    console.log("Trigger clicked, opening dialog");
    e.preventDefault();
    e.stopPropagation(); // Stop event from bubbling up
    setOpen(true);
  };

  console.log("Current dialog open state:", open);

  return (
    <div onClick={handleTriggerClick} onMouseDown={(e) => e.stopPropagation()}>
      {children}
      <AlertDialog open={open} onOpenChange={handleOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}