//TAG SELECTOR

'use client';

import { useState } from 'react';
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import slugify from 'slugify';

type Tag = { id: string; name: string; slug: string };

type Props = {
  value: Tag[];
  onChange: (tags: Tag[]) => void;
  availableTags: Tag[]; // Autocomplete tag dari DB
};

export function TagSelector({ value = [], onChange, availableTags }: Props) {
  const [input, setInput] = useState('');

  const handleAddTags = (inputString: string) => {
    console.log(inputString);

    const parts = inputString
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !value.some((tag) => tag.name === s));

    if (parts.length === 0) return;

    // console.log(parts);
    const newTags = parts.map((name) => ({
      id: '',
      name,
      slug: slugify(name),
    }));

    const updated = [...value, ...newTags];
    onChange(updated);
    setInput('');
  };

  const handleSelectTag = (tag: Tag) => {
    if (value.some((t) => t.id === tag.id)) return;
    onChange([...value, tag]);
    setInput('');
  };

  const handleRemoveTag = (id: string) => {
    const updated = value.filter((t) => t.id !== id);
    onChange(updated);
  };

  // Filter suggestions, exclude already selected
  const filteredSuggestions = availableTags.filter(
    (tag) =>
      tag.name.toLowerCase().includes(input.toLowerCase()) &&
      !value.some((v) => v.id === tag.id),
  );

  return (
    <div className="space-y-2 bg-background p-2 rounded-md">
      <Command>
        <CommandInput
          placeholder="Type tags and press Enter (comma-separated)"
          value={input}
          onValueChange={setInput}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && input.trim()) {
              e.preventDefault();
              handleAddTags(input.trim());
            }
          }}
        />
        <CommandGroup className="block">
          <div>
            {filteredSuggestions.map((tag) => (
              <div key={tag.id}>
                <CommandItem
                  onSelect={() => handleSelectTag(tag)}
                  className="px-3 py-1 w-auto whitespace-nowrap"
                >
                  {tag.name}
                </CommandItem>
              </div>
            ))}
          </div>
          {input &&
            !filteredSuggestions.some((t) => t.name === input.trim()) && (
              <CommandItem
                onSelect={() => handleAddTags(input)}
                className="px-3 py-1 w-auto whitespace-nowrap"
              >
                Create tag: <span className="ml-1 font-semibold">{input}</span>
              </CommandItem>
            )}
        </CommandGroup>

        <div className="flex flex-wrap gap-2 mt-2">
          {value.map((tag) => (
            <Badge key={tag.id} variant="secondary">
              {tag.name}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveTag(tag.id)}
                className="ml-1 h-4 w-4 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      </Command>
    </div>
  );
}
