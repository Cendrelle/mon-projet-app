
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MenuItem } from '@/types/restaurant';

interface CustomizationModalProps {
  item: MenuItem;
  onConfirm: (customizations: any) => void;
  onCancel: () => void;
}

const CustomizationModal = ({ item, onConfirm, onCancel }: CustomizationModalProps) => {
  const [selectedCooking, setSelectedCooking] = useState('');
  const [selectedSides, setSelectedSides] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  const handleSideToggle = (side: string) => {
    setSelectedSides(prev => 
      prev.includes(side) 
        ? prev.filter(s => s !== side)
        : [...prev, side]
    );
  };

  const handleConfirm = () => {
    onConfirm({
      cooking: selectedCooking,
      sides: selectedSides,
      notes: notes.trim()
    });
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Personnaliser - {item.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {item.cookingOptions && (
            <div>
              <Label className="text-base font-medium">Cuisson</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {item.cookingOptions.map((option) => (
                  <Button
                    key={option}
                    variant={selectedCooking === option ? "default" : "outline"}
                    className={selectedCooking === option ? "bg-restaurant-500" : ""}
                    onClick={() => setSelectedCooking(option)}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {item.sides && (
            <div>
              <Label className="text-base font-medium">Accompagnements</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {item.sides.map((side) => (
                  <Button
                    key={side}
                    variant={selectedSides.includes(side) ? "default" : "outline"}
                    className={selectedSides.includes(side) ? "bg-restaurant-500" : ""}
                    onClick={() => handleSideToggle(side)}
                  >
                    {side}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="notes" className="text-base font-medium">
              Remarques particulières
            </Label>
            <Textarea
              id="notes"
              placeholder="Allergies, préférences..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-2"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onCancel} className="flex-1">
              Annuler
            </Button>
            <Button 
              onClick={handleConfirm} 
              className="flex-1 bg-restaurant-500 hover:bg-restaurant-600"
            >
              Ajouter au panier
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomizationModal;
