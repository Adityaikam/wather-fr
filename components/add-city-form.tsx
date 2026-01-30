"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface AddCityFormProps {
  onSubmit: (city: string, minTemp?: number, maxTemp?: number) => Promise<void>;
  loading?: boolean;
  error?: string;
}

export function AddCityForm({ onSubmit, loading = false, error }: AddCityFormProps) {
  const [city, setCity] = useState("");
  const [minTemp, setMinTemp] = useState<string>("");
  const [maxTemp, setMaxTemp] = useState<string>("");
  const [formError, setFormError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!city.trim()) {
      setFormError("City name is required");
      return;
    }

    const minTempNum = minTemp ? parseFloat(minTemp) : undefined;
    const maxTempNum = maxTemp ? parseFloat(maxTemp) : undefined;

    if (minTempNum !== undefined && maxTempNum !== undefined && minTempNum > maxTempNum) {
      setFormError("Minimum temperature must be less than maximum temperature");
      return;
    }

    try {
      await onSubmit(city, minTempNum, maxTempNum);
      setCity("");
      setMinTemp("");
      setMaxTemp("");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to add city");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="city" className="block text-sm font-medium mb-2">
          City Name
        </label>
        <Input
          id="city"
          placeholder="e.g., London, New York, Tokyo"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          disabled={loading}
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="minTemp" className="block text-sm font-medium mb-2">
            Min Temp (°C) - Optional
          </label>
          <Input
            id="minTemp"
            type="number"
            placeholder="e.g., 5"
            value={minTemp}
            onChange={(e) => setMinTemp(e.target.value)}
            disabled={loading}
            step="0.1"
          />
        </div>
        <div>
          <label htmlFor="maxTemp" className="block text-sm font-medium mb-2">
            Max Temp (°C) - Optional
          </label>
          <Input
            id="maxTemp"
            type="number"
            placeholder="e.g., 35"
            value={maxTemp}
            onChange={(e) => setMaxTemp(e.target.value)}
            disabled={loading}
            step="0.1"
          />
        </div>
      </div>

      {(formError || error) && (
        <div className="p-3 rounded-md bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-800 dark:text-red-200">{formError || error}</p>
        </div>
      )}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Adding City...
          </>
        ) : (
          "Add City"
        )}
      </Button>
    </form>
  );
}
