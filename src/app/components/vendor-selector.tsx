import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { mockVendors } from "../lib/mock-data";

interface VendorSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function VendorSelector({ value, onValueChange }: VendorSelectorProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a Vendor" />
      </SelectTrigger>
      <SelectContent>
        {mockVendors.map((vendor) => (
          <SelectItem key={vendor.id} value={vendor.id}>
            <div className="flex flex-col">
              <span>{vendor.name}</span>
              <span className="text-xs text-muted-foreground">
                {vendor.type} • {vendor.location}
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
