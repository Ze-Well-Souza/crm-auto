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
    <Card className={`bg-white/5 dark:bg-white/5 border border-white/10 backdrop-blur-xl ${className}`}>
      <CardContent className="pt-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-purple-400" />
          <Input
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-400 focus:border-purple-500/50 focus:ring-purple-500/20"
          />
        </div>
      </CardContent>
    </Card>
  );
};