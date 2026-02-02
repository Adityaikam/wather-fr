"use client";

import { useEffect, useState } from "react";
import { weatherService, FavoriteCity } from "@/lib/weatherService";
import { WeatherCard } from "@/components/weather-card";
import { AddCityForm } from "@/components/add-city-form";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/app/theme-toggle";
import { Loader2, Plus, RefreshCw } from "lucide-react";

export default function Home() {
  const [favorites, setFavorites] = useState<FavoriteCity[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addingCity, setAddingCity] = useState(false);
  const [error, setError] = useState<string>("");

  const loadFavorites = async () => {
    try {
      setLoading(true);
      setError("");
      const cities = await weatherService.getFavoriteCities();
      setFavorites(cities);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load cities");
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const handleAddCity = async (city: string, minTemp?: number, maxTemp?: number) => {
    try {
      setAddingCity(true);
      setError("");
      const newCity = await weatherService.addFavoriteCity(city, minTemp, maxTemp);
      setFavorites([...favorites, newCity]);
      setShowAddForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add city");
      throw err;
    } finally {
      setAddingCity(false);
    }
  };

  const handleDeleteCity = async (id: number) => {

    try {
      // it shoudd haveboth optionsok and calcel
      if (confirm("Are you sure you want to delete this city?")) {
        setError("");
        await weatherService.deleteFavoriteCity(id);
        setFavorites(favorites.filter((city) => city.id !== id));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete city");
    }
  };

  const handleSync = async () => {
    try {
      setSyncing(true);
      setError("");
      await weatherService.syncWeather();
      await loadFavorites();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sync weather");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Weather Dashboard</h1>
            <p className="text-sm text-muted-foreground">Monitor your favorite cities</p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="outline"
              size="sm"
              onClick={handleSync}
              disabled={syncing || loading}
            >
              {syncing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Sync All
                </>
              )}
            </Button>
            <Button onClick={() => setShowAddForm(!showAddForm)} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add City
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add City Form */}
        {showAddForm && (
          <div className="mb-8 p-6 rounded-lg border border-border bg-card">
            <h2 className="text-lg font-semibold mb-4">Add New City</h2>
            <AddCityForm
              onSubmit={handleAddCity}
              loading={addingCity}
              error={error}
            />
          </div>
        )}

        {/* Error Message */}
        {error && !showAddForm && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            <button
              onClick={() => setError("")}
              className="text-sm text-red-700 dark:text-red-300 underline mt-2"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Loading your cities...</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && favorites.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 rounded-lg border border-dashed border-border bg-card/50 p-8">
            <div className="text-center max-w-sm">
              <h3 className="text-lg font-semibold mb-2">No cities yet</h3>
              <p className="text-muted-foreground mb-6">
                Add your first city to start monitoring weather and temperature alerts.
              </p>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First City
              </Button>
            </div>
          </div>
        )}

        {/* Cities Grid */}
        {!loading && favorites.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Your Favorite Cities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((city) => (
                <WeatherCard
                  key={city.id}
                  city={city.city}
                  temperature={city.temperature}
                  alert={city.alert}
                  minTemp={city.minTemp}
                  maxTemp={city.maxTemp}
                  onDelete={() => handleDeleteCity(city.id)}
                  loading={false}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
