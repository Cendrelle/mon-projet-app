import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface NotesModalProps {
  onConfirm: (notes: string) => void;
  onCancel: () => void;
  currentNotes?: string;
}

const NotesModal = ({ onConfirm, onCancel, currentNotes = '' }: NotesModalProps) => {
  const [notes, setNotes] = useState(currentNotes);

  const handleConfirm = () => {
    onConfirm(notes.trim());
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Autres remarques</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="notes" className="text-base font-medium">
              Remarques pour votre commande
            </Label>
            <Textarea
              id="notes"
              placeholder="Allergies, préférences, demandes spéciales..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-2"
              rows={4}
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
              Confirmer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotesModal;