"use client";

import {
    ColumnDef,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    useReactTable,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { useUidStore } from "@/store";
import axios from "axios";
import confetti from "canvas-confetti";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function ItemsTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [conditions, setConditions] = useState<string[]>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    select: true,
    _id: false,
    name: true,
    description: true,
    price: true,
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
      columnVisibility,
    },
  });

  const createTrade = async () => {
    const itemIds: string[] = table
      .getSelectedRowModel()
      .rows.map((row) => row.original._id);
    const uid = useUidStore.getState().uid;
    axios
      .post("https://trading-app-a69n.onrender.com/" + "createTrade", {
        userId: uid,
        itemIds: itemIds,
        conditions: conditions,
      })
      .then((response) => {
        confetti();
        setConditions([]);
      })
      .catch((error) => {
        console.log(error);
        alert(error.response.data);
      });
  };

  return (
    <div>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col items-center justify-center">
        <h1 className="p-3 text-3xl font-bold text-center">Conditions</h1>
        {conditions.map((condition, index) => {
          return <p key={index}>{condition}</p>;
        })}
        <form
          onSubmit={(e: any) => {
            e.preventDefault();
            setConditions([...conditions, e.target[0].value]);
          }}
        >
          <Input placeholder="Add condition" className="p-2" />
          <Button type="submit" className="border rounded-full">
            +
          </Button>
        </form>
      </div>

      <Button onClick={createTrade} className="mt-4">
        Create Trade
      </Button>
    </div>
  );
}
