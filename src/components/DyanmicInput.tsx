"use client";

import { memo, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DynamicInputProps } from "@/types/type/component.type";

const DynamicInput = ({
  label,
  name,
  type = "text",
  register,
  error,
  isTextarea = false,
  rows = 4,
  disabled = false,
}: DynamicInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type;

  return (
    <div className="space-y-2 mb-3">
      <Label htmlFor={name}>{label}</Label>

      {isTextarea ? (
        <Textarea
          id={name}
          rows={rows}
          {...register(name)}
          className="transition-all focus:ring-2 focus:ring-purple-500"
        />
      ) : (
        <div className="relative">
          <Input
            id={name}
            type={inputType}
            {...register(name)}
            className={`transition-all focus:ring-2 focus:ring-purple-500 ${
              type === "password" ? "pr-10" : ""
            }`}
            disabled={disabled}
          />

          {type === "password" && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default memo(DynamicInput);
