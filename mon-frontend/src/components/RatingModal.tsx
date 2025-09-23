import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';

interface RatingModalProps {
  onConfirm: (rating: number, notes: string) => void;
  onCancel: () => void;
  initialRating?: number;
  initialNotes?: string;
}

const RatingModal = ({
  onConfirm,
  onCancel,
  initialRating = 0,
  initialNotes = ''
}: RatingModalProps) => {
  const [rating, setRating] = useState<number>(initialRating);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [notes, setNotes] = useState<string>(initialNotes);

  const handleConfirm = () => {
    if (rating === 0) return; // On peut demander à l'utilisateur de choisir au moins 1 étoile
    onConfirm(rating, notes.trim());
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle>Noter votre commande</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-8 h-8 cursor-pointer transition-colors ${
                  star <= (hoverRating || rating) ? 'text-yellow-400' : 'text-gray-300'
                }`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
              />
            ))}
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Ajouter un commentaire (facultatif)
            </label>
            <Textarea
              id="notes"
              placeholder="Allergies, préférences, remarques..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full"
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

export default RatingModal;
