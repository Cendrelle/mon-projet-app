import { useState } from "react";
import { Button } from "@/components/ui/button"; // adapter selon ton projet
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,} from '@/components/ui/dialog'

interface RespondModalProps {
  reviewId: number;
  isOpen: boolean;
  onClose: () => void;
  onRespond: (id: number, response: string) => void;
}

const RespondModal: React.FC<RespondModalProps> = ({ reviewId, isOpen, onClose, onRespond }) => {
  const [response, setResponse] = useState("");

  const handleSubmit = () => {
    onRespond(reviewId, response);
    setResponse("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Répondre à l'avis #{reviewId}</DialogTitle>
        </DialogHeader>
        <Textarea
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder="Écrire votre réponse ici..."
        />
        <DialogFooter className="flex justify-end gap-2 mt-2">
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button onClick={handleSubmit}>Envoyer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RespondModal;
