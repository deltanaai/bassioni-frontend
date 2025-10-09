'use server'

import { CompanyWarehouseCreateData } from '@/types'
import {api} from '../axios'
import { companyWarehouseCreateSchema } from '@/schemas/Warehouse'


export async function createWarehouseAction(input: CompanyWarehouseCreateData, token? :string) {

  const parsed = companyWarehouseCreateSchema.safeParse(input)
 
  const res = await api.post("company/dashboard/warehouses", parsed.data, {
    withCredentials: true,
    headers: { 'authorization': `Bearer ${token}` },
  })

  return res.data
}


