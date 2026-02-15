"use client"

import { useState, useTransition } from "react"
import { MoreHorizontal, Trash } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { deleteProduct } from "@/lib/actions"

interface DeleteProductButtonProps {
    id: string
}

export function DeleteProductButton({ id }: DeleteProductButtonProps) {
    const [isPending, startTransition] = useTransition()

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this product?")) return

        startTransition(async () => {
            const result = await deleteProduct(id)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success("Product deleted successfully")
            }
        })
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    aria-haspopup="true"
                    size="icon"
                    variant="ghost"
                    disabled={isPending}
                >
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Toggle menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={handleDelete}
                    disabled={isPending}
                >
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
