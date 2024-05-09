import { ColumnDef } from "@tanstack/react-table";
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
  price: number;
}

export const columns: ColumnDef<Offer>[] = [
  {
    accessorKey: "_id",
    header: "id",
  },
  {
    accessorKey: "offererId",
    header: "OffererId",
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
    header: "Cash",
  },
];
