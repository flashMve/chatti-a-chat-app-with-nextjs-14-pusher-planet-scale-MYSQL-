import { FC } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import Link from "next/link";

type MobileSideBarProps = {
    children: React.ReactNode;
    };

const MobileSideBar: FC<MobileSideBarProps> = ({children}) => {
  return (
    <div className="fixed top-0 inset-x-0 py-2 px-4 flex">
      <Sheet key={'left'}>
        <SheetTrigger asChild>
          <div className="w-full flex justify-between items-center">
            <Link
              href="/dashboard"
              className="flex shrink-0 h-16 w-16 items-center"
            >
              <Icons.logo className="h-8 w-auto text-indigo-600" />
            </Link>

            <Button variant="outline">
              Menu <Icons.menu className="h-8 w-8" />
            </Button>
          </div>
        </SheetTrigger>
        <SheetContent side={'left'} className="m-0 p-0">
          {children}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileSideBar;
