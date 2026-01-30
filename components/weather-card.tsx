"use client";

import { AlertCircle, Cloud, CloudRain, Sun, Droplets } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertBadgeProps {
  alert: boolean;
  minTemp?: number;
  maxTemp?: number;
}

export function AlertBadge({ alert, minTemp, maxTemp }: AlertBadgeProps) {
  if (!alert) {
    return (
      <div className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded-full text-sm font-medium">
        <div className="w-2 h-2 bg-green-600 rounded-full" />
        Normal
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-full text-sm font-medium">
      <AlertCircle className="w-4 h-4" />
      Alert
    </div>
  );
}

interface WeatherIconProps {
  temp: number;
  description?: string;
}

export function WeatherIcon({ temp, description }: WeatherIconProps) {
  const tempLower = description?.toLowerCase() || "";

  if (tempLower.includes("rain")) {
    return <CloudRain className="w-12 h-12 text-blue-500" />;
  } else if (tempLower.includes("cloud")) {
    return <Cloud className="w-12 h-12 text-gray-500" />;
  } else if (temp > 20) {
    return <Sun className="w-12 h-12 text-yellow-500" />;
  } else {
    return <Cloud className="w-12 h-12 text-gray-400" />;
  }
}

interface TemperatureGaugeProps {
  temperature: number;
  minTemp?: number;
  maxTemp?: number;
  showRange?: boolean;
}

export function TemperatureGauge({
  temperature,
  minTemp,
  maxTemp,
  showRange = true,
}: TemperatureGaugeProps) {
  const getTemperatureColor = (temp: number, min?: number, max?: number) => {
    if (min !== undefined && temp < min) return "text-blue-600 dark:text-blue-400";
    if (max !== undefined && temp > max) return "text-red-600 dark:text-red-400";
    return "text-orange-600 dark:text-orange-400";
  };

  // Handle undefined or null temperature
  const displayTemp = temperature ?? 0;

  return (
    <div className="space-y-2">
      <div className="flex items-baseline gap-1">
        <span className={cn("text-4xl font-bold", getTemperatureColor(displayTemp, minTemp, maxTemp))}>
          {displayTemp.toFixed(1)}°
        </span>
        <span className="text-lg text-gray-500 dark:text-gray-400">C</span>
      </div>

      {showRange && (minTemp !== undefined || maxTemp !== undefined) && (
        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          {minTemp !== undefined && (
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-blue-500" />
              Min: {minTemp}°C
            </div>
          )}
          {maxTemp !== undefined && (
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              Max: {maxTemp}°C
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface WeatherCardProps {
  city: string;
  temperature: number;
  description?: string;
  alert: boolean;
  minTemp?: number;
  maxTemp?: number;
  onDelete?: () => void;
  onSettings?: () => void;
  loading?: boolean;
}

export function WeatherCard({
  city,
  temperature,
  description = "Clear",
  alert,
  minTemp,
  maxTemp,
  onDelete,
  onSettings,
  loading = false,
}: WeatherCardProps) {
  return (
    <div className={cn(
      "rounded-lg border border-border bg-card text-card-foreground p-6 shadow-sm hover:shadow-md transition-shadow",
      alert && "border-red-500/50 bg-red-50 dark:bg-red-950/20"
    )}>
      {loading && (
        <div className="absolute inset-0 bg-white/50 dark:bg-black/50 rounded-lg flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-2xl font-bold">{city}</h3>
          <p className="text-sm text-muted-foreground capitalize">{description}</p>
        </div>
        <AlertBadge alert={alert} minTemp={minTemp} maxTemp={maxTemp} />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <WeatherIcon temp={temperature} description={description} />
          <TemperatureGauge
            temperature={temperature}
            minTemp={minTemp}
            maxTemp={maxTemp}
            showRange={true}
          />
        </div>
      </div>

      {(onDelete || onSettings) && (
        <div className="flex gap-2 mt-4 pt-4 border-t border-border">
          {onSettings && (
            <button
              onClick={onSettings}
              className="flex-1 px-3 py-2 text-sm font-medium rounded-md border border-border hover:bg-accent transition-colors"
            >
              Settings
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="flex-1 px-3 py-2 text-sm font-medium rounded-md bg-red-600 hover:bg-red-700 text-white transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}
