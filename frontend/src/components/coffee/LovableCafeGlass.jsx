import React, { useState } from 'react';
import { Coffee, Leaf, Info, Wind } from 'lucide-react';
import { GlassButton, SegmentedControl } from '../ui/LovableGlass';
import CafeGlass3D from './CafeGlass3D';

export default function LovableCafeGlass({ initialDrink = 'coffee' }) {
  const [drink, setDrink] = useState(initialDrink);
  const [showLabels, setShowLabels] = useState(true);
  const [showSteam, setShowSteam] = useState(true);

  // Exact ingredient lists from Lovable app
  const coffeeIngredients = [
    { name: 'Foam', class: 'scene-label-0' },
    { name: 'Ice', class: 'scene-label-1' },
    { name: 'Milk', class: 'scene-label-2' },
    { name: 'Espresso', class: 'scene-label-3' },
    { name: 'Caramel', class: 'scene-label-4' },
  ];

  const teaIngredients = [
    { name: 'Mint', class: 'scene-label-0' },
    { name: 'Ice', class: 'scene-label-1' },
    { name: 'Lemon', class: 'scene-label-2' },
    { name: 'Tea leaves', class: 'scene-label-3' },
    { name: 'Amber Tea', class: 'scene-label-4' },
  ];

  const ingredients = drink === 'coffee' ? coffeeIngredients : teaIngredients;

  return (
    <div className="cafe-glass">
      {/* 3D Glass Stage */}
      <div
        className="cafe-glass-stage"
        role="img"
        aria-label={`${drink === 'coffee' ? 'Layered coffee' : 'Lemon and mint tea'} glass`}
      >
        <div className="w-full h-full relative">
          <CafeGlass3D beverageType={drink} />

          {/* Floating Ingredient Labels */}
          {showLabels && (
            <div className="scene-labels">
              {ingredients.map((ing, idx) => (
                <div
                  key={idx}
                  className={`scene-label ${ing.class} glass-subtle rounded-full font-medium shadow-glass flex items-center justify-center text-foreground hover:scale-105 spring`}
                >
                  {ing.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Segmented Controls + Action Buttons */}
      <div className="cafe-glass-controls">
        <SegmentedControl
          ariaLabel="Drink"
          value={drink}
          onChange={setDrink}
          options={[
            {
              value: 'coffee',
              label: (
                <span className="flex items-center gap-2">
                  <Coffee className="size-4" />
                  Coffee
                </span>
              ),
            },
            {
              value: 'tea',
              label: (
                <span className="flex items-center gap-2">
                  <Leaf className="size-4" />
                  Tea
                </span>
              ),
            },
          ]}
        />

        <GlassButton
          variant="glass"
          size="icon"
          aria-label="Ingredient labels"
          aria-pressed={showLabels}
          title="Ingredient labels"
          onClick={() => setShowLabels(!showLabels)}
          className={showLabels ? 'text-accent' : 'text-muted-foreground'}
        >
          <Info className="size-4" />
        </GlassButton>

        <GlassButton
          variant="glass"
          size="icon"
          aria-label="Steam"
          aria-pressed={showSteam}
          title="Steam"
          onClick={() => setShowSteam(!showSteam)}
          className={showSteam ? 'text-accent' : 'text-muted-foreground'}
        >
          <Wind className="size-4" />
        </GlassButton>
      </div>
    </div>
  );
}
