"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "./checkbox";
import { DataTableColumnHeader } from "./column-header";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Trade = {
  _id: string;
  userId: string;
  fullName: string;
  items: string;
  offers: number;
  description: string;
  price: number;
  tradingBtn: JSX.Element;
};


export const columns: ColumnDef<Trade>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "items",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Items" />
    ),
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Worth" />
    ),
  },
  {
    accessorKey: "offers",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Offers" />
    ),
  },
];
