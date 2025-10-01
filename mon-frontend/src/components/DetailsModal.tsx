import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import React from "react";

interface DetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  data: any; // l'objet à afficher
  renderContent: (data: any) => React.ReactNode; // fonction pour afficher les détails
}

const DetailsModal: React.FC<DetailsModalProps> = ({ isOpen, onClose, title, data, renderContent }) => {
  if (!data) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title || "Détails"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-2 mt-2">{renderContent(data)}</div>

        <DialogFooter className="flex justify-end mt-4">
          <Button onClick={onClose}>Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DetailsModal;
