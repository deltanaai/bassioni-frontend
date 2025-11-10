import z from "zod";

export const CreateBranchSchema = z.object({
  name: z.string().min(1, "Branch name is required"),
  address: z.string().min(1, "Address is required"),
  active:z.boolean().default(true),
});