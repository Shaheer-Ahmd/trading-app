"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "./checkbox";
import { Item } from "./inventory-columns";
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
  conditions: string[];
};

enum OfferStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}

interface Offer {
  _id: string;
  offererId: string;
  items: Item[];
  status: OfferStatus;
}

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
    accessorKey: "userName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="By" />
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
      <DataTableColumnHeader column={column} title=" No. of Offers" />
    ),
  },
  {
    accessorKey: "conditions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Conditions" />
    ),
  },
  {
    accessorKey: "tradingBtn",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Live Trading" />
    ),

    cell: (cellContext) => {
      return cellContext.row.getValue("tradingBtn");
    },
  },
];
