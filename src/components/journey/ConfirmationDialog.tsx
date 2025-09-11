
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { FieldItem } from "@/lib/types";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
  duration: number;
  data: string[] | FieldItem[];
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  cancelText,
  duration,
  data,
}: ConfirmationDialogProps) {
  const [countdown, setCountdown] = useState(duration);

  const handleConfirm = useCallback(() => {
    onConfirm();
  }, [onConfirm]);

  useEffect(() => {
    if (isOpen) {
      setCountdown(duration);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleConfirm();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isOpen, duration, handleConfirm]);

  const renderData = () => {
    if (data.length === 0) return null;
    
    if (typeof data[0] === 'string') {
        return (
            <div className="flex flex-wrap gap-2 justify-center">
                {(data as string[]).map((item, index) => (
                    <Badge key={index} variant="secondary" className="text-lg">{item}</Badge>
                ))}
            </div>
        )
    }

    return (
        <ul className="space-y-2 text-sm text-left">
            {(data as FieldItem[]).filter(item => item.text).map((item, index) => (
                <li key={index} className="flex justify-between items-center p-2 bg-muted/50 rounded-md">
                    <span className="flex-1">{item.text}</span>
                    <Badge variant="outline">Rating: {item.weight}</Badge>
                </li>
            ))}
        </ul>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="my-4 max-h-60 overflow-y-auto p-1">
            {renderData()}
        </div>
        <DialogFooter className="sm:justify-between flex-col-reverse sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose}>
            {cancelText}
          </Button>
          <Button onClick={handleConfirm}>
            {confirmText} ({countdown})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
