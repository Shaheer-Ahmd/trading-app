import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "./checkbox";
import { Item } from "./inventory-columns";

enum OfferStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}

export interface Offer {
  _id: string;
  fullName: string;
  offererId: string;
  items: Item[];
  status: OfferStatus;
  cash: number;
}

export const columns: ColumnDef<Offer>[] = [
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
    header: "id",
  },
  {
    accessorKey: "offererId",
    header: "OffererId",
  },
  {
    accessorKey: "fullName",
    header: "By",
  },
  {
    accessorKey: "items",
    header: "Items",
    // cell: (c) => {
    //     console.log(c.row.getValue("items"))
    //     // return items.map((item) => item.name).join(", ")
    // }
  },
  {
    accessorKey: "cash",
    header: "Cash Offered",
  },
];
