// Reusable search input component
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";

interface SearchInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const SearchInput = ({ placeholder, value, onChange, className }: SearchInputProps) => {
  return (
    <Card className={className}>
      <CardContent className="pt-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardContent>
    </Card>
  );
};