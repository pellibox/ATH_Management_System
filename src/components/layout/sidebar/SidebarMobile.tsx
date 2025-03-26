
import React from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';

interface SidebarMobileProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  children: React.ReactNode;
}

export default function SidebarMobile({ open, setOpen, children }: SidebarMobileProps) {
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 left-4 z-50"
        onClick={() => setOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="p-0 w-64">
          {children}
        </SheetContent>
      </Sheet>
    </>
  );
}
