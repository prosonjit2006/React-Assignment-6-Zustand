import { FieldValues, Path } from "react-hook-form";

export type DynamicInputProps<T extends FieldValues = FieldValues> = {
  label: string;
  name: Path<T>;
  type?: string;
  // register: UseFormRegister<T>;
  register: any;
  error?: string;
  isTextarea?: boolean;
  rows?: number;
  disabled?: boolean;
};
