import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, Smartphone, CheckCircle } from 'lucide-react';

interface QRCodeScannerProps {
  onScanComplete: (tableNumber: string) => void;
}

const QRCodeScanner = ({ onScanComplete }: QRCodeScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanned, setScanned] = useState(false);

  const simulateScan = () => {
    console.log('Début de la simulation du scan...');
    setIsScanning(true);
    setTimeout(() => {
      console.log('Scan terminé, mise à jour de l\'état...');
      setIsScanning(false);
      setScanned(true);
      setTimeout(() => {
        console.log('Appel de onScanComplete...');
        onScanComplete('Table 12');
      }, 1000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-restaurant-400 to-restaurant-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-md animate-fade-in">
        <CardContent className="p-8 text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-restaurant-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <QrCode className="w-10 h-10 text-restaurant-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Bienvenue sur Easy Restaurant
            </h1>
            <p className="text-gray-600">
              Scannez le QR code de votre table pour commencer
            </p>
          </div>

          {!scanned ? (
            <div className="space-y-4">
              {isScanning ? (
                <div className="animate-pulse">
                  <div className="w-32 h-32 border-4 border-restaurant-300 border-dashed rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Smartphone className="w-8 h-8 text-restaurant-500 animate-bounce" />
                  </div>
                  <p className="text-restaurant-600 font-medium">Scan en cours...</p>
                </div>
              ) : (
                <>
                  <div className="w-32 h-32 border-4 border-restaurant-300 border-dashed rounded-lg flex items-center justify-center mx-auto mb-4 hover-scale cursor-pointer">
                    <QrCode className="w-16 h-16 text-restaurant-400" />
                  </div>
                  <Button 
                    onClick={simulateScan}
                    className="w-full bg-restaurant-500 hover:bg-restaurant-600 text-white"
                    size="lg"
                  >
                    Scan du QR Code
                  </Button>
                </>
              )}
            </div>
          ) : (
            <div className="animate-scale-in">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <p className="text-green-600 font-medium text-lg">
                Table détectée ! Redirection...
              </p>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Commandez et payez directement depuis votre smartphone
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QRCodeScanner;
