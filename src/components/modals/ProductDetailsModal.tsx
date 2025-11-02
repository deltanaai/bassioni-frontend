'use client'

import React from 'react'
import { Dialog } from '../ui/Dialog'

interface Batch {
  id: number;
  batchNumber?: string;
  quantity: number;
  expDate: string;
}

interface Warehouse {
  id: number;
  name: string;
  batches: Batch[];
}

interface ProductDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  warehouses: Warehouse[];
}

const ProductDetailsModal = ({open, onOpenChange, warehouses}:ProductDetailsModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} ></Dialog>
  )
}

export default ProductDetailsModal